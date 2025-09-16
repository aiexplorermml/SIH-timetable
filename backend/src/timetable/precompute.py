"""
Pre-computation module for timetable planning.

Responsibilities:
1. Map each section -> classroom based on capacity.
2. Generate virtual sections for electives grouped per semester/department.
3. Produce a normalized "planning view":
   - section details
   - subjects (core & elective)
   - total_students
   - year/semester mapping
4. Build faculty -> subject eligibility mapping (case-insensitive).
5. Validation checks:
   - Compare subject hours vs. available semester working days.
   - Verify faculty workloads (when faculty max load info exists).
6. Compute periods required per subject (hours -> periods).
"""

import logging
import math
import os
import json
from collections import defaultdict
from copy import deepcopy
from datetime import timedelta
from typing import Dict, List, Any
from tabulate import tabulate
from dateutil.parser import parse as parse_date
from src.timetable.models import (
    SemesterDate,
    Holiday,
    SemesterSubjectsEntry,
    Faculty,
    FacultyWorkloadMetrics,
    Section,
    Classroom,
    ElectiveEnrollment,
    NormalizedSection,
    SubjectMaster,
    ExamDate
)
from src.timetable.utils import write_json_to_file



# -------------------------
# Logging setup
# -------------------------
logger = logging.getLogger("src.timetable.precompute")
logger.setLevel(logging.DEBUG)
if not logger.handlers:
    h = logging.StreamHandler()
    h.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
    logger.addHandler(h)


# ---------- Helpers ----------

def count_working_days(start: str, end: str, holidays: List[str]) -> int:
    try:
        s = parse_date(start).date()
        e = parse_date(end).date()
    except Exception as ex:
        logger.error("Invalid semester dates provided: %s / %s => %s", start, end, ex)
        return 0

    holidays_set = set()
    for h in holidays or []:
        try:
            holidays_set.add(parse_date(h).date())
        except Exception:
            logger.warning("Couldn't parse holiday date: %s", h)

    days = 0
    cur = s
    while cur <= e:
        if cur.weekday() < 5 and cur not in holidays_set:  # Mon-Fri
            days += 1
        cur += timedelta(days=1)
    return days


# ---------- Main precompute functions ----------

def map_sections_to_classrooms(
    sections: List[Section],
    virtual_sections: List[Dict[str, Any]],
    classrooms: List[Classroom]
) -> Dict[str, str]:
    """
    Map each section (real + virtual) to a classroom.

    - Real sections: first-fit by capacity (unique classrooms, no double assignment).
    - Virtual sections: assigned from the classrooms already used in the same semester (round-robin).
                       If insufficient, assign from remaining classrooms.
    """
    mapping: Dict[str, str] = {}
    assigned_classrooms: set = set()

    # Filter and sort classrooms by capacity (only classroom & conference types)
    eligible_classrooms = [c for c in classrooms if str(c.type).lower() in ("classroom", "conference")]
    class_list = sorted(eligible_classrooms, key=lambda c: c.capacity)

    # --- Phase 1: Assign classrooms to real sections ---
    for sec in sections:
        assigned = None
        for c in class_list:
            if c.capacity >= sec.totalStudents and c.id not in assigned_classrooms:
                assigned = c.id
                assigned_classrooms.add(c.id)
                break

        mapping[sec.id] = assigned
        logger.info("Real section '%s' (strength=%d, sem=%s) -> Classroom '%s'",
                    sec.id, sec.totalStudents, sec.semester, assigned)

    # --- Phase 2: Assign classrooms to virtual elective sections ---
    # Build semester → classrooms used mapping
    semester_to_classrooms = defaultdict(list)
    for sec in sections:
        cid = mapping.get(sec.id)
        if cid:
            semester_to_classrooms[sec.semester].append(cid)

    # Available fallback classrooms (not yet assigned to any real section)
    remaining_classrooms = [c.id for c in class_list if c.id not in assigned_classrooms]

    # Group virtual sections by (semester, elective_group)
    group_map = defaultdict(list)
    for vs in virtual_sections:
        key = (vs["semester"], vs.get("elective_group"))
        group_map[key].append(vs)

    # For each group, assign classrooms
    for (sem, eg), vlist in group_map.items():
        assigned = []

        # Copy classrooms used by real sections in this semester
        available = list(semester_to_classrooms.get(sem, []))

        for vs in vlist:
            cid = None
            if available:
                cid = available.pop(0)   # use a real section classroom
            elif remaining_classrooms:
                cid = remaining_classrooms.pop(0)  # fallback unused classroom

            mapping[vs["id"]] = cid
            vs["mapped_classroom"] = cid
            assigned.append(cid)

            logger.info(
                "Virtual section '%s' (sem=%s, eg=%s, students=%d) -> Classroom '%s'",
                vs["id"], sem, eg, vs.get("totalStudents"), cid
            )

        logger.info(
            "Elective group mapping complete for sem=%s, eg=%s → %s classrooms assigned",
            sem, eg, assigned
        )


    return mapping



