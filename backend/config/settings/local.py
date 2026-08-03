from .base import *  # noqa: F403

DEBUG = True

INSTALLED_APPS += [  # noqa: F405
    "django_extensions",
]

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
