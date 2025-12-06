---
sidebar_position: 1
title: Week 11 - Vision-Language-Action (VLA) Models
---

# Week 11 - Vision-Language-Action (VLA) Models

## 1. The Convergence of LLMs and Robotics
Vision-Language-Action (VLA) models are the "brain" of modern robots. They combine the language understanding of Large Language Models (LLMs) with the visual perception of computer vision models. This allows the robot to understand high-level commands and execute them in the physical world.

## 2. How VLAs Work (e.g., RT-2)
Models like Google's Robotic Transformer 2 (RT-2) are trained on a massive dataset of text, images, and robot actions. This allows them to learn a direct mapping from sensory input to motor control.

## 3. VLA Model Flow
The basic flow is as follows:

```
[Robot Camera Image] + "Pick up the red apple" -> [VLA Model] -> [Sequence of motor commands]
```
The model takes in the current state of the world (via the camera) and a natural language instruction, and outputs the low-level actions required to complete the task.