def generate_virtual_elective_sections(sections: List[Section],
                                       enrollments: List[ElectiveEnrollment]) -> List[Dict[str, Any]]:
    """
    Generate virtual sections for electives.
    Groups electives by (semester, elective_group, subject_id).
    """
    group_map = defaultdict(list)
    # Collect valid semester values from sections
    valid_semesters = {sec.semester for sec in sections}
    for e in enrollments:
        semester = e.semester
        elective_group = e.electiveGroup if hasattr(e, "electiveGroup") else e.elective_group

        # Only include if semester is valid
        if semester not in valid_semesters:
            logger.warning("Ignoring enrollment for semester '%s' (not in section list)", semester)
            continue

        for subj in getattr(e, "subjects", []):
            subject_id = subj.subject_id
            key = (semester, elective_group, subject_id)
            group_map[key].append(subj)

    virtual_sections = []
    for (semester, elective_group, subject_id), subjects in group_map.items():
        total_students = sum(subj.studentsEnrolled for subj in subjects)
        year = str(semester).split("-")[0]
        # Get subject details from the first occurrence (all should be same for the group)
        subj_details = {
            "id": subjects[0].subject_id,
            "name": subjects[0].name,
            "totalHours": subjects[0].hours,
            "is_lab": subjects[0].is_lab
        }
        vs = {
            "id": f"VIRTUAL-{semester}-{elective_group}-{subject_id}",
            "name": f"VIRTUAL-{semester}-{elective_group}-{subject_id}",
            "year": year,
            "semester": semester,
            "section": f"{elective_group}-{subject_id}",
            "totalStudents": total_students,
            "elective_group": elective_group,
            "subjects": [subj_details],
            "is_virtual": True
        }
        virtual_sections.append(vs)

    logger.info("Generated %d virtual elective sections.", len(virtual_sections))
    logger.info("Sample virtual section: %s", virtual_sections[0] if virtual_sections else "N/A")
    return virtual_sections



def build_fac_sems_subj_map(faculty: List[Faculty],
                              subjects: List[SubjectMaster]) -> Dict[str, List[str]]:
    """Build faculty -> eligible subject list using case-insensitive matching."""
    subj_by_id = {s.id.lower(): s.id for s in subjects}

    fac_map = {}
    for f in faculty:
        eligible = set()
        for subj_ref in f.subjects:
            ref = subj_ref.lower()
            sid = subj_by_id.get(ref)
            eligible.add(sid)
        fac_map[f.id] = sorted([e for e in eligible if e is not None])
        logger.info("Faculty '%s' eligible for %d subjects.", f.id, len(fac_map[f.id]))
        logger.info("Faculty '%s' subjects: %s", f.name, fac_map[f.id])
    return fac_map


def compute_persec_subject_period_req(sem_subjects: List[SubjectMaster],
                             period_length_hours: float = 1.0) -> Dict[str, int]:
    """Compute periods required per subject."""
    subj_periods = {}
    for s in sem_subjects:
        periods = math.ceil(s.totalHours / float(period_length_hours)) if s.totalHours > 0 else 0
        subj_periods[s.id] = periods
        logger.info("Subject %s -> hours=%s -> periods=%d",
                    s.id, s.totalHours, periods)
    return subj_periods

