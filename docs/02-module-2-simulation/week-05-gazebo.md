---
sidebar_position: 1
title: Week 5 - Physics Simulation with Gazebo
---

# Week 5 - Physics Simulation with Gazebo

## 1. Gazebo Classic vs. Ignition
* **Gazebo Classic (e.g., version 11):** The long-standing, stable, and widely-used version. Most ROS 1 and early ROS 2 packages are built for it.
* **Ignition (now called Gazebo Sim):** The next generation. It features a more modular architecture, better rendering, and improved sensor models. We will use Gazebo Sim for this course.

## 2. Rigid Body Dynamics
Gazebo simulates physics. Key concepts:
* **Gravity:** A force pulling objects down.
* **Friction:** A force that opposes motion between surfaces.
* **Inertia:** A property of matter by which it continues in its existing state of rest or uniform motion in a straight line, unless that state is changed by an external force.

## 3. URDF Example: 2-Wheeled Robot
The Unified Robot Description Format (URDF) is an XML format for representing a robot model.

```xml
<?xml version="1.0"?>
<robot name="two_wheeled_robot">
  <link name="base_link">
    <visual>
      <geometry>
        <box size="0.5 0.3 0.1"/>
      </geometry>
    </visual>
  </link>

  <link name="left_wheel">
    <visual>
      <geometry>
        <cylinder radius="0.1" length="0.05"/>
      </geometry>
    </visual>
  </link>

  <joint name="base_to_left_wheel" type="continuous">
    <parent link="base_link"/>
    <child link="left_wheel"/>
    <axis xyz="0 1 0"/>
  </joint>

  <link name="right_wheel">
    <visual>
      <geometry>
        <cylinder radius="0.1" length="0.05"/>
      </geometry>
    </visual>
  </link>

  <joint name="base_to_right_wheel" type="continuous">
    <parent link="base_link"/>
    <child link="right_wheel"/>
    <axis xyz="0 1 0"/>
  </joint>
</robot>
```
This file describes the physical structure of a simple robot with a chassis and two wheels.
