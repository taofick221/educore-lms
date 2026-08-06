from django.db import models

from .choices import (
    EnrollmentStatus,
)


# ==========================================================
# Enrollment QuerySet
# ==========================================================


class EnrollmentQuerySet(models.QuerySet):
    def active(self):
        return self.filter(
            is_active=True,
            status=EnrollmentStatus.ACTIVE,
        )

    def completed(self):
        return self.filter(
            status=EnrollmentStatus.COMPLETED,
        )

    def pending(self):
        return self.filter(
            status=EnrollmentStatus.PENDING,
        )

    def cancelled(self):
        return self.filter(
            status=EnrollmentStatus.CANCELLED,
        )

    def expired(self):
        return self.filter(
            status=EnrollmentStatus.EXPIRED,
        )


class EnrollmentManager(models.Manager):
    def get_queryset(self):
        return EnrollmentQuerySet(
            self.model,
            using=self._db,
        )

    def active(self):
        return self.get_queryset().active()

    def completed(self):
        return self.get_queryset().completed()

    def pending(self):
        return self.get_queryset().pending()

    def cancelled(self):
        return self.get_queryset().cancelled()

    def expired(self):
        return self.get_queryset().expired()


# ==========================================================
# Lesson Progress QuerySet
# ==========================================================


class LessonProgressQuerySet(models.QuerySet):
    def completed(self):
        return self.filter(
            is_completed=True,
        )

    def incomplete(self):
        return self.filter(
            is_completed=False,
        )


class LessonProgressManager(models.Manager):
    def get_queryset(self):
        return LessonProgressQuerySet(
            self.model,
            using=self._db,
        )

    def completed(self):
        return self.get_queryset().completed()

    def incomplete(self):
        return self.get_queryset().incomplete()


# ==========================================================
# Course Progress QuerySet
# ==========================================================


class CourseProgressQuerySet(models.QuerySet):
    def completed(self):
        return self.filter(
            progress_percentage=100,
        )

    def in_progress(self):
        return self.filter(
            progress_percentage__gt=0,
            progress_percentage__lt=100,
        )

    def not_started(self):
        return self.filter(
            progress_percentage=0,
        )


class CourseProgressManager(models.Manager):
    def get_queryset(self):
        return CourseProgressQuerySet(
            self.model,
            using=self._db,
        )

    def completed(self):
        return self.get_queryset().completed()

    def in_progress(self):
        return self.get_queryset().in_progress()

    def not_started(self):
        return self.get_queryset().not_started()