def compute_semester_available_periods(semester: SemesterDate,
                                       holidays: List[Holiday],
                                       examDates: List[ExamDate],
                                       periods_per_day: int = 8) -> Dict[str, Any]:
    """
    Compute available working days and periods for a given semester.
    Excludes Sundays, holidays, and exam dates (full-day blocks).
    """
    exam_days = set()
    for ed in examDates or []:
        cur = ed.startDate
        while cur <= ed.endDate:
            exam_days.add(cur)
            cur += timedelta(days=1)

    holiday_days = {h.holiday_date for h in holidays or []}

    # Compute valid working days
    cur = semester.startDate
    working_days = []
    while cur <= semester.endDate:
        if cur.weekday() < 6 and cur.weekday() != 6 and cur not in holiday_days and cur not in exam_days:
            # Weekday 6 = Sunday
            working_days.append(cur)
        cur += timedelta(days=1)

    total_days = len(working_days)
    working_weeks = total_days/6
    total_periods = total_days * periods_per_day

    logger.info("Semester %s-%s: %d working days, %d available periods",
                semester.id, semester.name, total_days, total_periods)

    return {
        "total_days": total_days,
        "total_weeks": working_weeks,
        "total_periods": total_periods,
        "periods_per_day": periods_per_day
    }



# ---------- Validation ----------

def validate_section_periods_vs_subjects(normalizedSections: List[NormalizedSection],
                                     working_weeks_days_period_map: Dict[str, Any]
                                      ) -> Dict[str, Any]:
    """
    Validate whether subjects in each section can fit into available periods.
    
    - Net available periods = (working days excluding holidays, Sundays, exam ranges) * 8
    - For real sections: sum up required periods from their subjects and compare with available.
    - For virtual sections: 
        Estimate available slots as (real available periods * number of sections in that semester),
        then ensure elective subjects can fit.
    """
    result = {"ok": True, "details": []}

   

    total_days = working_weeks_days_period_map.get("total_days", 0)
    logger.info("Total working days  %d (excluding holidays, Sundays, exams)",
               total_days)
    
    available_periods = working_weeks_days_period_map.get("total_periods", 0)
    periods_per_day = working_weeks_days_period_map.get("periods_per_day", 8)
    logger.info("Assuming %d periods/day, total available periods: %d", periods_per_day, available_periods)

    logger.info(" %d working days, %d available periods/section",
                 total_days, available_periods)

    # Separate real vs virtual sections
    real_sections = [s for s in normalizedSections if not getattr(s, "is_virtual", False)]
    virtual_sections = [s for s in normalizedSections if getattr(s, "is_virtual", False)]

    # --- Real sections check ---
    semester_free_periods: Dict[str, int] = defaultdict(int)
    for sec in real_sections:
        required = sum(math.ceil(sub.totalHours) for sub in sec.subjects)
        free_periods = available_periods - required
        if required > available_periods:
            msg = f"Section {sec.id} insufficient periods: required={required}, available={available_periods}, freePeriods={free_periods}"
            logger.error(msg)
            result["ok"] = False
            result["details"].append(msg)
        else:
            msg = f"Section {sec.id} OK: required={required}, available={available_periods}, freePeriods={free_periods} which are reserved for electives are"
            logger.info(msg)
            result["details"].append(msg)
        semester_free_periods[sec.semester] += free_periods

    # --- Virtual elective groups check ---
    # Group by (semester, elective_group)
    groups = defaultdict(list)
    for vs in virtual_sections:
        groups[(vs.semester, vs.elective_group)].append(vs)

    for (sem, eg), vlist in groups.items():
        # All elective subjects in this group run in parallel, so required hours = max(subject hours)
        max_required = 0
        subjects_in_group = []
        for vs in vlist:
            for subj in vs.subjects:
                hours = subj.totalHours if isinstance(subj, SubjectMaster) else subj.get("hours", 0)
                max_required = max(max_required, hours)
                subjects_in_group.append(subj.get("id") if isinstance(subj, dict) else subj.id)

        # Available periods = free periods accumulated from real sections of this semester
        sem_free_periods_avl = semester_free_periods.get(sem, 0)
        logger.info(
            "Elective group %s (sem=%s): max_required=%d, sem_free_periods_avl (i.e free periods from all sections of given semester)=%d",
            eg, sem, max_required, sem_free_periods_avl)

        if max_required > sem_free_periods_avl:
            msg = (f"Virtual elective group {eg} (sem={sem}) insufficient: "
                f"required={max_required}, available={sem_free_periods_avl}, "
                f"subjects={subjects_in_group}")
            logger.error(msg)
            result["ok"] = False
            result["details"].append(msg)
        else:
            msg = (f"Virtual elective group {eg} (sem={sem}) OK: "
                f"required={max_required}, available={sem_free_periods_avl}, "
                f"subjects={subjects_in_group}")
            logger.info(msg)
            result["details"].append(msg)
            
            semester_free_periods[sem] = sem_free_periods_avl - max_required
            logger.info(
                "Updated free periods for semester %s after allocating elective group & core subjects is %s: %d",
                sem, eg, semester_free_periods[sem]
            )


    return result

