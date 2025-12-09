---
sidebar_position: 1
title: Week 8 - NVIDIA Isaac Sim & SDK
---

# Week 8 - NVIDIA Isaac Sim & SDK

## 1. Introduction to Isaac Sim
NVIDIA Isaac Sim is built on the **Omniverse** platform. It uses **USD (Universal Scene Description)** as its native file format, allowing for non-destructive collaboration on 3D scenes. It is designed for:
* **Photorealism:** Ray-tracing for accurate camera simulation.
* **Physics:** PhysX 5.0 for accurate contact and friction.
* **AI Training:** Generating synthetic data for training models.

## 2. Loading a Robot (Python API)
Isaac Sim allows you to script scenes using Python. This is essential for procedural generation (domain randomization).

```python
from omni.isaac.core import World
from omni.isaac.core.robots import Robot
import numpy as np

def load_simulation():
    # 1. Initialize the World
    my_world = World(stage_units_in_meters=1.0)
    
    # 2. Add a Ground Plane
    my_world.scene.add_default_ground_plane()

    # 3. Add a Robot (Franka Emika Panda)
    # USD paths are used to locate assets
    franka = my_world.scene.add(
        Robot(
            prim_path="/World/Franka",
            name="franka_robot",
            usd_path="omniverse://localhost/NVIDIA/Assets/Isaac/2023.1.1/Isaac/Robots/Franka/franka_instance.usd",
            position=np.array([0, 0, 0])
        )
    )

    # 4. Reset and Run
    my_world.reset()
    while True:
        my_world.step(render=True)

if __name__ == "__main__":
    load_simulation()
```