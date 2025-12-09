---
sidebar_position: 2
title: Week 6 - High-Fidelity Rendering with Unity
---

# Week 6 - High-Fidelity Rendering with Unity

## 1. Why Unity?
While Gazebo is excellent for physics, Unity offers superior graphics and sensor simulation. This is crucial for training **Vision-Language-Action (VLA)** models, which rely on realistic camera and LiDAR data to generalize to the real world.

## 2. ROS-Unity Integration
We connect ROS 2 to Unity using the **ROS-TCP-Connector**.
* **ROS side:** The `ros2-tcp-connector` package acts as the server.
* **Unity side:** The `ROS-TCP-Connector` asset acts as the client.

### Setup Guide
1.  Install the `ros2-tcp-connector` in your ROS 2 workspace.
2.  Import the **URDF Importer** package into Unity.
3.  Configure the IP address in Unity (usually `127.0.0.1` for local testing).

## 3. C# Scripting for Control
In Unity, we use C# to control the robot. Here is a script to subscribe to a `cmd_vel` topic and move a robot.

```csharp
using UnityEngine;
using Unity.Robotics.ROSTCPConnector;
using RosMessageTypes.Geometry;

public class RobotController : MonoBehaviour
{
    private ROSConnection ros;
    public string topicName = "cmd_vel";
    public float speed = 1.0f;

    void Start()
    {
        ros = ROSConnection.GetOrCreateInstance();
        ros.Subscribe<TwistMsg>(topicName, MoveRobot);
    }

    void MoveRobot(TwistMsg msg)
    {
        // Convert ROS Twist message to Unity Vector3
        // ROS: X=Forward, Y=Left, Z=Up
        // Unity: Z=Forward, X=Right, Y=Up
        Vector3 movement = new Vector3((float)-msg.linear.y, 0, (float)msg.linear.x) * speed * Time.deltaTime;
        transform.Translate(movement);
    }
}
```