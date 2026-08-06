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

class SectionQuerySet(models.QuerySet):
    def published(self):
        return self.filter(
            is_published=True,
        )

    def active(self):
        return self.filter(
            is_active=True,
        )


class SectionManager(models.Manager):
    def get_queryset(self):
        return SectionQuerySet(
            self.model,
            using=self._db,
        )

    def published(self):
        return self.get_queryset().published()

    def active(self):
        return self.get_queryset().active()


class LectureQuerySet(models.QuerySet):
    def published(self):
        return self.filter(
            is_published=True,
        )

    def preview(self):
        return self.filter(
            is_preview=True,
        )

    def active(self):
        return self.filter(
            is_active=True,
        )


class LectureManager(models.Manager):
    def get_queryset(self):
        return LectureQuerySet(
            self.model,
            using=self._db,
        )

    def published(self):
        return self.get_queryset().published()

    def preview(self):
        return self.get_queryset().preview()

    def active(self):
        return self.get_queryset().active()