#!/usr/bin/env python3
"""
solver.py - Full timetable solver with diagnostics and corrected elective handling.

Key features:
- assign_vars keyed by tuple: (section_id, subj_id, week, day, start_period)
- assign_var_covers keyed by same tuple -> list of covered (sid, week, day, period) slots
- assignment_meta keyed by tuple -> (sid, subj_id, faculty_id, length)
- sec_subj_vars[(sid, subj_id)] -> list of (w, d, p) start candidates
- Elective groups: virtual copies driven by a single master var per subject option per slot;
  aggregated subject totals applied once per elective subject option.
- Diagnostics run before hard constraints to detect obvious infeasibilities.
- Soft constraints collected into penalties and minimized.
- Faculty daily min/max constraints are included but commented out (per request).
"""

import logging
import math
from collections import defaultdict
from typing import Dict, List, Any, Tuple

from ortools.sat.python import cp_model

# -------------------------
# Logging setup
# -------------------------
logger = logging.getLogger("src.timetable.solver")
logger.setLevel(logging.DEBUG)
if not logger.handlers:
    h = logging.StreamHandler()
    h.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
    logger.addHandler(h)


# -------------------------
# Small ModelBuilder wrapper
# -------------------------
class ModelBuilder:
    def __init__(self):
        self.model = cp_model.CpModel()
        self.var_count = 0
        self.constraint_count = 0

    def NewBoolVar(self, name: str):
        v = self.model.NewBoolVar(name)
        self.var_count += 1
        logger.debug("NewBoolVar: %s", name)
        return v

    def NewIntVar(self, lo: int, hi: int, name: str):
        v = self.model.NewIntVar(lo, hi, name)
        self.var_count += 1
        logger.debug("NewIntVar: %s [%d,%d]", name, lo, hi)
        return v

    def add(self, expr):
        """Add a hard constraint (no OnlyEnforceIf chaining via this helper)."""
        self.model.Add(expr)
        self.constraint_count += 1


