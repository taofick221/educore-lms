from django.contrib.auth import get_user_model
from django.db.models import Q
from django.shortcuts import get_object_or_404

User = get_user_model()


def get_user_by_id(user_id):
    """
    Return a user by UUID.
    """
    return get_object_or_404(
        User,
        id=user_id,
    )


def get_user_by_email(email):
    """
    Return a user by email.
    """
    return get_object_or_404(
        User,
        email=email.lower(),
    )


def get_active_users():
    """
    Return all active users.
    """
    return (
        User.objects.filter(
            is_active=True,
        )
        .order_by("-created_at")
    )


def get_verified_users():
    """
    Return verified users.
    """
    return (
        User.objects.filter(
            is_active=True,
            is_verified=True,
        )
        .order_by("-created_at")
    )


def get_students():
    """
    Return all students.
    """
    return (
        User.objects.filter(
            role="student",
            is_active=True,
        )
        .order_by("-created_at")
    )


def get_instructors():
    """
    Return all instructors.
    """
    return (
        User.objects.filter(
            role="instructor",
            is_active=True,
        )
        .order_by("-created_at")
    )


def get_admins():
    """
    Return all administrators.
    """
    return (
        User.objects.filter(
            role="admin",
            is_active=True,
        )
        .order_by("-created_at")
    )


def search_users(query):
    """
    Search users.
    """
    return (
        User.objects.filter(
            Q(first_name__icontains=query)
            | Q(last_name__icontains=query)
            | Q(email__icontains=query)
            | Q(phone_number__icontains=query)
        )
        .order_by("-created_at")
    )