def calculate_faculty_workloads(
    faculty: List["Faculty"],
    sec_sub_periods_map: Dict[str, int],
    fac_subj_map: Dict[str, List[str]],
    working_weeks_days_period_map: Dict[str, Any],
    normalized_sections: List["NormalizedSection"]
) -> List["FacultyWorkloadMetrics"]:
    """
    Compute workload metrics for each faculty assuming they are assigned
    to all subjects they can teach in all sections that have those subjects.
    """

    total_periods = working_weeks_days_period_map.get("total_periods", 0)
    results: List[FacultyWorkloadMetrics] = []

    # Precompute: for each subject, how many sections include it
    subj_section_count = defaultdict(int)
    for sec in normalized_sections:
        for subj in sec.subjects:
            subj_section_count[subj.id] += 1
    
    # Build table rows
    rows = []
    for subj_id, count in subj_section_count.items():
        rows.append([subj_id, count])

    # Define headers
    headers = ["SubjectID", "NumSections"]

    # Log as table
    logger.info("\n" + tabulate(rows, headers=headers, tablefmt="grid"))
    

    for f in faculty:
        subj_ids = fac_subj_map.get(f.id, [])
        max_possible_periods = 0
        actual_allocated_periods = 0
        #logger.info("Calculating workload for faculty %s (%s) eligible for %d subjects.", f.id, f.name, len(subj_ids))
        for sid in subj_ids:
            per_section_req = sec_sub_periods_map.get(sid, 0)
            #logger.info("  Subject %s requires %d periods/section. if 0 implies no subject in semester", sid, per_section_req)
            num_sections = subj_section_count.get(sid, 0)
            total_req = per_section_req * num_sections
            #logger.info("    Subject %s runs in %d sections, total required periods = %d", sid, num_sections, total_req)

            # In "max possible" world, faculty could take all of these
            max_possible_periods += total_req
            #logger.info("    Accumulated max_possible_periods = %d", max_possible_periods)
            actual_allocated_periods=0

        # free_periods = max(0, total_periods - actual_allocated_periods)
        # max_util = (100 * max_possible_periods / total_periods) if total_periods > 0 else 0.0
        # actual_util = (100 * actual_allocated_periods / total_periods) if total_periods > 0 else 0.0

        metrics = FacultyWorkloadMetrics(
            facultyDetails=f,
            periods_available=total_periods,
            max_possible_periods=max_possible_periods,            
            actual_allocated_periods=actual_allocated_periods
        )
        results.append(metrics)

    display_faculty_workloads(results,"Before assignments")
    return results

