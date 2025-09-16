# Auto Timetable Generator

## Overview

A CP-SAT (Google OR-Tools) based automatic timetable generator.  
The pipeline covers:

1. **Input Loading** → Semester dates, subjects, faculty, sections, classrooms, electives.
2. **Pre-Computation** → Normalize inputs, map sections to classrooms, generate virtual elective sections, validate workloads.
3. **Solver** → Define constraints and decision variables using OR-Tools CP-SAT.
4. **Expansion & Outputs** → Expand weekly solution into calendar dates, validate electives, and write JSON timetables.

## Project Structure

python timetable_generator.py generate --input-dir input --output-dir output --time-limit 120 --num-workers 16
