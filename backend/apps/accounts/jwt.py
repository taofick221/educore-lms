from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .services import (
    build_user_payload,
    update_last_login,
)


class EduCoreTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT serializer.
    """

    username_field = "email"

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["user_id"] = str(user.id)
        token["email"] = user.email
        token["role"] = user.role
        token["is_verified"] = user.is_verified
        token["first_name"] = user.first_name
        token["last_name"] = user.last_name

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        update_last_login(
            user=self.user,
        )

        data["user"] = build_user_payload(
            self.user,
        )

        return data