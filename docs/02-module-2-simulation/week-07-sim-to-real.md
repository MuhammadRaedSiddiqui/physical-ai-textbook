---
sidebar_position: 3
title: Week 7 - Sim-to-Real Transfer
---

# Week 7 - Sim-to-Real Transfer

## 1. The "Reality Gap"
The "Reality Gap" is the difference between the simulated world and the real world. A model trained only in a perfect simulation may fail in the real world due to factors like:
* Un-modeled friction.
* Sensor noise (e.g., reflections on a LiDAR).
* Latency in communication.

## 2. Domain Randomization
To bridge the reality gap, we use **Domain Randomization**. This involves randomly changing non-essential aspects of the simulation during training. For example:
* Varying the color and texture of objects.
* Changing the friction coefficients.
* Adding random noise to sensor data.

This forces the AI to learn a more robust policy that can generalize to the real world.

## 3. Lab: Simulating Sensors
In this lab, you will learn to simulate two critical sensors:
* **LiDAR:** Create a virtual LiDAR sensor in your simulator. Visualize the point cloud data in RViz2.
* **Depth Camera:** Add a depth camera to your robot model. This camera provides distance information for each pixel, which is invaluable for obstacle avoidance and manipulation.
