# diagnose_solver_blocks.py
# Run from project root: python diagnose_solver_blocks.py
import logging
import math
from collections import defaultdict
from typing import Dict, Any, List, Tuple
from ortools.sat.python import cp_model
import pickle, sys

# Adjust imports if your project layout differs
from src.timetable import precompute, loader  # if needed to load normalized data

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("diagnose")

# ---- Load your normalized/input data the same way your pipeline does ----
# Adapt the loader paths as you use them — below assumes the same loader API
try:
    inputs = loader.load_all_inputs("input")   # change directory as needed
    normalized = precompute.prepare(inputs, outputs_dir="output")
except Exception as e:
    logger.error("Failed to load normalized/input with loader/precompute: %s", e)
    # If you already have normalized dict, load from a file or import it directly
    raise

# copy key params from your solver
weeks = int(normalized.get("working_weeks", 19))
days_per_week = 6
periods_per_day = 8
days = list(range(days_per_week))
periods = list(range(periods_per_day))

# Build candidate start variables exactly as solver.py does,
# but store them in a single structure we can reuse.
assign_vars = {}
assign_var_covers = {}
assignment_meta = {}
sec_subj_starts = defaultdict(list)

subjects_master = inputs.get("subjects_master",[]) or []
subjects_lookup = {s.id: s for s in subjects_master}

for sec in normalized.get("normalized_sections", []):
    sid = sec.id
    for subj in sec.subjects:
        subj_id = subj.id
        fac = getattr(subj, "assigned_faculty_id", None)
        if not fac:
            # skip for diagnosis if missing faculty (same as solver)
            continue
        is_lab = bool(getattr(subj, "is_lab", False))
        if not is_lab:
            sm = subjects_lookup.get(subj_id)
            if sm:
                is_lab = bool(getattr(sm, "is_lab", False))
        length = 2 if is_lab else 1
        for w in range(weeks):
            for d in days:
                for p in range(0, periods_per_day - (length - 1)):
                    key = (sid, subj_id, w, d, p)
                    # keep placeholders (no BoolVar yet) — we'll create model-specific bools later
                    assign_var_covers[key] = [(sid, w, d, pp) for pp in range(p, p + length)]
                    assignment_meta[key] = (sid, subj_id, fac, length)
                    sec_subj_starts[(sid, subj_id)].append((w, d, p))

logger.info("Prepared candidate starts: %d keys", len(assign_var_covers))

# Define constraint blocks in the order you use in solver.py
# Each block is a function that accepts model/context & returns list of cp constraints or adds them directly.

def make_model_with_basic_vars():
    """Make a fresh model and create BoolVars for each candidate start key and occupancy booleans."""
    builder = cp_model.CpModel()
    vars_map = {}
    occ_section = {}
    occ_fac = {}
    occ_room = {}

    # create assign BoolVars
    for key in assign_var_covers.keys():
        vars_map[key] = builder.NewBoolVar(f"v_{key[0]}_{key[1]}_w{key[2]}_d{key[3]}_p{key[4]}")

    # occupancy booleans to mimic solver
    section_ids = [s.id for s in normalized.get("normalized_sections", [])]
    section_classroom_map = normalized.get("section_classroom_map", {})
    faculty_ids = set(v[2] for v in assignment_meta.values() if v[2] is not None)
    room_ids = set(section_classroom_map.values())

    for sid in section_ids:
        for w in range(weeks):
            for d in days:
                for p in periods:
                    occ_section[(sid, w, d, p)] = builder.NewBoolVar(f"occ_sec_{sid}_w{w}_d{d}_p{p}")
    for fac in faculty_ids:
        for w in range(weeks):
            for d in days:
                for p in periods:
                    occ_fac[(fac, w, d, p)] = builder.NewBoolVar(f"occ_fac_{fac}_w{w}_d{d}_p{p}")
    for room in room_ids:
        for w in range(weeks):
            for d in days:
                for p in periods:
                    occ_room[(room, w, d, p)] = builder.NewBoolVar(f"occ_room_{room}_w{w}_d{d}_p{p}")

    return builder, vars_map, occ_section, occ_fac, occ_room

# Constraint block implementations (add to model directly)
def add_section_occupancy(builder, vars_map, occ_section):
    for sid in [s.id for s in normalized.get("normalized_sections", [])]:
        for w in range(weeks):
            for d in days:
                for p in periods:
                    vars_here = [vars_map[k] for k, covers in assign_var_covers.items() if (sid, w, d, p) in covers]
                    if vars_here:
                        builder.Add(sum(vars_here) <= 1)
                        # link occupancy
                        builder.Add(sum(vars_here) >= occ_section[(sid,w,d,p)])
                        builder.Add(sum(vars_here) <= len(vars_here) * occ_section[(sid,w,d,p)])
                    else:
                        builder.Add(occ_section[(sid,w,d,p)] == 0)

def add_faculty_no_double(builder, vars_map, occ_fac):
    for (fac, w, d, p) in occ_fac.keys():
        vars_here = [
            vars_map[k]
            for k, meta in assignment_meta.items()
            if meta[2] == fac and (meta[0], w, d, p) in assign_var_covers[k]
        ]
        if vars_here:
            builder.Add(sum(vars_here) <= 1)
            builder.Add(sum(vars_here) >= occ_fac[(fac,w,d,p)])
            builder.Add(sum(vars_here) <= len(vars_here) * occ_fac[(fac,w,d,p)])
        else:
            builder.Add(occ_fac[(fac,w,d,p)] == 0)

