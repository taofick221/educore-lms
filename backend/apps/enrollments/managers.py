from django.db import models

from .choices import EnrollmentStatus


# ==========================================================
# Enrollment QuerySet
# ==========================================================


class EnrollmentQuerySet(models.QuerySet):

    def active(self):
        """
        Retrieve all active enrollment records.

        An enrollment can be:
        - active
        - completed
        - pending

        as long as is_active=True.
        """
        return self.filter(
            is_active=True,
        )

    def completed(self):
        """
        Retrieve completed enrollments.
        """
        return self.filter(
            is_active=True,
            status=EnrollmentStatus.COMPLETED,
        )

    def pending(self):
        """
        Retrieve pending enrollments.
        """
        return self.filter(
            is_active=True,
            status=EnrollmentStatus.PENDING,
        )

    def cancelled(self):
        """
        Retrieve cancelled enrollments.
        """
        return self.filter(
            is_active=True,
            status=EnrollmentStatus.CANCELLED,
        )

    def expired(self):
        """
        Retrieve expired enrollments.
        """
        return self.filter(
            is_active=True,
            status=EnrollmentStatus.EXPIRED,
        )


# ==========================================================
# Enrollment Manager
# ==========================================================


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
        """
        Retrieve completed lesson progress.
        """
        return self.filter(
            is_completed=True,
        )

    def incomplete(self):
        """
        Retrieve incomplete lesson progress.
        """
        return self.filter(
            is_completed=False,
        )


# ==========================================================
# Lesson Progress Manager
# ==========================================================


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
        """
        Retrieve completed courses.
        """
        return self.filter(
            progress_percentage=100,
        )

    def in_progress(self):
        """
        Retrieve courses currently in progress.
        """
        return self.filter(
            progress_percentage__gt=0,
            progress_percentage__lt=100,
        )

    def not_started(self):
        """
        Retrieve courses that have not started.
        """
        return self.filter(
            progress_percentage=0,
        )


# ==========================================================
# Course Progress Manager
# ==========================================================


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