from django.contrib.auth import get_user_model
from django.db import transaction

User = get_user_model()


@transaction.atomic
def register_user(*, validated_data):
    password = validated_data.pop("password")

    return User.objects.create_user(
        password=password,
        **validated_data,
    )


@transaction.atomic
def update_user(*, user, validated_data):
    for field, value in validated_data.items():
        setattr(user, field, value)

    user.save(update_fields=validated_data.keys())

    return user


@transaction.atomic
def change_password(*, user, new_password):
    user.set_password(new_password)
    user.save(update_fields=["password"])

    return user