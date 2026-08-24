import os
import json
from openai import AsyncOpenAI
from agents import OpenAIChatCompletionsModel

OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
if not OPENROUTER_API_KEY:
    raise ValueError("Set the OPENROUTER_API_KEY environment variable before running this script.")

model = AsyncOpenAI(
    api_key=OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1",
)