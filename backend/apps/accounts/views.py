from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import extend_schema


from .serializers import (
    SignupSerializer,
    LoginSerializer,
)




@extend_schema(
    tags=["Authentication"],
    summary="Create a new user account",
    description="Registers a new user using email and password.",
)
class SignupView(GenericAPIView):
    serializer_class = SignupSerializer

    def post(self, request):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = serializer.save()

        return Response(
            {
                "message": "Account created successfully.",
                "user": {
                    "id": user.id,
                    "full_name": user.full_name,
                    "business_name": user.business_name,
                    "email": user.email,
                },
            },
            status=status.HTTP_201_CREATED,
        )

@extend_schema(
    tags=["Authentication"],
    summary="Login",
    description="Authenticate a user and return JWT tokens.",
)
class LoginView(GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True,
        )

        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        )