# -------------------------
# Main builder function
# -------------------------
def build_cp_model(
    normalized: Dict[str, Any],
    inputs: Dict[str, Any],
    periods_per_day: int = 8,
    days_per_week: int = 6,
    default_weeks: int = 19,
    lab_room_capacity: int = 2,
) -> Tuple[cp_model.CpModel, Dict[str, Any]]:
    """
    Build the CP-SAT model from normalized inputs.

    Returns:
        model, meta
    where meta contains:
      - assign_vars: mapping (sid,subj,w,d,p) -> BoolVar
      - assign_var_covers: mapping key -> list of covered slots (sid,w,d,period)
      - assignment_meta: mapping key -> (sid,subj,faculty,length)
      - sec_subj_vars: mapping (sid,subj) -> list of (w,d,p)
      - ... other helper maps
    """

    builder = ModelBuilder()

    # -------------------------
    # Read normalized / inputs
    # -------------------------
    normalized_sections: List[Any] = normalized.get("normalized_sections", [])
    subject_periods_map: Dict[str, int] = normalized.get("sec_sub_periods_map", {})
    section_classroom_map: Dict[str, str] = normalized.get("section_classroom_map", {})
    subjects_master: List[Any] = inputs.get("subjects_master", []) or []

    # quick subject master lookup
    subjects_lookup = {s.id: s for s in subjects_master}

    weeks = int(normalized.get("working_weeks", default_weeks))
    days = list(range(days_per_week))
    periods = list(range(periods_per_day))

    logger.info("Starting model build: weeks=%d days/week=%d periods/day=%d", weeks, days_per_week, periods_per_day)
    logger.info("Sections=%d | Subject masters=%d", len(normalized_sections), len(subjects_master))

    # -------------------------
    # Core data structures
    # -------------------------
    assign_vars: Dict[Tuple[str, str, int, int, int], cp_model.IntVar] = {}
    assign_var_covers: Dict[Tuple[str, str, int, int, int], List[Tuple[str, int, int, int]]] = {}
    sec_subj_vars: Dict[Tuple[str, str], List[Tuple[int, int, int]]] = defaultdict(list)
    assignment_meta: Dict[Tuple[str, str, int, int, int], Tuple[str, str, Any, int]] = {}

    # occupancy booleans
    occupancy_section = {}
    occupancy_faculty = {}
    occupancy_room = {}

    # section->(subject->faculty) map (from normalized / assigned_faculty_id)
    section_faculty_map = {
        (sec.id, subj.id): getattr(subj, "assigned_faculty_id", None)
        for sec in normalized_sections
        for subj in sec.subjects
    }
    all_faculty_ids = {fac for fac in section_faculty_map.values() if fac is not None}

    # -------------------------
    # Create occupancy variables
    # -------------------------
    logger.info("Creating occupancy variables for sections/faculty/rooms...")
    for sec in normalized_sections:
        sid = sec.id
        for w in range(weeks):
            for d in days:
                for p in periods:
                    occupancy_section[(sid, w, d, p)] = builder.NewBoolVar(f"occ_sec_{sid}_w{w}_d{d}_p{p}")

    for fac in all_faculty_ids:
        for w in range(weeks):
            for d in days:
                for p in periods:
                    occupancy_faculty[(fac, w, d, p)] = builder.NewBoolVar(f"occ_fac_{fac}_w{w}_d{d}_p{p}")

    for room in set(section_classroom_map.values()):
        for w in range(weeks):
            for d in days:
                for p in periods:
                    occupancy_room[(room, w, d, p)] = builder.NewBoolVar(f"occ_room_{room}_w{w}_d{d}_p{p}")

    logger.info("Occupancy vars created: sections=%d faculty=%d rooms=%d",
                len(occupancy_section), len(occupancy_faculty), len(occupancy_room))

    # -------------------------
    # Assignment start variables (start-of-block)
    # -------------------------
    logger.info("Creating assignment start variables (start-of-block).")
    created_vars = 0
    labs = 0
    theory = 0

    for sec in normalized_sections:
        sid = sec.id
        logger.debug("Section %s subjects: %s", sid, [s.id for s in sec.subjects])
        for subj in sec.subjects:
            subj_id = subj.id
            fac = getattr(subj, "assigned_faculty_id", None)
            if not fac:
                logger.warning("Section %s subject %s has no assigned_faculty_id; skipping", sid, subj_id)
                continue

            # determine is_lab: prefer normalized subject flag, fallback to master
            is_lab = bool(getattr(subj, "is_lab", False))
            if not is_lab:
                sm = subjects_lookup.get(subj_id)
                if sm is not None:
                    is_lab = bool(getattr(sm, "is_lab", False))

            length = 2 if is_lab else 1
            tag = "lab" if is_lab else "theory"

            # only create starts where a full block fits
            for w in range(weeks):
                for d in days:
                    for p in range(0, periods_per_day - (length - 1)):
                        key = (sid, subj_id, w, d, p)
                        v = builder.NewBoolVar(f"assign_{tag}_{sid}_{subj_id}_w{w}_d{d}_p{p}")
                        assign_vars[key] = v
                        covers = [(sid, w, d, pp) for pp in range(p, p + length)]
                        assign_var_covers[key] = covers
                        sec_subj_vars[(sid, subj_id)].append((w, d, p))
                        assignment_meta[key] = (sid, subj_id, fac, length)
                        created_vars += 1
                        if length == 2:
                            labs += 1
                        else:
                            theory += 1

    logger.info("Created %d start-vars (lab starts=%d theory starts=%d)", created_vars, labs, theory)
    logger.debug("Vars counted by builder: %d", builder.var_count)

    # -------------------------
    # Diagnostics before adding constraints (spot obvious infeasibilities)
    # -------------------------
    def run_feasibility_diagnostics():
        logger.info("Running feasibility diagnostics before constraints...")

        # 1) Subject capacity: required periods vs candidate capacity (sum of lengths)
        subject_issues = []
        for (sid, subj_id), starts in sec_subj_vars.items():
            required = int(subject_periods_map.get(subj_id, 0))
            cap = 0
            for (w, d, p) in starts:
                key = (sid, subj_id, w, d, p)
                length = assignment_meta.get(key, (None, None, None, 1))[3]
                cap += length
            if required > cap:
                subject_issues.append((sid, subj_id, required, cap, len(starts)))
        if subject_issues:
            logger.error("Subject capacity problems detected: %d entries", len(subject_issues))
            for sid, subj_id, req, cap, cand in subject_issues[:20]:
                logger.error("  Sec=%s Subj=%s required=%d capacity=%d candidates=%d", sid, subj_id, req, cap, cand)
        else:
            logger.info("No subject capacity issues detected.")

        # 2) Lab capacity: sessions required vs candidate start positions
        lab_issues = []
        for (sid, subj_id), starts in sec_subj_vars.items():
            if not starts:
                continue
            sample = starts[0]
            length = assignment_meta.get((sid, subj_id, sample[0], sample[1], sample[2]), (None, None, None, 1))[3]
            if length != 2:
                continue
            sem_total = int(subject_periods_map.get(subj_id, 0))
            sessions_req = math.ceil(sem_total / 2.0) if sem_total > 0 else 0
            candidates = len(starts)
            if sessions_req > candidates:
                lab_issues.append((sid, subj_id, sem_total, sessions_req, candidates))
        if lab_issues:
            logger.error("Lab session capacity problems detected: %d entries", len(lab_issues))
            for sid, subj_id, sem_tot, sess_req, cand in lab_issues[:20]:
                logger.error("  Lab Sec=%s Subj=%s semester_periods=%d sessions_req=%d candidates=%d",
                             sid, subj_id, sem_tot, sess_req, cand)
        else:
            logger.info("No lab session capacity issues detected.")

        # 3) Faculty total demand vs available capacity (simple sum)
        req_per_fac = defaultdict(int)
        for (sid, subj_id), starts in sec_subj_vars.items():
            if not starts:
                continue
            key0 = (sid, subj_id, starts[0][0], starts[0][1], starts[0][2])
            fac = assignment_meta.get(key0, (None, None, None, 1))[2]
            req_per_fac[fac] += int(subject_periods_map.get(subj_id, 0))
        cap_per_fac = defaultdict(int)
        for k, meta_k in assignment_meta.items():
            _, _, fac, length = meta_k
            cap_per_fac[fac] += length
        faculty_issues = []
        for fac in req_per_fac:
            req = req_per_fac.get(fac, 0)
            cap = cap_per_fac.get(fac, 0)
            if req > cap:
                faculty_issues.append((fac, req, cap))
        if faculty_issues:
            logger.error("Faculty overload issues detected: %d entries", len(faculty_issues))
            for fac, req, cap in faculty_issues[:20]:
                logger.error("  Faculty=%s required_periods=%d available_capacity=%d", fac, req, cap)
        else:
            logger.info("No faculty overload issues detected.")

        return {"subject_issues": subject_issues, "lab_issues": lab_issues, "faculty_issues": faculty_issues}

    diag = run_feasibility_diagnostics()
    if any([diag["subject_issues"], diag["lab_issues"], diag["faculty_issues"]]):
        logger.error("Diagnostics found potential feasibility problems. Check logs above.")
    else:
        logger.info("Diagnostics: no immediate infeasibility detected from quick checks.")

    # -------------------------
    # ELECTIVE: Build aggregated masters and skip per-virtual totals
    # -------------------------
    # Build mapping (semester, group) -> subj_id -> [virtual_sids]
    elective_index: Dict[Tuple, Dict[str, List[str]]] = {}
    for sec in normalized_sections:
        if getattr(sec, "is_virtual", False) and getattr(sec, "elective_group", None):
            key = (sec.semester, sec.elective_group)
            subj_map = elective_index.setdefault(key, {})
            for subj in sec.subjects:
                subj_map.setdefault(subj.id, []).append(sec.id)

    # create masters: (semester,group,subj) -> { (w,d,p) -> master_var }
    elective_masters: Dict[Tuple, Dict[Tuple[int, int, int], cp_model.IntVar]] = {}

    for (semester, group), subj_map in elective_index.items():
        logger.info("Elective group: semester=%s group=%s options=%d", semester, group, len(subj_map))
        for subj_id, virtual_sids in subj_map.items():
            masters_for_subj: Dict[Tuple[int, int, int], cp_model.IntVar] = {}
            for w in range(weeks):
                for d in days:
                    for p in periods:
                        mvar = builder.NewBoolVar(f"elective_master_{semester}_{group}_{subj_id}_w{w}_d{d}_p{p}")
                        masters_for_subj[(w, d, p)] = mvar

                        # Link each virtual copy's assign_var to this master (if the candidate exists)
                        for sid in virtual_sids:
                            k = (sid, subj_id, w, d, p)
                            if k in assign_vars:
                                # assign_vars[k] == mvar
                                # Use builder.model.Add to avoid chaining issues
                                builder.model.Add(assign_vars[k] == mvar)
                                builder.constraint_count += 1

                        # When master is active, block non-virtual sections in same semester at this slot
                        for sec_other in normalized_sections:
                            if sec_other.semester == semester and not getattr(sec_other, "is_virtual", False):
                                for subj_other in sec_other.subjects:
                                    key_other = (sec_other.id, subj_other.id, w, d, p)
                                    if key_other in assign_vars:
                                        builder.model.Add(assign_vars[key_other] + mvar <= 1)
                                        builder.constraint_count += 1

            elective_masters[(semester, group, subj_id)] = masters_for_subj

    # Optional: at most one elective option running at the same slot for a group
    for (semester, group), subj_map in elective_index.items():
        for w in range(weeks):
            for d in days:
                for p in periods:
                    masters_here = []
                    for subj_id in subj_map.keys():
                        m = elective_masters.get((semester, group, subj_id), {}).get((w, d, p))
                        if m is not None:
                            masters_here.append(m)
                    if masters_here:
                        builder.model.Add(sum(masters_here) <= 1)
                        builder.constraint_count += 1

    # -------------------------
    # Hard Constraints
    # -------------------------

    # 1) Section occupancy (no double booking for a section in a slot)
    logger.info("Adding section occupancy constraints...")
    for sec in normalized_sections:
        sid = sec.id
        for w in range(weeks):
            for d in days:
                for p in periods:
                    # find all start-keys that cover (sid,w,d,p)
                    vars_here = [assign_vars[k] for k, covers in assign_var_covers.items() if (sid, w, d, p) in covers]
                    if vars_here:
                        builder.add(sum(vars_here) <= 1)
                        # link occupancy booleans
                        builder.add(sum(vars_here) >= occupancy_section[(sid, w, d, p)])
                        builder.add(sum(vars_here) <= len(vars_here) * occupancy_section[(sid, w, d, p)])
                    else:
                        builder.add(occupancy_section[(sid, w, d, p)] == 0)

    # 2) Faculty no double booking
    logger.info("Adding faculty no-double-booking constraints...")
    for (fac, w, d, p), occ in occupancy_faculty.items():
        vars_here = [
            assign_vars[k]
            for k, covers in assign_var_covers.items()
            if assignment_meta[k][2] == fac and (assignment_meta[k][0], w, d, p) in covers
        ]
        if vars_here:
            builder.add(sum(vars_here) <= 1)
            builder.add(sum(vars_here) >= occ)
            builder.add(sum(vars_here) <= len(vars_here) * occ)
        else:
            builder.add(occ == 0)

    # 3) Room no double booking (rooms assigned to sections)
    logger.info("Adding room occupancy constraints...")
    for (room, w, d, p), occ in occupancy_room.items():
        vars_here = [
            assign_vars[k]
            for k, covers in assign_var_covers.items()
            if section_classroom_map.get(k[0]) == room and (k[0], w, d, p) in covers
        ]
        if vars_here:
            builder.add(sum(vars_here) <= 1)
            builder.add(sum(vars_here) >= occ)
            builder.add(sum(vars_here) <= len(vars_here) * occ)
        else:
            builder.add(occ == 0)

    # 4) Subject totals:
    #    - For non-virtual (regular) sections: enforce per-section totals as before
    #    - For virtual elective options: enforce aggregated totals using elective_masters
    logger.info("Adding subject-total constraints (regular + elective-aggregated)...")
    # regular (non-virtual) sections
    for (sid, subj_id), starts in sec_subj_vars.items():
        # skip if this sid is virtual (we will handle via elective masters)
        sec_meta = next((s for s in normalized_sections if s.id == sid), None)
        is_virtual_sid = bool(getattr(sec_meta, "is_virtual", False)) if sec_meta else False
        if is_virtual_sid:
            continue
        total_required = int(subject_periods_map.get(subj_id, 0))
        if total_required <= 0:
            continue
        terms = []
        for (w, d, p) in starts:
            key = (sid, subj_id, w, d, p)
            length = assignment_meta[key][3]
            terms.append(length * assign_vars[key])
        logger.debug("Subject total for %s/%s required=%d candidates=%d", sid, subj_id, total_required, len(starts))
        builder.add(sum(terms) == total_required)

    # aggregated elective totals (one per elective subject option)
    logger.info("Adding aggregated elective subject totals...")
    for (semester, group, subj_id), masters_map in list(elective_masters.items()):
        required = int(subject_periods_map.get(subj_id, 0))
        if required <= 0:
            continue
        # determine length for this subj_id (pick any matching assign_vars to get length)
        sample_length = None
        for k in assignment_meta.keys():
            if k[1] == subj_id:
                sample_length = assignment_meta[k][3]
                break
        if sample_length is None:
            sample_length = 1
        terms = []
        for key_slot, master_var in masters_map.items():
            # each selected master contributes sample_length periods
            terms.append(sample_length * master_var)
        logger.debug("Elective aggregated total subj=%s required=%d candidate_slots=%d", subj_id, required, len(terms))
        builder.model.Add(sum(terms) == required)
        builder.constraint_count += 1

    # 5) Global lab room capacity: at any covered slot number of lab starts covering that slot <= lab_room_capacity
    logger.info("Adding global lab-room capacity constraints (<= %d)", lab_room_capacity)
    for w in range(weeks):
        for d in days:
            for p in periods:
                lab_start_vars = [
                    assign_vars[k] for k, covers in assign_var_covers.items()
                    if assignment_meta[k][3] == 2 and (k[0], w, d, p) in covers
                ]
                if lab_start_vars:
                    builder.add(sum(lab_start_vars) <= lab_room_capacity)

    # -------------------------
    # Soft constraints (penalties)
    # -------------------------
    logger.info("Adding soft constraints as penalties (theory spread, consecutive-theory...)")
    penalties = []

    # Soft A: Theory spread - prefer at most 1 start per subject per day (theory only)
    for (sid, subj_id), starts in sec_subj_vars.items():
        if not starts:
            continue
        sample = starts[0]
        length = assignment_meta[(sid, subj_id, sample[0], sample[1], sample[2])][3]
        if length == 2:  # skip labs
            continue
        for w in range(weeks):
            for d in days:
                day_vars = [assign_vars[(sid, subj_id, ww, dd, pp)] for (ww, dd, pp) in starts if ww == w and dd == d]
                if not day_vars:
                    continue
                # violation indicator
                viol = builder.NewBoolVar(f"viol_theoryspread_{sid}_{subj_id}_w{w}_d{d}")
                # if no violation -> sum(day_vars) <= 1
                builder.model.Add(sum(day_vars) <= 1).OnlyEnforceIf(viol.Not())
                # if violation -> sum(day_vars) >= 2 (this branch is enabled when violation var = 1)
                builder.model.Add(sum(day_vars) >= 2).OnlyEnforceIf(viol)
                builder.constraint_count += 2
                penalties.append(viol)

    # Soft B: No >2 consecutive theory classes per faculty in a day
    for fac in all_faculty_ids:
        for w in range(weeks):
            for d in days:
                for p in range(0, periods_per_day - 2):
                    theory_vars = []
                    # gather theory start vars for faculty covering periods p,p+1,p+2 (exclude labs length==2)
                    for k, covers in assign_var_covers.items():
                        _, _, wk, dd, sp = k
                        if wk != w or dd != d:
                            continue
                        _, _, fac_k, length = assignment_meta[k]
                        if fac_k != fac or length != 1:
                            continue
                        # theory covers single slot (start period)
                        # include it if its start period in {p, p+1, p+2}
                        if covers and any(pp in [p, p+1, p+2] for (_, _, _, pp) in covers):
                            theory_vars.append(assign_vars[k])
                    if not theory_vars:
                        continue
                    viol = builder.NewBoolVar(f"viol_consec_theory_{fac}_w{w}_d{d}_p{p}")
                    builder.model.Add(sum(theory_vars) <= 2).OnlyEnforceIf(viol.Not())
                    builder.model.Add(sum(theory_vars) >= 3).OnlyEnforceIf(viol)
                    builder.constraint_count += 2
                    penalties.append(viol)

    # Soft C: Faculty daily workload 0-4 if scheduled (OPTIONAL / commented)
    # If you want to enable this, uncomment the block below. For now we leave it commented per your request.
    #Existig constraints already take care of faculy overload issues hence this is completely optional mostly it will be handled
    #Theory spread: at most 1 per subject per day.

    #No >2 consecutive theory per faculty: this spreads subjects around.

    #Lab capacity: limits how many lab blocks can run.
    # for fac in all_faculty_ids:
    #     for w in range(weeks):
    #         for d in days:
    #             day_slots = [occupancy_faculty[(fac, w, d, p)] for p in periods]
    #             if not day_slots:
    #                 continue

    #             total = sum(day_slots)

    #             # Hard cap: no more than 4 periods/day
    #             builder.model.Add(total <= 4)
    #             builder.constraint_count += 1

    #             # Indicator: faculty teaches this day?
    #             indicator = builder.NewBoolVar(f"fac_hasclass_{fac}_w{w}_d{d}")
    #             builder.model.Add(total >= 1).OnlyEnforceIf(indicator)
    #             builder.model.Add(total == 0).OnlyEnforceIf(indicator.Not())
    #             builder.constraint_count += 2

    #             # Soft lower bound: if teaching that day, prefer at least 2 periods
    #             viol = builder.NewBoolVar(f"viol_facwork_{fac}_w{w}_d{d}")
    #             builder.model.Add(total >= 2).OnlyEnforceIf(indicator)
    #             builder.model.Add(total <= 1).OnlyEnforceIf(viol)  # violation = only 1 period
    #             builder.constraint_count += 2

    #             penalties.append(viol)



    # -------------------------
    # Objective: minimize total penalties (soft constraint violations)
    # -------------------------
    if penalties:
        logger.info("Adding objective to minimize %d soft-violations", len(penalties))
        # objective must be an IntVar expression; sum(booleans) is OK
        builder.model.Minimize(sum(penalties))
    else:
        logger.info("No soft penalties defined; model will be pure feasibility/hard-constraints")

    logger.info("Model build complete: vars=%d constraints=%d soft_penalties=%d",
                builder.var_count, builder.constraint_count, len(penalties))

    # -------------------------
    # Meta to return (for runner/outputs)
    # -------------------------
    meta = {
        "builder": builder,
        "assign_vars": assign_vars,
        "assign_var_covers": assign_var_covers,
        "assignment_meta": assignment_meta,
        "sec_subj_vars": sec_subj_vars,
        "occupancy_section": occupancy_section,
        "occupancy_faculty": occupancy_faculty,
        "occupancy_room": occupancy_room,
        "subject_periods_map": subject_periods_map,
        "section_faculty_map": section_faculty_map,
        "section_classroom_map": section_classroom_map,
        "weeks": weeks,
        "days": days,
        "periods_per_day": periods_per_day,
        "lab_room_capacity": lab_room_capacity,
        "elective_index": elective_index,
        "elective_masters": elective_masters,
    }

    return builder.model, meta


# If file executed directly, provide a tiny smoke test placeholder (won't run solver)
if __name__ == "__main__":
    logger.info("solver.py module executed directly; build_cp_model is the entrypoint for the pipeline.")
