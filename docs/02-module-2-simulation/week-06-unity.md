---
sidebar_position: 2
title: Week 6 - High-Fidelity Rendering with Unity
---

# Week 6 - High-Fidelity Rendering with Unity

## 1. Why Unity?
While Gazebo is excellent for physics, Unity offers superior graphics and sensor simulation. This is crucial for training Vision-Language-Action models, which rely on realistic camera and LiDAR data.

## 2. URDF Importer Workflow
Unity provides a "URDF Importer" package that can read a `.urdf` file and automatically generate a 3D model of your robot inside the Unity editor. This saves a significant amount of time compared to manually recreating the robot.

## 3. ROS-Unity Integration
We connect ROS 2 to Unity using a TCP connection.
* **ROS side:** The `ros2-tcp-connector` package.
* **Unity side:** The `ROS-TCP-Connector` asset from the Unity Asset Store.

**Setup Guide:**
1.  Install the `ros2-tcp-connector` for your ROS 2 distribution.
2.  Import the `ROS-TCP-Connector` asset into your Unity project.
3.  Configure the TCP endpoint in both ROS 2 and Unity to point to the same IP address and port.
4.  You can now publish/subscribe to ROS topics from within your Unity C# scripts.
