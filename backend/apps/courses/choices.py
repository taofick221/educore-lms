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


class ResourceTypeChoices(models.TextChoices):
    PDF = "pdf", "PDF"
    DOCUMENT = "document", "Document"
    ZIP = "zip", "ZIP Archive"
    IMAGE = "image", "Image"
    VIDEO = "video", "Video"
    LINK = "link", "External Link"
    OTHER = "other", "Other"