---
sidebar_position: 1
title: Week 13 - Capstone The Autonomous Humanoid
---

# Week 13 - Capstone: The Autonomous Humanoid

## 1. Scenario
You are tasked with building the software for a humanoid robot in a kitchen environment.
**Mission:** The robot starts at a "Home" position. The user gives a voice command (e.g., "Bring me the red apple"). The robot must find the apple, pick it up, and return to "Home".

## 2. Architecture Diagram
This project integrates all modules:
1.  **Whisper STT:** Transcribes voice to text.
2.  **Planner (LLM):** Converts text to a behavior tree or state machine.
3.  **Nav2:** Handles path planning and obstacle avoidance.
4.  **OpenVLA / Graspnet:** Handles the final reaching and grasping motion.

## 3. Recommended Project Structure
Your ROS 2 workspace should look like this:

```text
src/
└── capstone_humanoid/
    ├── launch/
    │   ├── bringup.launch.py       # Starts robot, Nav2, and MoveIt
    │   └── mission.launch.py       # Starts the AI brain node
    ├── config/
    │   ├── nav2_params.yaml        # Navigation tuning
    │   └── behavior_tree.xml       # Logic flow
    ├── capstone_humanoid/
    │   ├── ai_brain.py             # Main node (LLM + State Machine)
    │   └── vision_processor.py     # Object detection node
    └── package.xml
```