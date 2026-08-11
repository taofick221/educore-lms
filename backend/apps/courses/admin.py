from django.contrib import admin

from unfold.admin import ModelAdmin, TabularInline

from .models import (
    Category,
    Course,
    CourseFeature,
    LearningOutcome,
    Lecture,
    Requirement,
    Resource,
    Section,
)


# ==========================================================
# Inlines
# ==========================================================


class CourseFeatureInline(TabularInline):
    model = CourseFeature
    extra = 0
    fields = ("title",)


class LearningOutcomeInline(TabularInline):
    model = LearningOutcome
    extra = 0
    fields = ("title",)


class RequirementInline(TabularInline):
    model = Requirement
    extra = 0
    fields = ("title",)


class SectionInline(TabularInline):
    model = Section
    extra = 0

    fields = (
        "title",
        "slug",
        "order",
        "is_published",
        "is_active",
    )

    prepopulated_fields = {
        "slug": ("title",),
    }


# ==========================================================
# Category Admin
# ==========================================================


@admin.register(Category)
class CategoryAdmin(ModelAdmin):
    list_display = (
        "name",
        "is_active",
        "created_at",
    )

    list_filter = (
        "is_active",
        "created_at",
    )

    search_fields = (
        "name",
        "description",
    )

    prepopulated_fields = {
        "slug": ("name",),
    }

    ordering = ("name",)

    readonly_fields = (
        "created_at",
        "updated_at",
    )


# ==========================================================
# Course Admin
# ==========================================================


@admin.register(Course)
class CourseAdmin(ModelAdmin):
    list_display = (
        "title",
        "category",
        "instructor",
        "level",
        "language",
        "price",
        "status",
        "is_featured",
        "is_published",
        "is_active",
        "created_at",
    )

    list_filter = (
        "status",
        "level",
        "language",
        "is_featured",
        "is_published",
        "is_active",
        "category",
        "created_at",
    )

    search_fields = (
        "title",
        "subtitle",
        "description",
        "category__name",
        "instructor__email",
        "instructor__first_name",
        "instructor__last_name",
    )

    autocomplete_fields = (
        "category",
        "instructor",
    )

    prepopulated_fields = {
        "slug": ("title",),
    }

    readonly_fields = (
        "created_at",
        "updated_at",
        "published_at",
    )

    ordering = ("-created_at",)

    list_per_page = 25

    inlines = [
        CourseFeatureInline,
        LearningOutcomeInline,
        RequirementInline,
        SectionInline,
    ]

    fieldsets = (
        (
            "Basic Information",
            {
                "fields": (
                    "title",
                    "slug",
                    "subtitle",
                    "short_description",
                    "description",
                ),
            },
        ),
        (
            "Media",
            {
                "fields": (
                    "thumbnail",
                    "intro_video",
                ),
            },
        ),
        (
            "Course Details",
            {
                "fields": (
                    "category",
                    "instructor",
                    "level",
                    "language",
                    "duration",
                ),
            },
        ),
        (
            "Pricing",
            {
                "fields": (
                    "price",
                    "discount_price",
                ),
            },
        ),
        (
            "Publishing",
            {
                "fields": (
                    "status",
                    "is_featured",
                    "is_published",
                    "is_active",
                    "published_at",
                ),
            },
        ),
        (
            "SEO",
            {
                "fields": (
                    "meta_title",
                    "meta_description",
                ),
            },
        ),
        (
            "System Information",
            {
                "classes": ("collapse",),
                "fields": (
                    "created_at",
                    "updated_at",
                ),
            },
        ),
    )


# ==========================================================
# Section Admin
# ==========================================================


@admin.register(Section)
class SectionAdmin(ModelAdmin):
    list_display = (
        "title",
        "course",
        "order",
        "is_published",
        "is_active",
        "created_at",
    )

    list_filter = (
        "is_published",
        "is_active",
        "created_at",
    )

    search_fields = (
        "title",
        "description",
        "course__title",
    )

    autocomplete_fields = (
        "course",
    )

    prepopulated_fields = {
        "slug": ("title",),
    }

    ordering = (
        "course",
        "order",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    list_per_page = 25


# ==========================================================
# Lecture Admin
# ==========================================================


@admin.register(Lecture)
class LectureAdmin(ModelAdmin):
    list_display = (
        "title",
        "section",
        "duration",
        "order",
        "is_preview",
        "is_published",
        "is_active",
    )

    list_filter = (
        "is_preview",
        "is_published",
        "is_active",
    )

    search_fields = (
        "title",
        "description",
        "section__title",
        "section__course__title",
    )

    autocomplete_fields = (
        "section",
    )

    prepopulated_fields = {
        "slug": ("title",),
    }

    ordering = (
        "section",
        "order",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    list_per_page = 25


# ==========================================================
# Resource Admin
# ==========================================================


@admin.register(Resource)
class ResourceAdmin(ModelAdmin):
    list_display = (
        "title",
        "lecture",
        "resource_type",
        "order",
        "created_at",
    )

    list_filter = (
        "resource_type",
        "created_at",
    )

    search_fields = (
        "title",
        "lecture__title",
        "lecture__section__title",
        "lecture__section__course__title",
    )

    autocomplete_fields = (
        "lecture",
    )

    ordering = (
        "lecture",
        "order",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    list_per_page = 25


# ==========================================================
# Course Feature Admin
# ==========================================================


@admin.register(CourseFeature)
class CourseFeatureAdmin(ModelAdmin):
    list_display = (
        "title",
        "course",
        "created_at",
    )

    search_fields = (
        "title",
        "course__title",
    )

    autocomplete_fields = (
        "course",
    )

    ordering = (
        "course",
        "id",
    )


# ==========================================================
# Requirement Admin
# ==========================================================


@admin.register(Requirement)
class RequirementAdmin(ModelAdmin):
    list_display = (
        "title",
        "course",
        "created_at",
    )

    search_fields = (
        "title",
        "course__title",
    )

    autocomplete_fields = (
        "course",
    )

    ordering = (
        "course",
        "id",
    )


# ==========================================================
# Learning Outcome Admin
# ==========================================================


@admin.register(LearningOutcome)
class LearningOutcomeAdmin(ModelAdmin):
    list_display = (
        "title",
        "course",
        "created_at",
    )

    search_fields = (
        "title",
        "course__title",
    )

    autocomplete_fields = (
        "course",
    )

    ordering = (
        "course",
        "id",
    )