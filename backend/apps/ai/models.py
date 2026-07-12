from django.db import models
from django.conf import settings


class ChatMessage(models.Model):

    class Role(models.TextChoices):
        USER = "user"
        ASSISTANT = "assistant"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
    )

    content = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]