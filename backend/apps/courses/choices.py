from django.db import models


class CourseLevel(models.TextChoices):
    BEGINNER = "beginner", "Beginner"
    INTERMEDIATE = "intermediate", "Intermediate"
    ADVANCED = "advanced", "Advanced"


class CourseLanguage(models.TextChoices):
    ENGLISH = "english", "English"
    BANGLA = "bangla", "Bangla"
    ARABIC = "arabic", "Arabic"


class CourseStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    REVIEW = "review", "In Review"
    PUBLISHED = "published", "Published"
    ARCHIVED = "archived", "Archived"