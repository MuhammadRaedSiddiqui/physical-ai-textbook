---
sidebar_position: 2
title: Week 9 - Reinforcement Learning with Isaac Gym
---

# Week 9 - Reinforcement Learning with Isaac Gym

## 1. Massively Parallel Simulation
Isaac Gym is a physics simulation environment for reinforcement learning research. Its key feature is the ability to run thousands of simulations in parallel on a single GPU. This massively accelerates the training process, allowing you to train a robot policy in hours instead of days.

## 2. Reward Functions
In Reinforcement Learning (RL), a **reward function** is a signal that tells the AI agent how well it is doing. The agent's goal is to maximize the cumulative reward.

For example, to teach a robot to walk, you might provide:
* **Positive reward** for moving forward.
* **Negative reward** for falling over.
* **Negative reward** for using too much energy.

Designing a good reward function is a critical part of successful RL.
