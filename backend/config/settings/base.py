from datetime import timedelta
from pathlib import Path

from django.urls import reverse_lazy

from decouple import Csv, config


# ==========================================================
# Base Directory
# ==========================================================

BASE_DIR = Path(__file__).resolve().parent.parent.parent


# ==========================================================
# Core Settings
# ==========================================================

SECRET_KEY = config("SECRET_KEY")

DEBUG = config(
    "DEBUG",
    default=False,
    cast=bool,
)

ALLOWED_HOSTS = config(
    "ALLOWED_HOSTS",
    default="localhost,127.0.0.1",
    cast=Csv(),
)


# ==========================================================
# Installed Apps
# ==========================================================
INSTALLED_APPS = [
    # ------------------------------------------------------
    # Unfold
    # ------------------------------------------------------
    "unfold",

    # ------------------------------------------------------
    # Django
    # ------------------------------------------------------
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    

    # ------------------------------------------------------
    # Third Party
    # ------------------------------------------------------
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
    "drf_spectacular",
    "django_filters",
    

    # ------------------------------------------------------
    # Project Apps
    # ------------------------------------------------------
    "apps.common",
    "apps.accounts",
    "apps.courses",
    "apps.enrollments",
    "apps.orders",
    "apps.notifications",
    "apps.certificates",
    "apps.quizzes",
    "apps.assignments",
    "apps.instructor",
]


# ==========================================================
# Middleware
# ==========================================================

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# ==========================================================
# URL / Application Configuration
# ==========================================================

ROOT_URLCONF = "config.urls"

WSGI_APPLICATION = "config.wsgi.application"


# ==========================================================
# Templates
# ==========================================================

TEMPLATES = [
    {
        "BACKEND": (
            "django.template.backends.django."
            "DjangoTemplates"
        ),
        "DIRS": [
            BASE_DIR / "templates",
        ],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                (
                    "django.template.context_processors."
                    "debug"
                ),
                (
                    "django.template.context_processors."
                    "request"
                ),
                (
                    "django.contrib.auth.context_processors."
                    "auth"
                ),
                (
                    "django.contrib.messages.context_processors."
                    "messages"
                ),
            ],
        },
    },
]


# ==========================================================
# Database
# ==========================================================

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config(
            "DATABASE_NAME",
            default="educore",
        ),
        "USER": config(
            "DATABASE_USER",
            default="educore",
        ),
        "PASSWORD": config(
            "DATABASE_PASSWORD",
            default="educore",
        ),
        "HOST": config(
            "DATABASE_HOST",
            default="localhost",
        ),
        "PORT": config(
            "DATABASE_PORT",
            default="5432",
        ),
    }
}


# ==========================================================
# Password Validation
# ==========================================================

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "UserAttributeSimilarityValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "MinimumLengthValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "CommonPasswordValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "NumericPasswordValidator"
        ),
    },
]


# ==========================================================
# Internationalization
# ==========================================================

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# ==========================================================
# Static Files
# ==========================================================

STATIC_URL = "static/"

STATIC_ROOT = BASE_DIR / "staticfiles"

STATICFILES_DIRS = [
    BASE_DIR / "static",
]


# ==========================================================
# Media Files
# ==========================================================

MEDIA_URL = "media/"

MEDIA_ROOT = BASE_DIR / "media"


# ==========================================================
# Django Defaults
# ==========================================================

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "accounts.User"


# ==========================================================
# Django REST Framework
# ==========================================================

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        (
            "rest_framework_simplejwt.authentication."
            "JWTAuthentication"
        ),
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_SCHEMA_CLASS": (
        "drf_spectacular.openapi.AutoSchema"
    ),
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.MultiPartParser",
        "rest_framework.parsers.FormParser",
    ],
    "DEFAULT_FILTER_BACKENDS": [
        (
            "django_filters.rest_framework."
            "DjangoFilterBackend"
        ),
    ],
}


