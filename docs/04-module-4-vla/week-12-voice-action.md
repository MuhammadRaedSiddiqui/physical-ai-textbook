---
sidebar_position: 2
title: Week 12 - Voice-to-Action & Cognitive Planning
---

# Week 12 - Voice-to-Action & Cognitive Planning

## 1. Voice Commands with OpenAI Whisper
We can use a Speech-to-Text model like OpenAI's Whisper to convert spoken commands into text. This allows for a very natural and intuitive way to interact with a robot.

## 2. Cognitive Planning with GPT-4
A high-level command like "Clean the room" is too abstract for a VLA model to handle directly. We need a "cognitive planner" to break it down into a sequence of concrete actions. We can use a powerful LLM like GPT-4 for this.

**Example:**
"Clean the room" -> **GPT-4** ->
```json
[
  {"action": "find", "object": "empty_soda_can"},
  {"action": "pick_up", "object": "empty_soda_can"},
  {"action": "find", "object": "trash_can"},
  {"action": "place", "object": "empty_soda_can", "target": "trash_can"},
  {"action": "find", "object": "dirty_plate"},
  {"action": "pick_up", "object": "dirty_plate"},
  {"action": "find", "object": "dishwasher"},
  {"action": "place", "object": "dirty_plate", "target": "dishwasher"}
]
```
This JSON sequence can then be executed one step at a time by the VLA model.

## 3. Python Example (GPT-4 Prompt)

```python
import openai

# You would need to set up your OpenAI API key
# openai.api_key = 'YOUR_API_KEY'

def get_action_sequence(command: str) -> str:
    response = openai.Completion.create(
        engine="text-davinci-003", # Or a chat model like gpt-4
        prompt=f"""
        You are a cognitive planner for a home robot.
        Convert the following high-level command into a JSON list of actions.
        The available actions are: find, pick_up, place.
        Command: "{command}"
        JSON sequence:
        """,
        temperature=0.0,
        max_tokens=200,
    )
    return response.choices[0].text

# Example usage:
# action_json = get_action_sequence("Clean up my desk")
# print(action_json)
```
This example shows how to use the OpenAI API to generate an action sequence from a natural language command.
