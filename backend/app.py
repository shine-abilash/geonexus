import os
import requests
import json
from openai import OpenAI

OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
if not OPENROUTER_API_KEY:
    raise ValueError("Set the OPENROUTER_API_KEY environment variable before running this script.")

MODEL = "qwen/qwen-2.5-vl-7b-instruct:free"  # swap for any Qwen variant on OpenRouter

response = requests.post(
    url="https://openrouter.ai/api/v1/chat/completions",
    headers={
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    },
    data=json.dumps({
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Explain quantum entanglement in simple terms."}
        ],
        "temperature": 0.7,
        "max_tokens": 512,
    })
)

result = response.json()

if "choices" in result:
    print(result["choices"][0]["message"]["content"])
else:
    print("Error from API:", result)