# ==========================================================
# Simple JWT
# ==========================================================

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(
        minutes=30,
    ),
    "REFRESH_TOKEN_LIFETIME": timedelta(
        days=7,
    ),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}


# ==========================================================
# CORS
# ==========================================================

CORS_ALLOWED_ORIGINS = config(
    "CORS_ALLOWED_ORIGINS",
    default="http://localhost:5173",
    cast=Csv(),
)


# ==========================================================
# DRF Spectacular
# ==========================================================

SPECTACULAR_SETTINGS = {
    "TITLE": "EduCore LMS API",
    "DESCRIPTION": (
        "Production Ready Learning Management System API"
    ),
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
}


# ==========================================================
# Django Unfold
# ==========================================================

UNFOLD = {
    "SITE_TITLE": "EduCore Admin",
    "SITE_HEADER": "EduCore",
    "SITE_URL": "/",
    "SITE_SYMBOL": "school",

    "SHOW_HISTORY": True,
    "SHOW_VIEW_ON_SITE": True,

    "THEME": "light",
    "DASHBOARD_CALLBACK": "config.admin_dashboard.dashboard_callback",
    "SIDEBAR": {
        "show_search": True,
        "show_all_applications": False,
        "navigation": [
            {
                "title": "EduCore",
                "separator": True,
                "collapsible": False,
                "items": [
                    {"title": "Dashboard", "icon": "dashboard",
                        "link": reverse_lazy("admin:index")},
                    {"title": "Users", "icon": "people", "link": reverse_lazy(
                        "admin:accounts_user_changelist")},
                    {"title": "Courses", "icon": "school", "link": reverse_lazy(
                        "admin:courses_course_changelist")},
                    {"title": "Enrollments", "icon": "group", "link": reverse_lazy(
                        "admin:enrollments_enrollment_changelist")},
                    {"title": "Orders", "icon": "shopping_cart",
                        "link": reverse_lazy("admin:orders_order_changelist")},
                    {"title": "Notifications", "icon": "notifications", "link": reverse_lazy(
                        "admin:notifications_notification_changelist")},
                    {"title": "Certificates", "icon": "workspace_premium", "link": reverse_lazy(
                        "admin:certificates_certificate_changelist")},
                    {"title": "Quizzes", "icon": "quiz", "link": reverse_lazy(
                        "admin:quizzes_quiz_changelist")},
                    {"title": "Assignments", "icon": "assignment", "link": reverse_lazy(
                        "admin:assignments_assignment_changelist")},
                ],
            },
        ],
    },
}
# ==========================================================
# Redis / Celery
# ==========================================================

REDIS_URL = config(
    "REDIS_URL",
    default="redis://redis:6379/0",
)

REDIS_CACHE_URL = config(
    "REDIS_CACHE_URL",
    default="redis://redis:6379/1",
)

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": REDIS_CACHE_URL,
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        },
    },
}

CELERY_BROKER_URL = config("CELERY_BROKER_URL", default=REDIS_URL)
CELERY_RESULT_BACKEND = config("CELERY_RESULT_BACKEND", default=REDIS_URL)
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = TIME_ZONE
CELERY_TASK_TRACK_STARTED = True
CELERY_TASK_TIME_LIMIT = 300
CELERY_TASK_SOFT_TIME_LIMIT = 240
CELERY_BEAT_SCHEDULE = {
    "expire-enrollments-hourly": {
        "task": "apps.common.tasks.expire_enrollments",
        "schedule": 3600.0,
    },
}

# ==========================================================
# Email / Frontend
# ==========================================================

DEFAULT_FROM_EMAIL = config(
    "DEFAULT_FROM_EMAIL",
    default="noreply@educore.local",
)
FRONTEND_URL = config(
    "FRONTEND_URL",
    default="http://localhost:5173",
)

# ==========================================================
# Security Defaults
# ==========================================================

SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"
SECURE_REFERRER_POLICY = "same-origin"
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = False

if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
