import os
import asyncio
import base64
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_BASE_URL = os.getenv(
    "OPENROUTER_BASE_URL",
    "https://openrouter.ai/api/v1"
)

if not OPENROUTER_API_KEY:
    raise ValueError(
        "OPENROUTER_API_KEY is not set in the environment."
    )

model = AsyncOpenAI(
    api_key=OPENROUTER_API_KEY,
    base_url=OPENROUTER_BASE_URL
)

MODEL = "qwen/qwen-2.5-vl-72b-instruct"


async def getqwen_response(prompt_text, image=""):
    """
    Send text and optionally an image to Qwen 2.5 VL.

    image:
        - Empty string "" -> text-only request
        - Local image path -> image + text request
    """

    if not image:
        content = prompt_text

    else:
        with open(image, "rb") as image_file:
            image_data = base64.b64encode(
                image_file.read()
            ).decode("utf-8")

        extension = os.path.splitext(image)[1].lower()

        if extension in [".jpg", ".jpeg"]:
            mime_type = "image/jpeg"
        elif extension == ".png":
            mime_type = "image/png"
        elif extension == ".webp":
            mime_type = "image/webp"
        else:
            raise ValueError(
                "Unsupported image format. Use JPG, PNG or WEBP."
            )

        content = [
            {
                "type": "text",
                "text": prompt_text
            },
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:{mime_type};base64,{image_data}"
                }
            }
        ]

    response = await model.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": content
            }
        ],
        temperature=0.7,
        max_tokens=512
    )

    return response.choices[0].message.content


async def main():

    result = await getqwen_response(
        "Explain quantum entanglement in simple terms.",
        ""
    )

    print(result)


if __name__ == "__main__":
    asyncio.run(main())