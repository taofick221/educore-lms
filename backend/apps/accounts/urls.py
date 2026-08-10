from django.urls import path

from .views import (
    ChangePasswordAPIView,
    ForgotPasswordAPIView,
    LoginAPIView,
    LogoutAPIView,
    ProfileAPIView,
    RefreshTokenAPIView,
    RegisterAPIView,
    ResetPasswordAPIView,
    VerifyTokenAPIView,
)

app_name = "accounts"

urlpatterns = [
    # Authentication
    path(
        "register/",
        RegisterAPIView.as_view(),
        name="register",
    ),
    path(
        "login/",
        LoginAPIView.as_view(),
        name="login",
    ),
    path(
        "refresh/",
        RefreshTokenAPIView.as_view(),
        name="refresh",
    ),
    path(
        "verify/",
        VerifyTokenAPIView.as_view(),
        name="verify",
    ),
    path(
        "logout/",
        LogoutAPIView.as_view(),
        name="logout",
    ),

    # Profile (GET and PATCH)
    path(
        "me/",
        ProfileAPIView.as_view(),
        name="profile",
    ),

    # Password
    path(
        "change-password/",
        ChangePasswordAPIView.as_view(),
        name="change-password",
    ),
    path(
        "forgot-password/",
        ForgotPasswordAPIView.as_view(),
        name="forgot-password",
    ),
    path(
        "reset-password/<uuid:user_id>/",
        ResetPasswordAPIView.as_view(),
        name="reset-password",
    ),
]