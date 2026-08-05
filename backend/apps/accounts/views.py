from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)

from .jwt import EduCoreTokenObtainPairSerializer
from .selectors import get_user_by_id
from .serializers import (
    ChangePasswordSerializer,
    ForgotPasswordSerializer,
    LoginSerializer,
    ProfileSerializer,
    RegisterSerializer,
    ResetPasswordSerializer,
    UpdateProfileSerializer,
)
from .services import (
    reset_password,
    send_password_reset_email,
)


@extend_schema(
    tags=["Authentication"],
    summary="Register",
    description="Register a new user account.",
    request=RegisterSerializer,
    responses={
        201: RegisterSerializer,
    },
)
class RegisterAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


@extend_schema(
    tags=["Authentication"],
    summary="Login",
    description="Authenticate user and return JWT tokens.",
    request=LoginSerializer,
    responses={
        200: OpenApiResponse(
            description="Login successful.",
        ),
        401: OpenApiResponse(
            description="Invalid credentials.",
        ),
    },
)
class LoginAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = EduCoreTokenObtainPairSerializer(
            data=request.data,
            context={
                "request": request,
            },
        )

        serializer.is_valid(
            raise_exception=True,
        )

        return Response(
            serializer.validated_data,
            status=status.HTTP_200_OK,
        )


@extend_schema(
    tags=["Authentication"],
    summary="Refresh Access Token",
)
class RefreshTokenAPIView(TokenRefreshView):
    permission_classes = [permissions.AllowAny]


@extend_schema(
    tags=["Authentication"],
    summary="Verify Access Token",
)
class VerifyTokenAPIView(TokenVerifyView):
    permission_classes = [permissions.AllowAny]


@extend_schema(
    tags=["Authentication"],
    summary="Logout",
    description="Blacklist refresh token.",
    request={
        "application/json": {
            "type": "object",
            "properties": {
                "refresh": {
                    "type": "string",
                },
            },
            "required": [
                "refresh",
            ],
        },
    },
    responses={
        200: OpenApiResponse(
            description="Logout successful.",
        ),
        400: OpenApiResponse(
            description="Invalid refresh token.",
        ),
    },
)
class LogoutAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh = request.data.get("refresh")

        if not refresh:
            return Response(
                {
                    "detail": "Refresh token is required.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh)
            token.blacklist()

        except Exception:
            return Response(
                {
                    "detail": "Invalid refresh token.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "detail": "Logout successful.",
            },
            status=status.HTTP_200_OK,
        )


@extend_schema(
    tags=["Profile"],
    summary="Get Current User",
    description="Retrieve the authenticated user's profile.",
    responses={
        200: ProfileSerializer,
    },
)


class ProfileAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )
    

    @extend_schema(
        tags=["Profile"],
        summary="Update Profile",
        description="Update the authenticated user's profile.",
        request=UpdateProfileSerializer,
        responses={
            200: ProfileSerializer,
        },
    )
    def patch(self, request):
        serializer = UpdateProfileSerializer(
            instance=request.user,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        serializer.save()

        return Response(
            ProfileSerializer(request.user).data,
            status=status.HTTP_200_OK,
        )
    
@extend_schema(
    tags=["Authentication"],
    summary="Change Password",
    description="Change the authenticated user's password.",
    request=ChangePasswordSerializer,
    responses={
        200: OpenApiResponse(
            description="Password changed successfully.",
        ),
        400: OpenApiResponse(
            description="Validation error.",
        ),
    },
)
class ChangePasswordAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={
                "request": request,
            },
        )

        serializer.is_valid(
            raise_exception=True,
        )

        serializer.save()

        return Response(
            {
                "detail": "Password changed successfully.",
            },
            status=status.HTTP_200_OK,
        )


@extend_schema(
    tags=["Authentication"],
    summary="Forgot Password",
    description="Send password reset instructions.",
    request=ForgotPasswordSerializer,
    responses={
        200: OpenApiResponse(
            description="Password reset instructions sent.",
        ),
        400: OpenApiResponse(
            description="Validation error.",
        ),
    },
)
class ForgotPasswordAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(
            data=request.data,
            context={
                "request": request,
            },
        )

        serializer.is_valid(
            raise_exception=True,
        )

        send_password_reset_email(
            user=serializer.context["user"],
        )

        return Response(
            {
                "detail": (
                    "If the email exists, password reset instructions "
                    "have been sent."
                ),
            },
            status=status.HTTP_200_OK,
        )


@extend_schema(
    tags=["Authentication"],
    summary="Reset Password",
    description="Reset the user's password.",
    request=ResetPasswordSerializer,
    responses={
        200: OpenApiResponse(
            description="Password reset successfully.",
        ),
        400: OpenApiResponse(
            description="Validation error.",
        ),
    },
)
class ResetPasswordAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, user_id):
        serializer = ResetPasswordSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        user = get_user_by_id(
            user_id,
        )

        reset_password(
            user=user,
            password=serializer.validated_data["password"],
        )

        return Response(
            {
                "detail": "Password reset successfully.",
            },
            status=status.HTTP_200_OK,
        )