def display_faculty_workloads(workloads: List[FacultyWorkloadMetrics], message) -> None:
    """Display faculty workload metrics in a tabular format."""
    logger.info("*****************************%s*****************************",message)
    table = []
    for m in workloads:
        f = m.facultyDetails
        table.append([
            f.id,
            f.name,
            f.department,
            m.periods_available,
            m.max_possible_periods,
            m.actual_allocated_periods,
            m.free_periods,
            f"{m.actual_utilization:.2f}%",
            f"{m.max_possible_utilization:.2f}%"
        ])

    headers = [
        "ID", "Name", "Dept", "Available",
        "MaxPossible", "ActualAllocated",
        "Free", "ActualUtil%", "MaxPossibleUtil%"
    ]
    logger.info("\n" + tabulate(table, headers=headers, tablefmt="grid"))

# def validate_faculty_workloads(
#     faculty: List[Faculty],
#     subj_periods: Dict[str, int],
#     fac_subj_map: Dict[str, List[str]],
#     working_weeks_days_period_map: Dict[str, Any],
#     normalized_sections: List[NormalizedSection]
# ) -> Dict[str, Dict[str, Any]]:
#     """Validate workload for each faculty separately and return mapping."""

#     total_periods = working_weeks_days_period_map.get("total_periods", 0)
#     validation_results: Dict[str, Dict[str, Any]] = {}

#     for f in faculty:
#         all_subj_req_periods = sum(
#             subj_periods.get(sid, 0) for sid in fac_subj_map.get(f.id, [])
#         )
#         max_occupancy = (all_subj_req_periods / total_periods * 100) if total_periods > 0 else 0.0

#         # Build result dict for this faculty
#         fac_result = {
#             "ok": True,
#             "details": [],
#             "total_periods": total_periods,
#             "all_subj_req_periods": all_subj_req_periods,
#             "max_occupancy": max_occupancy,
#         }

#         if all_subj_req_periods > total_periods:
#             msg = (
#                 f"Faculty {f.id} ({f.name}) overload: "
#                 f"all_subj_req_periods={all_subj_req_periods}, available={total_periods}, "
#                 f"max_occupancy={max_occupancy:.2f}%"
#             )
#             logger.error(msg)
#             fac_result["ok"] = False
#             fac_result["details"].append(msg)

#         else:
#             if max_occupancy > 80.0:
#                 msg = (
#                     f"Faculty {f.id} ({f.name}) high max_occupancy: "
#                     f"all_subj_req_periods={all_subj_req_periods}, available={total_periods}, "
#                     f"max_occupancy={max_occupancy:.2f}%"
#                 )
#                 fac_result["ok"] = False
#                 logger.warning(msg)
#             else:
#                 msg = (
#                     f"Faculty {f.id} ({f.name}) OK: "
#                     f"all_subj_req_periods={all_subj_req_periods}, available={total_periods}, "
#                     f"max_occupancy={max_occupancy:.2f}%"
#                 )
#                 logger.info(msg)

#             fac_result["details"].append(msg)

#         validation_results[f.id] = fac_result

#     return validation_results


from typing import List, Dict
from collections import defaultdict
from tabulate import tabulate
import logging

logger = logging.getLogger(__name__)

def invert_fac_sub_map(fac_sems_sub_map: Dict[str, List[str]]) -> Dict[str, List[str]]:
    """
    Convert faculty->subjects mapping into subject->faculty mapping.
    """
    sems_sub_fac_map: Dict[str, List[str]] = defaultdict(list)
    for fac_id, subjects in fac_sems_sub_map.items():
        for subj_id in subjects:
            sems_sub_fac_map[subj_id].append(fac_id)
    return dict(sems_sub_fac_map)

