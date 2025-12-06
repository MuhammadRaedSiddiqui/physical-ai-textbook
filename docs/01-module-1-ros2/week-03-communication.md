---
sidebar_position: 3
title: Week 3 - Advanced Communication
---

# Week 3 - Advanced Communication

## 1. ROS 2 Actions
Actions are for long-running tasks. They provide a client/server interface where the client can send a goal, and the server provides feedback and a final result. This is useful for tasks like navigation, which can take a long time.

## 2. ROS 2 Parameters
Parameters are configurable values for a node. They allow you to change a node's behavior without recompiling the code. For example, you could have a parameter for the speed of a robot.

## 3. Launch Files (`.launch.py`)
Launch files are Python scripts that allow you to start and configure multiple nodes at once. This is essential for running a complex robot system.

Here is an example of a launch file that starts our publisher and subscriber nodes from Week 2:

```python
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(
            package='my_package',
            executable='minimal_publisher',
            name='publisher'
        ),
        Node(
            package='my_package',
            executable='minimal_subscriber',
            name='subscriber'
        ),
    ])
```

To run this launch file, you would use the command:
`ros2 launch my_package my_launch_file.launch.py`