def add_room_no_double(builder, vars_map, occ_room):
    section_classroom_map = normalized.get("section_classroom_map", {})
    for (room, w, d, p) in occ_room.keys():
        vars_here = [vars_map[k] for k, meta in assignment_meta.items()
                     if section_classroom_map.get(meta[0]) == room and (meta[0], w, d, p) in assign_var_covers[k]]
        if vars_here:
            builder.Add(sum(vars_here) <= 1)
            builder.Add(sum(vars_here) >= occ_room[(room,w,d,p)])
            builder.Add(sum(vars_here) <= len(vars_here) * occ_room[(room,w,d,p)])
        else:
            builder.Add(occ_room[(room,w,d,p)] == 0)

def add_subject_totals(builder, vars_map):
    subj_periods = normalized.get("subject_periods", {})
    for (sid, subj_id), starts in sec_subj_starts.items():
        required = int(subj_periods.get(subj_id, 0))
        if required <= 0:
            continue
        terms = []
        for (w,d,p) in starts:
            key = (sid, subj_id, w, d, p)
            length = assignment_meta[key][3]
            terms.append(length * vars_map[key])
        builder.Add(sum(terms) == required)

def add_lab_rules(builder, vars_map):
    # simplified: ensure lab sessions equality per earlier logic
    for (sid, subj_id), starts in sec_subj_starts.items():
        if not starts:
            continue
        key0 = (sid, subj_id, starts[0][0], starts[0][1], starts[0][2])
        if assignment_meta[key0][3] != 2:
            continue
        sem_total = int(normalized.get("subject_periods", {}).get(subj_id, 0))
        sessions = math.ceil(sem_total / 2.0)
        all_vars = [vars_map[(sid, subj_id, w,d,p)] for (w,d,p) in starts]
        builder.Add(sum(all_vars) == sessions)

def add_elective_sync(builder, vars_map):
    # use your solver logic: group virtual sections by (semester,elective_group)
    elective_map = defaultdict(list)
    for sec in normalized.get("normalized_sections", []):
        if getattr(sec, "is_virtual", False) and getattr(sec, "elective_group", None):
            elective_map[(sec.semester, sec.elective_group)].append(sec)
    for (sem, group), secs in elective_map.items():
        for w in range(weeks):
            for d in days:
                for p in periods:
                    group_vars = []
                    for sec in secs:
                        sid = sec.id
                        for subj in sec.subjects:
                            key = (sid, subj.id, w, d, p)
                            if key in vars_map:
                                group_vars.append(vars_map[key])
                    if len(group_vars) > 1:
                        for v in group_vars[1:]:
                            builder.Add(group_vars[0] == v)
                    if group_vars:
                        # block other non-virtual sections in same semester
                        for sec in normalized.get("normalized_sections", []):
                            if sec.semester == sem and not getattr(sec, "is_virtual", False):
                                sid = sec.id
                                for subj in sec.subjects:
                                    other = (sid, subj.id, w, d, p)
                                    if other in vars_map:
                                        builder.Add(group_vars[0] + vars_map[other] <= 1)

def add_faculty_daily_min(builder, vars_map, occ_fac):
    # enforce if scheduled then >=2 else 0 (this was suspect)
    for fac in list({v[2] for v in assignment_meta.values()}):
        for w in range(weeks):
            for d in days:
                day_slots = [occ_fac[(fac,w,d,p)] for p in periods]
                if not day_slots:
                    continue
                total = sum(day_slots)
                builder.Add(total <= 4)
                indicator = builder.NewBoolVar(f"ind_{fac}_w{w}_d{d}")
                builder.Add(total >= 1).OnlyEnforceIf(indicator)
                builder.Add(total == 0).OnlyEnforceIf(indicator.Not())
                builder.Add(total >= 2).OnlyEnforceIf(indicator)
                # note: indicator not linked explicitly to occ_fac; occ_fac linked elsewhere via faculty no double

# list of blocks in test order
blocks = [
    ("section_occupancy", add_section_occupancy),
    ("faculty_no_double", add_faculty_no_double),
    ("room_no_double", add_room_no_double),
    ("subject_totals", add_subject_totals),
    ("lab_rules", add_lab_rules),
    ("faculty_daily_min", add_faculty_daily_min),
    ("elective_sync", add_elective_sync),
]

# incremental test
from ortools.sat.python import cp_model
for i, (name, func) in enumerate(blocks):
    logger.info("Testing block sequence up to: %s", name)
    model, vars_map, occ_sec, occ_fac, occ_room = make_model_with_basic_vars()
    # add blocks up to current
    for j in range(i+1):
        bname, bfunc = blocks[j]
        logger.info("  adding block: %s", bname)
        try:
            bfunc(model, vars_map, occ_sec if "section" in bname else (occ_fac if "faculty" in bname else (occ_room if "room" in bname else None)))
        except TypeError:
            # some functions expect only (model,vars_map)
            bfunc(model, vars_map)
    # quick solve with small time limit to let presolve run
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 3
    result = solver.Solve(model)
    status = solver.StatusName(result)
    logger.info(" After adding %d blocks, solver status: %s", i+1, status)
    if status == "INFEASIBLE":
        logger.error(" First infeasible block detected: %s (index %d). Stop testing further.", name, i)
        break

logger.info("Diagnosis run complete.")
