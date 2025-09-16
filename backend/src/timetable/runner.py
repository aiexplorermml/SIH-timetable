"""
runner.py - Solver Runner
Runs CP-SAT solver with logging, diagnostics, and soft constraint violation tracking.
"""

import json
import logging
from pathlib import Path
from ortools.sat.python import cp_model
from . import outputs

logger = logging.getLogger("src.timetable.runner")
logger.setLevel(logging.INFO)


def run_solver(model: cp_model.CpModel,
               meta: dict,
               output_dir: str = "output",
               time_limit: int = 60,
               num_workers: int = 8) -> dict:
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = time_limit
    solver.parameters.num_search_workers = num_workers
    solver.parameters.log_search_progress = True
    solver.parameters.cp_model_presolve = True
    solver.parameters.log_to_stdout = True

    logger.info("Starting CP-SAT solver (limit=%ds, workers=%d)...", time_limit, num_workers)
    status = solver.Solve(model)
    status_name = solver.StatusName(status)
    logger.info("Solver finished with status: %s", status_name)

    result = {"status": status_name, "assigned": [], "objective": None, "violations": 0}

    # Objective value = number of soft violations (since we Minimize(sum(penalties)))
    try:
        result["objective"] = solver.ObjectiveValue()
        logger.info("Objective value (soft violations minimized) = %s", result["objective"])
    except Exception:
        result["objective"] = None

    if status in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        # Collect assigned timetable keys
        assigned_keys = [k for k, v in meta.get("assign_vars", {}).items() if solver.Value(v)]
        result["assigned"] = assigned_keys
        logger.info("Number of assigned timetable start-keys: %d", len(assigned_keys))

        # Count violated soft constraints (objective value should equal this)
        violations = int(result["objective"]) if result["objective"] is not None else 0
        result["violations"] = violations
        logger.info("Number of violated soft constraints: %d", violations)

        # Debug: log first few assignments
        assignment_meta = meta.get("assignment_meta", {})
        for k in assigned_keys[:10]:
            logger.info("Assigned key=%s meta=%s", k, assignment_meta.get(k))

        # Save a quick summary JSON
        summary = {
            "status": status_name,
            "objective": result["objective"],
            "violations": result["violations"],
            "assigned_count": len(assigned_keys),
        }
        out = Path(output_dir) / "summary.json"
        out.parent.mkdir(parents=True, exist_ok=True)
        with open(out, "w") as f:
            json.dump(summary, f, indent=2)
        logger.info("Summary written to %s", out)

        # Now expand & write detailed outputs
        working_dates = meta.get("working_dates", [])
        days_per_week = meta.get("days", [])
        if isinstance(days_per_week, list):
            days_per_week = len(days_per_week)
        section_faculty_map = meta.get("section_faculty_map", {})
        section_classroom_map = meta.get("section_classroom_map", {})
        outputs.expand_and_write_outputs(
            assigned_keys,
            assignment_meta,
            section_faculty_map,
            section_classroom_map,
            working_dates,
            days_per_week,
            str(Path(output_dir) / "timetable"),
        )

    elif status in (cp_model.INFEASIBLE, cp_model.UNKNOWN):
        diagnostics = {
            "status": status_name,
            "summary": {
                "faculty_constraints": "present" if meta.get("occupancy_faculty") else "not_present",
                "section_constraints": "present" if meta.get("occupancy_section") else "not_present",
                "classroom_constraints": "present" if meta.get("occupancy_room") else "not_present",
                "elective_constraints": "present" if meta.get("elective_masters") else "not_present",
            },
            "note": "Check subject coverage, lab constraints, or relax soft constraints.",
        }
        out = Path(output_dir) / "diagnostics.json"
        out.parent.mkdir(parents=True, exist_ok=True)
        with open(out, "w") as f:
            json.dump(diagnostics, f, indent=2)
        logger.error("Solver infeasible/unknown. Diagnostics written to %s", out)

    return result
