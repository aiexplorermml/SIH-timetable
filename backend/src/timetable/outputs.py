"""
outputs.py - expand solver assignments and write JSON outputs (section, faculty, room)
Expects:
 - solver_assignments: dict (key->1) OR list of keys [(sid,subj,w,d,p), ...]
 - assignment_meta: dict keyed by (sid,subj,w,d,p) -> (sid, subj, fac, length)
 - section_faculty_map: mapping (sid,subj) -> faculty
 - section_classroom_map: mapping sid -> room
 - working_dates: list of ISO date strings (global day index)
"""

import json
import logging
from collections import defaultdict
from typing import Any, Dict, List, Tuple


logger = logging.getLogger("src.timetable.outputs")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
logger.addHandler(handler)


def _collect_assigned_keys(solver_assignments) -> List[Tuple]:
    if isinstance(solver_assignments, dict):
        return [k for k, v in solver_assignments.items() if v]
    if isinstance(solver_assignments, list):
        if len(solver_assignments) == 0:
            return []
        first = solver_assignments[0]
        if isinstance(first, tuple) and len(first) == 2 and isinstance(first[0], tuple):
            return [k for k, v in solver_assignments if v]
        return list(solver_assignments)
    logger.error("Unsupported solver_assignments type: %s", type(solver_assignments))
    return []


def _parse_assigned_keys(
    keys: List[Tuple],
    assignment_meta: Dict,
    section_faculty_map: Dict,
    section_classroom_map: Dict,
    days_per_week: int,
) -> List[Tuple]:
    parsed: List[Tuple] = []
    for key in keys:
        if not isinstance(key, tuple) or len(key) != 5:
            logger.warning("Skipping unexpected assigned key: %r", key)
            continue
        sid, subj_id, week, day, start_p = key
        meta = assignment_meta.get(key)
        if not meta:
            logger.warning("No assignment_meta for key=%s", key)
            continue
        _, subj, fac_from_meta, length = meta
        fac = fac_from_meta or section_faculty_map.get((sid, subj_id))
        room = section_classroom_map.get(sid)
        is_lab = (length == 2)
        day_idx = week * days_per_week + day
        for p in range(start_p, start_p + length):
            parsed.append((sid, subj, fac, room, day_idx, p, is_lab))
    return parsed


def _group_by_section(parsed: List[Tuple], working_dates: List[str]) -> Dict[str, List[Dict[str, Any]]]:
    out = defaultdict(list)
    for sid, subj, fac, room, day_idx, period, is_lab in parsed:
        date_iso = working_dates[day_idx] if 0 <= day_idx < len(working_dates) else None
        out[str(sid)].append({
            "date": date_iso,
            "day_index": day_idx,
            "period": period,
            "subject": subj,
            "faculty": fac,
            "room": room,
            "is_lab": is_lab,
            "free": False,
        })
    return out


def _group_by_faculty(parsed: List[Tuple], working_dates: List[str]) -> Dict[str, List[Dict[str, Any]]]:
    out = defaultdict(list)
    for sid, subj, fac, room, day_idx, period, is_lab in parsed:
        if not fac:
            continue
        date_iso = working_dates[day_idx] if 0 <= day_idx < len(working_dates) else None
        out[str(fac)].append({
            "date": date_iso,
            "day_index": day_idx,
            "period": period,
            "subject": subj,
            "section": sid,
            "room": room,
            "is_lab": is_lab,
            "free": False,
        })
    return out


def _group_by_room(parsed: List[Tuple], working_dates: List[str]) -> Dict[str, List[Dict[str, Any]]]:
    out = defaultdict(list)
    for sid, subj, fac, room, day_idx, period, is_lab in parsed:
        if not room:
            continue
        date_iso = working_dates[day_idx] if 0 <= day_idx < len(working_dates) else None
        out[str(room)].append({
            "date": date_iso,
            "day_index": day_idx,
            "period": period,
            "subject": subj,
            "section": sid,
            "faculty": fac,
            "is_lab": is_lab,
            "free": False,
        })
    return out


def _enrich_virtual_sections(section_json: Dict[str, List[Dict[str, Any]]]) -> Dict[str, List[Dict[str, Any]]]:
    """
    Merge virtual sections into all real sections of the same year.
    Example:
        VIRTUAL-3-2-ELECTIVE II-SUBJ044
        -> extract year "3"
        -> merge into all sections starting with "aiml-3-"
    """
    enriched = {sid: list(entries) for sid, entries in section_json.items() if not sid.startswith("VIRTUAL-")}


    for sid in list(section_json.keys()):
        if not sid.startswith("VIRTUAL-"):
            continue
        try:
            parts = sid.split("-")
            year = parts[1]  # e.g. "3" from VIRTUAL-3-2-...
        except Exception as e:
            logger.warning("Skipping virtual section with unexpected format: %s (%s)", sid, e)
            continue

        virtual_entries = section_json[sid]
        logger.info("Merging virtual section %s into year %s", sid, year)

        for target_sid in section_json.keys():
            if target_sid.startswith("VIRTUAL-"):
                continue
            if target_sid.startswith(f"aiml-{year}"):
                enriched[target_sid].extend(virtual_entries)
                logger.info("Merged %d entries from %s -> %s",
                             len(virtual_entries), sid, target_sid)

    return enriched



def expand_and_write_outputs(
    solver_assignments,
    assignment_meta: Dict,
    section_faculty_map: Dict,
    section_classroom_map: Dict,
    working_dates: List[str],
    days_per_week: int,
    out_prefix: str,
):
    keys = _collect_assigned_keys(solver_assignments)
    logger.info("expand_and_write_outputs: collected %d assigned keys", len(keys))

    parsed = _parse_assigned_keys(keys, assignment_meta, section_faculty_map, section_classroom_map, days_per_week)
    logger.info("expand_and_write_outputs: expanded to %d concrete slots", len(parsed))

    section_json = _group_by_section(parsed, working_dates)
    faculty_json = _group_by_faculty(parsed, working_dates)
    room_json = _group_by_room(parsed, working_dates)

    # write main outputs
    with open(f"{out_prefix}_section.json", "w") as f:
        json.dump(section_json, f, indent=2)
    with open(f"{out_prefix}_faculty.json", "w") as f:
        json.dump(faculty_json, f, indent=2)
    with open(f"{out_prefix}_room.json", "w") as f:
        json.dump(room_json, f, indent=2)

    logger.info("Wrote outputs: %s_section.json, %s_faculty.json, %s_room.json", out_prefix, out_prefix, out_prefix)

    # --- Enriched timetable ---
    enriched_json = _enrich_virtual_sections(section_json)
    with open(f"{out_prefix}_enriched_section.json", "w") as f:
        json.dump(enriched_json, f, indent=2)
    logger.info("Wrote enriched timetable")
