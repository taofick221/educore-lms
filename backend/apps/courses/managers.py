from django.db import models


class CategoryQuerySet(models.QuerySet):
    def active(self):
        return self.filter(
            is_active=True,
        )


class CategoryManager(models.Manager):
    def get_queryset(self):
        return CategoryQuerySet(
            self.model,
            using=self._db,
        )

    def active(self):
        return self.get_queryset().active()


class CourseQuerySet(models.QuerySet):
    def published(self):
        return self.filter(
            is_published=True,
        )

    def draft(self):
        return self.filter(
            is_published=False,
        )

    def active(self):
        return self.filter(
            is_active=True,
        )


class CourseManager(models.Manager):
    def get_queryset(self):
        return CourseQuerySet(
            self.model,
            using=self._db,
        )

    def published(self):
        return self.get_queryset().published()

    def draft(self):
        return self.get_queryset().draft()

    def active(self):
        return self.get_queryset().active()