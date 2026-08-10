from django.db.models.signals import post_delete, post_save, pre_save
from django.dispatch import receiver

from .models import (
    Category,
    Course,
    Lecture,
    Resource,
    Section,
)


# ==========================================================
# Category Signals
# ==========================================================


@receiver(pre_save, sender=Category)
def category_pre_save(sender, instance, **kwargs):
    """
    Hook before saving category.
    """
    pass


@receiver(post_save, sender=Category)
def category_post_save(
    sender,
    instance,
    created,
    **kwargs,
):
    """
    Hook after saving category.
    """

    if created:
        return


# ==========================================================
# Course Signals
# ==========================================================


@receiver(pre_save, sender=Course)
def course_pre_save(sender, instance, **kwargs):
    """
    Hook before saving course.
    """
    pass


@receiver(post_save, sender=Course)
def course_post_save(
    sender,
    instance,
    created,
    **kwargs,
):
    """
    Hook after saving course.
    """

    if created:
        # TODO:
        # Send notification
        # Index search
        # Update analytics
        pass


@receiver(post_delete, sender=Course)
def course_post_delete(
    sender,
    instance,
    **kwargs,
):
    """
    Cleanup after deleting course.
    """

    if instance.thumbnail:
        instance.thumbnail.delete(
            save=False,
        )


# ==========================================================
# Section Signals
# ==========================================================


@receiver(post_save, sender=Section)
def section_post_save(
    sender,
    instance,
    created,
    **kwargs,
):
    """
    Hook after saving section.
    """

    if created:
        pass


# ==========================================================
# Lecture Signals
# ==========================================================


@receiver(post_save, sender=Lecture)
def lecture_post_save(
    sender,
    instance,
    created,
    **kwargs,
):
    """
    Hook after saving lecture.
    """

    if created:
        pass


# ==========================================================
# Resource Signals
# ==========================================================


@receiver(post_delete, sender=Resource)
def resource_post_delete(
    sender,
    instance,
    **kwargs,
):
    """
    Delete uploaded file after resource deletion.
    """

    if instance.file:
        instance.file.delete(
            save=False,
        )