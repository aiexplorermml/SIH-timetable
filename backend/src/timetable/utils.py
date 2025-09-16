import os
import json
import logging

logger = logging.getLogger(__name__)

def write_json_to_file(data, filename, directory="output"):
    """Write JSON data to a file in the specified directory."""
    os.makedirs(directory, exist_ok=True)
    output_path = os.path.join(directory, filename)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    logger.info("Wrote JSON data to %s", output_path)