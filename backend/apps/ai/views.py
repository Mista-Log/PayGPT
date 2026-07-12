from drf_spectacular.utils import (
    OpenApiExample,
    OpenApiResponse,
    extend_schema,
)

from httpx import request
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ChatMessage
from .serializers import ChatSerializer
from .service import AIService


@extend_schema(
    tags=["AI"],
    summary="Chat with PayGPT",
    description="""
Send a message to PayGPT and receive an AI-generated response.

The conversation history is automatically included to provide context.
""",
    request=ChatSerializer,
    responses={
        200: OpenApiResponse(
            description="AI response returned successfully."
        )
    },
    examples=[
        OpenApiExample(
            "Chat Request",
            value={
                "message": "Hello PayGPT"
            },
            request_only=True,
        ),
        OpenApiExample(
            "Chat Response",
            value={
                "response": "Hello! I'm PayGPT. How can I help you today?"
            },
            response_only=True,
        ),
    ],
)
class ChatAPIView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        serializer = ChatSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        message = serializer.validated_data["message"]

        # Save user's message
        ChatMessage.objects.create(
            user=request.user,
            role=ChatMessage.Role.USER,
            content=message,
        )

        ai_service = AIService()

        ai_response = ai_service.chat(
            request.user,
            message,
        )

        # Save assistant's response
        assistant_message = ChatMessage.objects.create(
            user=request.user,
            role=ChatMessage.Role.ASSISTANT,
            content=ai_response,
        )

        return Response(
            {
                "message": {
                    "id": assistant_message.id,
                    "role": assistant_message.role,
                    "content": assistant_message.content,
                    "created_at": assistant_message.created_at,
                }
            },
            status=status.HTTP_200_OK,
        )