def assign_faculty_to_section_subjects(
    normalized_sections,
    fac_sems_sub_map: Dict[str, List[str]],
    sec_sub_periods_map: Dict[str, int],
    faculty_workload_before_assignment: List["FacultyWorkloadMetrics"],
) -> List["FacultyWorkloadMetrics"]:
    """
    Assign faculty to section subjects based on 'tank filling' strategy:
      - Prefer faculty with lower max_possible_utilization (smaller tanks).
      - Skip faculty once actual_utilization >= 50%.
    """
    logger.info("Starting faculty assignment to section subjects...")
    sems_sub_fac_map = invert_fac_sub_map(fac_sems_sub_map)
    # Build quick lookup for workload metrics
    fac_metrics_map: Dict[str, FacultyWorkloadMetrics] = {
        m.facultyDetails.id: m for m in faculty_workload_before_assignment
    }
    

    # Allocation process
    for sec in normalized_sections:
        for subj in sec.subjects:
            subj_id = subj.id
            periods = sec_sub_periods_map.get(subj_id, 0)
            eligible_faculty = sems_sub_fac_map.get(subj_id, [])
            logger.info("Eligible faculty for subj=%s in section=%s: %s",
                        subj_id, sec.id, eligible_faculty)
            if not eligible_faculty:
                logger.warning("No eligible faculty for subj=%s in section=%s", subj_id, sec.id)
                continue

            # Sort eligible faculty by lowest max_possible_utilization
            sorted_faculty = sorted(
                eligible_faculty,
                key=lambda fid: fac_metrics_map[fid].max_possible_utilization,
            )
            logger.info("Sorted eligible faculty by max_possible_utilization: %s", sorted_faculty)

            chosen = None
            for fid in sorted_faculty:
                fm = fac_metrics_map[fid]
                if fm.actual_utilization < 50.0:  # skip if already ≥50%
                    logger.info("Choosing faculty %s for subj=%s in section=%s (actual_util=%.2f%%, max_util=%.2f%%)",
                                fid, subj_id, sec.id, fm.actual_utilization, fm.max_possible_utilization)
                    chosen = fid
                    break

            # If all faculty ≥50%, fallback to the lowest max_possible_utilization
            if not chosen:
                chosen = sorted_faculty[0]

            # Assign faculty
            subj.assigned_faculty_id = chosen

            # Update workload metrics for chosen faculty
            fm = fac_metrics_map[chosen]
            fm.actual_allocated_periods += periods
            # fm.free_periods = max(0, fm.periods_available - fm.actual_allocated_periods)
            # fm.actual_utilization = (
            #     100 * fm.actual_allocated_periods / fm.periods_available
            #     if fm.periods_available > 0 else 0.0
            # )

            logger.info(
                "Assigned subj=%s (periods=%d) sec=%s -> faculty=%s "
                "(actual_util=%.2f%%, max_util=%.2f%%)",
                subj_id, periods, sec.id, chosen,
                fm.actual_utilization, fm.max_possible_utilization
            )

    # --- Tabular summary after assignment ---
    display_faculty_workloads(list(fac_metrics_map.values()),"After assignments")

    return list(fac_metrics_map.values())




# ---------- Orchestration ----------

