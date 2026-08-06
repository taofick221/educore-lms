import uuid

from django.db import models
from django.utils.text import slugify

from apps.common.models import TimeStampedModel

from ..constants import (
    MAX_CATEGORY_DESCRIPTION_LENGTH,
    MAX_CATEGORY_NAME_LENGTH,
    MAX_SLUG_LENGTH,
)
from ..managers import CategoryManager


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

            while Category.objects.filter(
                slug=slug,
            ).exclude(
                pk=self.pk,
            ).exists():
                counter += 1
                slug = f"{base_slug}-{counter}"

            self.slug = slug

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name