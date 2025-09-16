import json
import logging
from pathlib import Path
from typing import Dict, Any, List, Type, TypeVar
from pydantic import ValidationError

from src.timetable import models

logger = logging.getLogger(__name__)
T = TypeVar("T")


def _load_json_file(path: Path) -> Any:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _parse_list(data: Any, model: Type[T]) -> List[T]:
    if not isinstance(data, list):
        raise ValueError(f"Expected list for {model.__name__}, got {type(data)}")
    return [model.parse_obj(item) for item in data]


def _parse_dict(data: Any, model: Type[T]) -> Dict[str, T]:
    if not isinstance(data, dict):
        raise ValueError(f"Expected dict for {model.__name__}, got {type(data)}")
    return {k: model.parse_obj(v) for k, v in data.items()}

def parse_semester_subjects(d):
    return _parse_dict(d, models.SemesterSubjectsEntry)

def load_all_inputs(input_dir: str) -> Dict[str, Any]:
    """
    Load all required input JSON files into validated Pydantic models.
    Logs INFO on success, ERROR on failure.
    """
    input_dir = Path(input_dir)
    results: Dict[str, Any] = {}

    file_map = {
        "semesterdates": ("semesterdates.json", lambda d: _parse_list(d, models.SemesterDate)),
        "examdates": ("semester-exam-dates.json", lambda d: _parse_list(d, models.ExamDate)),
        "holidays": ("semester-holidays.json", lambda d: _parse_list(d, models.Holiday)),
        "subjects_master": ("aiml_subjects_master.json", lambda d: _parse_list(d, models.SubjectMaster)),
        "semester_subjects": ("aiml-semester_subjects.json", parse_semester_subjects),
        "faculty": ("aiml-faculty-detailed.json", lambda d: _parse_list(d, models.Faculty)),
        "sections": ("department-sections-semester2.json", lambda d: _parse_list(d, models.Section)),
        "classrooms": ("classrooms.json", lambda d: _parse_list(d, models.Classroom)),
        "elective_enrollments": ("elective-subjects-enrollment.json", lambda d: _parse_list(d, models.ElectiveEnrollment)),
    }

    for key, (filename, parser) in file_map.items():
        path = input_dir / filename
        logger.info(f"Loading {filename}...")
        try:
            raw = _load_json_file(path)
            parsed = parser(raw)
            results[key] = parsed
            # loader.py
            if key == "semester_subjects":
                total_subjects = sum(len(entry.subjects) for entry in parsed.values())
                logger.info(f"Total semester subjects loaded: {total_subjects}")
            else:
                logger.info(f"Loaded {filename} → {len(parsed)} records")
        except FileNotFoundError:
            logger.error(f"Missing file: {filename}")
        except ValidationError as ve:
            logger.error(f"Validation error in {filename}: {ve}")
        except Exception as e:
            logger.error(f"Failed to load {filename}: {e}")

    return results