def prepare(inputs: Dict[str, Any],
            outputs_dir: str = "output",
            period_length_hours: float = 0.75) -> Dict[str, Any]:
    logger.info("Starting pre-computation...")

    sections: List[Section] = inputs.get("sections", [])
    classrooms: List[Classroom] = inputs.get("classrooms", [])
    master_subjects: Dict[str, SubjectMaster]= inputs.get("subjects_master", [])
    semester_subjects: Dict[str, SemesterSubjectsEntry] = inputs.get("semester_subjects", {})
    faculty: List[Faculty] = inputs.get("faculty", [])
    enrollments: List[ElectiveEnrollment] = inputs.get("elective_enrollments", [])
    sem_dates: List[SemesterDate] = inputs.get("semesterdates", [])
    holidays: List[Holiday] = inputs.get("holidays", [])
    
    virtual_elective_section_subjects = generate_virtual_elective_sections(sections, enrollments)
    
    
    # Write virtual elective sections to output file
    write_json_to_file(virtual_elective_section_subjects, "1-virtual-section-subjects.json", outputs_dir)
    #sections = sections + [Section(**vs) for vs in virtual_elective_sections]   
    section_classroom_map = map_sections_to_classrooms(sections, virtual_elective_section_subjects, classrooms)

    

    normalized_sections: List[NormalizedSection] = []

    for sec in sections:
        sem_entry = semester_subjects.get(sec.semester)
        subj_list: List[SubjectMaster] = []
        if sem_entry:
            subj_list = sem_entry.subjects  # already a list[SemesterSubject] or SubjectMaster
            logger.info("Section %s core subjects: %s", sec.id, [s.id for s in subj_list])

        norm = NormalizedSection(
            id=sec.id,
            name=sec.name,
            year=sec.year,
            section=sec.section,
            semester=sec.semester,
            totalStudents=sec.totalStudents,
            classTeacher=sec.classTeacher,
            subjects=subj_list,
            mapped_classroom=section_classroom_map.get(sec.id)
        )
        normalized_sections.append(norm)

    logger.info("Total sections (excl. virtual electives): %d", len(normalized_sections))

    # If your virtual sections are dicts, you may need to cast/convert them to NormalizedSection too.
    for vs in virtual_elective_section_subjects:
        try:
            normalized_sections.append(NormalizedSection(**vs))
        except Exception as e:
            logger.warning("Could not convert virtual section %s to NormalizedSection: %s", vs.get("id"), e)

    logger.info("Total normalized sections (incl. virtual electives): %d", len(normalized_sections))

    


    

    all_semester_subjs = []
    for entry in semester_subjects.values():
        all_semester_subjs.extend(entry.subjects)
        # Add all elective subjects
        for eg in entry.electives.values():
            all_semester_subjs.extend(eg.subjects)
    
    fac_sems_sub_map = build_fac_sems_subj_map(faculty, all_semester_subjs)
    sec_sub_periods_map = compute_persec_subject_period_req(all_semester_subjs, period_length_hours)
    
    logger.info("Semester dates entries: %d", len(sem_dates))
    logger.info("Semester dates sample: %s", sem_dates[0] if sem_dates else "N/A")
    validation = {}
    if sem_dates:
        semester = sections[0].semester
        logger.info("Using semester '%s' for available periods computation", semester)
        # Find semester date entry
        semesterDates:SemesterDate = next((sd for sd in sem_dates if sd.id == semester), None)
        logger.info("Semester dates for '%s' from sections is : %s", semester, semesterDates)
        if not semesterDates:
            logger.error("Semester date entry not found for semester '%s'", semester)
            raise ValueError(f"Semester date entry not found for semester '{semester}'")
        else:
        # Compute available periods
        # Note: assuming all sections are in the same semester for simplicity   
            working_weeks_days_period_map = compute_semester_available_periods(semesterDates, holidays, inputs.get("examdates", []))
            validation["subjects_vs_working_days"] = validate_section_periods_vs_subjects(normalized_sections, working_weeks_days_period_map)
            faculty_work_load_before_assignment:List[FacultyWorkloadMetrics] = calculate_faculty_workloads(faculty, sec_sub_periods_map, fac_sems_sub_map, working_weeks_days_period_map, normalized_sections)
            #validation["faculty_workloads"] = validate_faculty_workloads(faculty, sec_sub_periods_map, fac_sems_sub_map,working_weeks_days_period_map,normalized_sections)

    # Faculty–section–subject assignment
    faculty_loads = assign_faculty_to_section_subjects(
        normalized_sections,
        fac_sems_sub_map,
        sec_sub_periods_map,
        faculty_work_load_before_assignment
    )
    # Serialize for file writing (convert models to dict)
    write_json_to_file([ns.dict() for ns in normalized_sections],
                    "2-normalized_sections_subjects.json",
                    outputs_dir)


    

    logger.info("Pre-computation complete. Sections normalized: %d", len(normalized_sections))
    logger.info("Sample normalized section: %s", normalized_sections[0] if normalized_sections else "N/A")
    logger.info("Virtual elective sections generated: %d", len(virtual_elective_section_subjects))

    return {
        "normalized_sections": normalized_sections,
        "fac_sems_sub_map": fac_sems_sub_map,
        "virtual_elective_sections_count": len(virtual_elective_section_subjects),
        "validation": validation,
        "sec_sub_periods_map": sec_sub_periods_map,
        "section_classroom_map": section_classroom_map,
        "working_days": working_weeks_days_period_map.get("total_days", 0),
        "working_periods": working_weeks_days_period_map.get("total_periods", 0),
        "working_weeks": working_weeks_days_period_map.get("total_weeks", 0),
        "periods_per_day": working_weeks_days_period_map.get("periods_per_day", 8)
    }
