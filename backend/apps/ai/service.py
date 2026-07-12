from google import genai
from django.conf import settings

from .models import ChatMessage
from .prompts import SYSTEM_PROMPT


class AIService:

    def __init__(self):
        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY
        )

    def build_prompt(self, user, message):

        history = (
            ChatMessage.objects
            .filter(user=user)
            .order_by("created_at")
        )

        prompt = SYSTEM_PROMPT + "\n\n"

        for chat in history:
            prompt += f"{chat.role}: {chat.content}\n"

        prompt += f"user: {message}"

        return prompt

    def chat(self, user, message):

        prompt = self.build_prompt(user, message)

        interaction = self.client.interactions.create(
            model="gemini-3.5-flash",
            input=prompt,
        )

        return interaction.output_text