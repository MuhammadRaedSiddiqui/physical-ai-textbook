---
sidebar_position: 2
title: Week 2 - ROS 2 Architecture
---

# Week 2 - ROS 2 Architecture

## 1. The ROS 2 Graph Architecture
The "Graph" is the network of ROS 2 processes. It consists of:
* **Nodes:** A process that performs computation (e.g., a camera driver, a path planner).
* **Topics:** A named bus over which nodes exchange messages.
* **Services:** A request/reply communication pattern.

## 2. Minimal Publisher (Python)
This node publishes a "Hello World" message to the `chatter` topic.

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class MinimalPublisher(Node):
    def __init__(self):
        super().__init__('minimal_publisher')
        self.publisher_ = self.create_publisher(String, 'chatter', 10)
        timer_period = 0.5  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.i = 0

    def timer_callback(self):
        msg = String()
        msg.data = 'Hello World: %d' % self.i
        self.publisher_.publish(msg)
        self.get_logger().info('Publishing: "%s"' % msg.data)
        self.i += 1

def main(args=None):
    rclpy.init(args=args)
    minimal_publisher = MinimalPublisher()
    rclpy.spin(minimal_publisher)
    minimal_publisher.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## 3. Minimal Subscriber (Python)
This node subscribes to the `chatter` topic and prints the message.

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class MinimalSubscriber(Node):
    def __init__(self):
        super().__init__('minimal_subscriber')
        self.subscription = self.create_subscription(
            String,
            'chatter',
            self.listener_callback,
            10)
        self.subscription  # prevent unused variable warning

    def listener_callback(self, msg):
        self.get_logger().info('I heard: "%s"' % msg.data)

def main(args=None):
    rclpy.init(args=args)
    minimal_subscriber = MinimalSubscriber()
    rclpy.spin(minimal_subscriber)
    minimal_subscriber.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## 4. Communication Diagram

```mermaid
graph TD;
    A[Minimal Publisher] -- "publishes std_msgs/String" --> B(chatter Topic);
    B -- "delivers message" --> C[Minimal Subscriber];
```
