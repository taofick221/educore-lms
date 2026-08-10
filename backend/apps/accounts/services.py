from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from django.utils import timezone

User = get_user_model()


@transaction.atomic
def register_user(*, validated_data):
    """
    Register a new user.
    """
    password = validated_data.pop("password")

    user = User.objects.create_user(
        password=password,
        **validated_data,
    )

    return user


@transaction.atomic
def update_user(*, user, validated_data):
    """
    Update user profile.
    """
    for field, value in validated_data.items():
        setattr(user, field, value)

    user.save()

    return user


@transaction.atomic
def change_password(*, user, new_password):
    """
    Change account password.
    """
    validate_password(
        new_password,
        user=user,
    )

    user.set_password(new_password)

    user.save(
        update_fields=[
            "password",
        ]
    )

    return user


@transaction.atomic
def reset_password(*, user, password):
    """
    Reset account password.
    """
    validate_password(
        password,
        user=user,
    )

    user.set_password(password)

    user.save(
        update_fields=[
            "password",
        ]
    )

    return user


@transaction.atomic
def verify_user(*, user):
    """
    Verify account.
    """
    user.is_verified = True

    user.save(
        update_fields=[
            "is_verified",
        ]
    )

    return user


@transaction.atomic
def activate_user(*, user):
    """
    Activate account.
    """
    user.is_active = True

    user.save(
        update_fields=[
            "is_active",
        ]
    )

    return user


@transaction.atomic
def deactivate_user(*, user):
    """
    Deactivate account.
    """
    user.is_active = False

    user.save(
        update_fields=[
            "is_active",
        ]
    )

    return user


@transaction.atomic
def update_last_login(*, user):
    """
    Update last login timestamp.
    """
    user.last_login = timezone.now()

    user.save(
        update_fields=[
            "last_login",
        ]
    )

    return user


@transaction.atomic
def upload_avatar(*, user, avatar):
    """
    Upload avatar.
    """
    user.avatar = avatar

    user.save(
        update_fields=[
            "avatar",
        ]
    )

    return user


@transaction.atomic
def delete_avatar(*, user):
    """
    Delete avatar.
    """
    if user.avatar:
        user.avatar.delete(save=False)

    user.avatar = "profiles/default.png"

    user.save(
        update_fields=[
            "avatar",
        ]
    )

    return user


def send_password_reset_email(*, user):
    """
    Placeholder.

    Sprint 8:
        - Celery
        - Redis
        - SMTP
        - Password Reset Email
    """
    return None


def build_user_payload(user):
    """
    User payload returned after login.
    """
    return {
        "id": str(user.id),
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "full_name": user.full_name,
        "phone_number": user.phone_number,
        "avatar": (
            user.avatar.url
            if user.avatar
            else None
        ),
        "role": user.role,
        "is_verified": user.is_verified,
        "is_active": user.is_active,
        "last_login": user.last_login,
        "created_at": user.created_at,
    }