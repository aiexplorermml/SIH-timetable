"""
timetable_generator.py - orchestrates the pipeline:
  loader -> precompute -> solver -> runner -> outputs
(Kept robust to different semesterdates representations.)
"""

import logging
from datetime import datetime, timedelta
from typing import Dict, Any, List

# import your modules (adjust imports if your package layout differs)
from src.timetable import loader, precompute, solver, runner, outputs

logger = logging.getLogger("src.timetable.generator")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
logger.addHandler(handler)


def expand_semester_dates(semesters: List[Any]) -> List[str]:
    """Expand each semester dict/model {startDate,endDate} into list of ISO dates."""
    all_dates: List[str] = []
    for sem in semesters:
        try:
            # support Pydantic model or dict
            if hasattr(sem, "startDate"):
                start_val = sem.startDate
                end_val = sem.endDate
            elif isinstance(sem, dict):
                start_val = sem.get("startDate")
                end_val = sem.get("endDate")
            else:
                logger.warning("Unknown semester entry type: %s", type(sem))
                continue

            if isinstance(start_val, str):
                start = datetime.fromisoformat(start_val).date()
            else:
                start = start_val  # assumed date
            if isinstance(end_val, str):
                end = datetime.fromisoformat(end_val).date()
            else:
                end = end_val
        except Exception as e:
            logger.error("Invalid semester entry %s: %s", sem, e)
            continue

        cur = start
        while cur <= end:
            all_dates.append(cur.isoformat())
            cur = cur + timedelta(days=1)
    return all_dates


def generate(input_dir: str, output_dir: str, time_limit: int = 60, num_workers: int = 8):
    logger.info("Starting timetable generation pipeline...")
    inputs: Dict[str, Any] = loader.load_all_inputs(input_dir)
    normalized = precompute.prepare(inputs, outputs_dir=output_dir)

    # build cp model
    model, meta = solver.build_cp_model(normalized, inputs)

    # run solver (runner should return dict with keys 'status' and 'assigned')
    result = runner.run_solver(model, meta, output_dir=output_dir, time_limit=time_limit, num_workers=num_workers)

    if result.get("status") not in ("OPTIMAL", "FEASIBLE"):
        logger.error("Solver did not find a feasible solution: status=%s", result.get("status"))
        return

    # build working_dates by expanding semesters
    sem_dates = inputs.get("semesterdates", [])
    working_dates = expand_semester_dates(sem_dates)
    logger.info("Working dates expanded: %d days", len(working_dates))

    # pass meta and assignments to outputs
    outputs.expand_and_write_outputs(
        solver_assignments=result.get("assigned", []),
        assignment_meta=meta["assignment_meta"],
        section_faculty_map=meta.get("section_faculty_map", {}),
        section_classroom_map=meta.get("section_classroom_map", {}),
        working_dates=working_dates,
        days_per_week=len(meta.get("days", [])),
        out_prefix=f"{output_dir}/timetable",
    )

    logger.info("Timetable generation complete. Files written to %s", output_dir)


if __name__ == "__main__":
    # simple run for local dev; change paths as needed
    generate("input", "output")
