---
sidebar_position: 1
title: Week 1 - Foundations of Physical AI
---

# Foundations of Physical AI & Setup

## 1. What is Physical AI?
Physical AI refers to the application of Artificial Intelligence techniques—specifically machine learning and computer vision—to physical systems like robots. Unlike "Disembodied AI" (like ChatGPT), Physical AI must deal with gravity, friction, and sensor noise.

## 2. The Tech Stack
* **Middleware:** ROS 2 (Robot Operating System) - Humble Hawksbill.
* **Simulation:** Gazebo / NVIDIA Isaac Sim.
* **Brain:** VLA (Vision-Language-Action) Models.

## 3. Environment Setup (Lab 1)
### Prerequisites
* Ubuntu 22.04 LTS
* Python 3.10+

### Installation Steps
```bash
# Install ROS 2 Humble
sudo apt update && sudo apt install locales
sudo locale-gen en_US en_US.UTF-8
sudo update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
export LANG=en_US.UTF-8

sudo apt install software-properties-common
sudo add-apt-repository universe
sudo apt update && sudo apt install curl -y