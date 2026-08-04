from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

User = get_user_model()


def get_user_by_id(user_id):
    return get_object_or_404(User, id=user_id)


def get_user_by_email(email):
    return User.objects.filter(email=email).first()


def get_active_users():
    return User.objects.filter(is_active=True)