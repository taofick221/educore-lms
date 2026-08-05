from django.contrib import admin

from .models import (
    Category,
    Course,
    CourseFeature,
    LearningOutcome,
    Requirement,
)


class CourseFeatureInline(admin.TabularInline):
    model = CourseFeature
    extra = 1


class LearningOutcomeInline(admin.TabularInline):
    model = LearningOutcome
    extra = 1


class RequirementInline(admin.TabularInline):
    model = Requirement
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "is_active",
        "created_at",
    )

    list_filter = (
        "is_active",
    )

    search_fields = (
        "name",
        "description",
    )

    prepopulated_fields = {
        "slug": (
            "name",
        ),
    }

    ordering = (
        "name",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )
@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
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
        "instructor__email",
        "category__name",
    )

    autocomplete_fields = (
        "category",
        "instructor",
    )

    prepopulated_fields = {
        "slug": (
            "title",
        ),
    }

    readonly_fields = (
        "created_at",
        "updated_at",
        "published_at",
    )

    ordering = (
        "-created_at",
    )

    inlines = [
        CourseFeatureInline,
        LearningOutcomeInline,
        RequirementInline,
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
                "classes": (
                    "collapse",
                ),
                "fields": (
                    "created_at",
                    "updated_at",
                ),
            },
        ),
    )