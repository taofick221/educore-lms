from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .services import (
    change_password,
    register_user,
    update_user,
)

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
    )

    confirm_password = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
    )

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "role",
            "password",
            "confirm_password",
        )
        read_only_fields = ("id",)

    def validate_email(self, value):
        value = value.lower()

        if User.objects.filter(
            email__iexact=value,
        ).exists():
            raise serializers.ValidationError(
                "A user with this email already exists."
            )

        return value

    def validate_password(self, value):
        validate_password(value)
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {
                    "confirm_password": (
                        "Passwords do not match."
                    )
                }
            )

        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")

        return register_user(
            validated_data=validated_data,
        )


class ProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "phone_number",
            "avatar",
            "role",
            "is_verified",
            "is_active",
            "last_login",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "email",
            "role",
            "is_verified",
            "is_active",
            "last_login",
            "created_at",
            "updated_at",
        )


class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
            "phone_number",
            "avatar",
        )

    def validate_phone_number(self, value):
        if not value:
            return value

        exists = (
            User.objects.filter(
                phone_number=value,
            )
            .exclude(
                id=self.instance.id,
            )
            .exists()
        )

        if exists:
            raise serializers.ValidationError(
                "Phone number already exists."
            )

        return value

    def update(self, instance, validated_data):
        return update_user(
            user=instance,
            validated_data=validated_data,
        )


class LoginSerializer(serializers.Serializer):
    """
    Swagger/OpenAPI request serializer.

    Authentication is handled by
    EduCoreTokenObtainPairSerializer.
    """

    email = serializers.EmailField()

    password = serializers.CharField(
        write_only=True,
        style={
            "input_type": "password",
        },
    )
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(
        write_only=True,
    )

    new_password = serializers.CharField(
        write_only=True,
    )

    confirm_password = serializers.CharField(
        write_only=True,
    )

    def validate(self, attrs):
        user = self.context["request"].user

        if not user.check_password(
            attrs["old_password"],
        ):
            raise serializers.ValidationError(
                {
                    "old_password": (
                        "Old password is incorrect."
                    ),
                }
            )

        validate_password(
            attrs["new_password"],
            user=user,
        )

        if (
            attrs["new_password"]
            != attrs["confirm_password"]
        ):
            raise serializers.ValidationError(
                {
                    "confirm_password": (
                        "Passwords do not match."
                    ),
                }
            )

        return attrs

    def save(self):
        change_password(
            user=self.context["request"].user,
            new_password=self.validated_data[
                "new_password"
            ],
        )

        return self.context["request"].user


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        value = value.lower()

        user = User.objects.filter(
            email=value,
            is_active=True,
        ).first()

        if user is None:
            raise serializers.ValidationError(
                "No active account found with this email."
            )

        self.context["user"] = user

        return value


class ResetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(
        write_only=True,
        style={
            "input_type": "password",
        },
    )

    confirm_password = serializers.CharField(
        write_only=True,
        style={
            "input_type": "password",
        },
    )

    def validate(self, attrs):
        validate_password(
            attrs["password"],
        )

        if (
            attrs["password"]
            != attrs["confirm_password"]
        ):
            raise serializers.ValidationError(
                {
                    "confirm_password": (
                        "Passwords do not match."
                    ),
                }
            )

        return attrs