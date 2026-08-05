import uuid

from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.text import slugify

from apps.common.models import TimeStampedModel

from .choices import (
    CourseLanguage,
    CourseLevel,
    CourseStatus,
)
from .constants import (
    DEFAULT_COURSE_LANGUAGE,
    DEFAULT_COURSE_LEVEL,
    DEFAULT_COURSE_STATUS,
    MAX_CATEGORY_DESCRIPTION_LENGTH,
    MAX_CATEGORY_NAME_LENGTH,
    MAX_COURSE_SUBTITLE_LENGTH,
    MAX_COURSE_TITLE_LENGTH,
    MAX_PRICE_DIGITS,
    MAX_SLUG_LENGTH,
    PRICE_DECIMAL_PLACES,
)
from .managers import (
    CategoryManager,
    CourseManager,
)


class Category(TimeStampedModel):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    name = models.CharField(
        max_length=MAX_CATEGORY_NAME_LENGTH,
        unique=True,
        db_index=True,
    )

    slug = models.SlugField(
        max_length=MAX_SLUG_LENGTH,
        unique=True,
        blank=True,
    )

    description = models.TextField(
        max_length=MAX_CATEGORY_DESCRIPTION_LENGTH,
        blank=True,
    )

    icon = models.ImageField(
        upload_to="categories/",
        blank=True,
        null=True,
    )

    is_active = models.BooleanField(
        default=True,
        db_index=True,
    )

    objects = CategoryManager()

    class Meta:
        ordering = ["name"]
        verbose_name = "Category"
        verbose_name_plural = "Categories"

        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["is_active"]),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1

            while Category.objects.filter(slug=slug).exclude(
                pk=self.pk,
            ).exists():
                counter += 1
                slug = f"{base_slug}-{counter}"

            self.slug = slug

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Course(TimeStampedModel):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="courses",
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="courses",
    )

    title = models.CharField(
        max_length=MAX_COURSE_TITLE_LENGTH,
        db_index=True,
    )

    slug = models.SlugField(
        max_length=MAX_SLUG_LENGTH,
        unique=True,
        blank=True,
    )

    subtitle = models.CharField(
        max_length=MAX_COURSE_SUBTITLE_LENGTH,
        blank=True,
    )

    short_description = models.CharField(
        max_length=500,
        blank=True,
    )

    description = models.TextField()

    thumbnail = models.ImageField(
        upload_to="courses/thumbnails/",
        blank=True,
        null=True,
    )

    intro_video = models.URLField(
        blank=True,
    )

    level = models.CharField(
        max_length=20,
        choices=CourseLevel.choices,
        default=DEFAULT_COURSE_LEVEL,
    )

    language = models.CharField(
        max_length=20,
        choices=CourseLanguage.choices,
        default=DEFAULT_COURSE_LANGUAGE,
    )

    duration = models.PositiveIntegerField(
        default=0,
        help_text="Course duration in minutes.",
    )

    price = models.DecimalField(
        max_digits=MAX_PRICE_DIGITS,
        decimal_places=PRICE_DECIMAL_PLACES,
    )

    discount_price = models.DecimalField(
        max_digits=MAX_PRICE_DIGITS,
        decimal_places=PRICE_DECIMAL_PLACES,
        blank=True,
        null=True,
    )

    status = models.CharField(
        max_length=20,
        choices=CourseStatus.choices,
        default=DEFAULT_COURSE_STATUS,
        db_index=True,
    )

    is_featured = models.BooleanField(
        default=False,
        db_index=True,
    )

    is_published = models.BooleanField(
        default=False,
        db_index=True,
    )

    is_active = models.BooleanField(
        default=True,
        db_index=True,
    )

    published_at = models.DateTimeField(
        blank=True,
        null=True,
    )

    meta_title = models.CharField(
        max_length=255,
        blank=True,
    )

    meta_description = models.TextField(
        blank=True,
    )

    objects = CourseManager()
    class Meta:
        ordering = [
            "-created_at",
        ]

        verbose_name = "Course"
        verbose_name_plural = "Courses"

        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["category"]),
            models.Index(fields=["instructor"]),
            models.Index(fields=["status"]),
            models.Index(fields=["level"]),
            models.Index(fields=["language"]),
            models.Index(fields=["is_featured"]),
            models.Index(fields=["is_published"]),
            models.Index(fields=["created_at"]),
        ]

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "category",
                    "title",
                ],
                name="unique_course_title_per_category",
            ),
            models.CheckConstraint(
                check=models.Q(price__gte=0),
                name="course_price_greater_than_zero",
            ),
            models.CheckConstraint(
                check=(
                    models.Q(discount_price__isnull=True)
                    | models.Q(discount_price__gte=0)
                ),
                name="course_discount_price_greater_than_zero",
            ),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1

            while Course.objects.filter(
                slug=slug,
            ).exclude(
                pk=self.pk,
            ).exists():
                counter += 1
                slug = f"{base_slug}-{counter}"

            self.slug = slug

        if self.is_published and self.published_at is None:
            self.published_at = timezone.now()

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class CourseFeature(TimeStampedModel):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="features",
    )

    title = models.CharField(
        max_length=255,
    )

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.title


class LearningOutcome(TimeStampedModel):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="learning_outcomes",
    )

    title = models.CharField(
        max_length=255,
    )

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.title


class Requirement(TimeStampedModel):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="requirements",
    )

    title = models.CharField(
        max_length=255,
    )

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.title