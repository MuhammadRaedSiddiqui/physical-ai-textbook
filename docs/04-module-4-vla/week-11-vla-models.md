---
sidebar_position: 1
title: Week 11 - Vision-Language-Action (VLA) Models
---

# Week 11 - Vision-Language-Action (VLA) Models

## 1. The Convergence of LLMs and Robotics
Vision-Language-Action (VLA) models represent a paradigm shift. Instead of separate modules for perception, planning, and control, a VLA is trained end-to-end to output robot actions (joint positions or end-effector deltas) directly from visual and textual input.

## 2. OpenVLA: An Open Source Standard
While Google's RT-2 is proprietary, **OpenVLA** is a popular open-source alternative built on Llama. It fine-tunes a Vision-Language Model (VLM) to output "action tokens" representing discretized robot movements.

## 3. Running OpenVLA (Python Example)
Here is how you might load and query a VLA model using the Hugging Face `transformers` library:

```python
from transformers import AutoModelForVision2Seq, AutoProcessor
from PIL import Image
import torch

# 1. Load Model
model_id = "openvla/openvla-7b"
processor = AutoProcessor.from_pretrained(model_id, trust_remote_code=True)
model = AutoModelForVision2Seq.from_pretrained(
    model_id, 
    torch_dtype=torch.bfloat16, 
    low_cpu_mem_usage=True, 
    trust_remote_code=True
).to("cuda")

# 2. Prepare Input
image = Image.open("robot_view.jpg")
prompt = "In: What action should the robot take to [pick up the red apple]?\nOut:"

# 3. Predict Action
inputs = processor(prompt, image).to("cuda", dtype=torch.bfloat16)
action_tokens = model.predict_action(**inputs, unnorm_key="bridge_orig")

print(f"Predicted Robot Action: {action_tokens}")
```