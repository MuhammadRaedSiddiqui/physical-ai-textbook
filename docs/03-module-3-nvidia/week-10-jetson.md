---
sidebar_position: 3
title: Week 10 - Edge Computing with Jetson
---

# Week 10 - Edge Computing with Jetson

## 1. Deploying to the Edge
The NVIDIA Jetson series are small, powerful computers designed to run AI applications at the "edge" (i.e., on the robot itself, not in the cloud). The Jetson Orin Nano is a popular choice for robotics due to its balance of performance and power efficiency.

## 2. Inference vs. Training
* **Training:** The process of teaching a model, which is very computationally expensive and is done on powerful desktop or server GPUs.
* **Inference:** The process of using a trained model to make predictions. This is much less expensive and is what happens on the Jetson.

## 3. Lab: Optimizing for ARM
The Jetson uses an ARM CPU architecture, which is different from the x86 architecture in most desktop PCs. This means you may need to recompile or find ARM-compatible versions of your ROS 2 nodes. This lab will guide you through the process of optimizing your code for the Jetson platform.
