from django.contrib import admin

from unfold.admin import ModelAdmin, StackedInline

from .forms import QuestionInlineForm, QuestionInlineFormSet
from .models import Answer, Attempt, Option, Question, Quiz


# ============================================================
# QUESTION INLINE
# ============================================================


class QuestionInline(StackedInline):
    model = Question

    form = QuestionInlineForm
    formset = QuestionInlineFormSet

    extra = 1
    min_num = 0

    # Allows deleting an existing question
    can_delete = True

    fields = (
        "text",
        "order",
        "points",
        "option_a",
        "option_b",
        "option_c",
        "option_d",
        "correct_option",
    )

    ordering = ("order",)

    verbose_name = "Question"
    verbose_name_plural = "Questions"


# ============================================================
# QUIZ ADMIN
# ============================================================


@admin.register(Quiz)
class QuizAdmin(ModelAdmin):

    class Media:
        css = {
            "all": (
                "quizzes/admin.css",
            ),
        }

    list_display = (
        "title",
        "course",
        "passing_score",
        "time_limit_minutes",
        "is_published",
        "created_at",
    )

    list_filter = (
        "is_published",
        "course",
    )

    search_fields = (
        "title",
        "description",
        "course__title",
    )

    autocomplete_fields = (
        "course",
    )

    readonly_fields = (
        "id",
        "created_at",
        "updated_at",
    )

    inlines = (
        QuestionInline,
    )

    fieldsets = (
        (
            "Quiz Information",
            {
                "fields": (
                    "course",
                    "title",
                    "description",
                ),
            },
        ),
        (
            "Assessment Settings",
            {
                "fields": (
                    "passing_score",
                    "time_limit_minutes",
                    "is_published",
                ),
            },
        ),
        (
            "System Information",
            {
                "classes": ("collapse",),
                "fields": (
                    "id",
                    "created_at",
                    "updated_at",
                ),
            },
        ),
    )


# ============================================================
# QUESTION ADMIN
# ============================================================


@admin.register(Question)
class QuestionAdmin(ModelAdmin):

    list_display = (
        "short_text",
        "quiz",
        "order",
        "points",
        "option_count",
        "correct_option",
    )

    list_filter = (
        "quiz",
    )

    search_fields = (
        "text",
        "quiz__title",
    )

    autocomplete_fields = (
        "quiz",
    )

    readonly_fields = (
        "id",
        "created_at",
        "updated_at",
    )

    @admin.display(description="Question")
    def short_text(self, obj):
        return obj.text[:80]

    @admin.display(description="Options")
    def option_count(self, obj):
        return obj.options.count()

    @admin.display(description="Correct Answer")
    def correct_option(self, obj):
        option = (
            obj.options
            .filter(is_correct=True)
            .first()
        )

        return option.text if option else "Not set"


# ============================================================
# OPTION ADMIN
# ============================================================


@admin.register(Option)
class OptionAdmin(ModelAdmin):

    list_display = (
        "text",
        "question",
        "is_correct",
    )

    list_filter = (
        "is_correct",
        "question__quiz",
    )

    search_fields = (
        "text",
        "question__text",
        "question__quiz__title",
    )

    autocomplete_fields = (
        "question",
    )


# ============================================================
# ATTEMPT ADMIN
# ============================================================


@admin.register(Attempt)
class AttemptAdmin(ModelAdmin):

    list_display = (
        "quiz",
        "student",
        "status",
        "score",
        "started_at",
        "submitted_at",
    )

    list_filter = (
        "status",
        "quiz",
    )

    search_fields = (
        "quiz__title",
        "student__email",
    )

    readonly_fields = (
        "id",
        "started_at",
        "submitted_at",
        "created_at",
        "updated_at",
    )

    autocomplete_fields = (
        "quiz",
        "student",
    )


# ============================================================
# ANSWER ADMIN
# ============================================================


@admin.register(Answer)
class AnswerAdmin(ModelAdmin):

    list_display = (
        "attempt",
        "question",
        "selected_option",
        "created_at",
    )

    search_fields = (
        "attempt__student__email",
        "question__text",
    )

    readonly_fields = (
        "id",
        "created_at",
        "updated_at",
    )

    autocomplete_fields = (
        "attempt",
        "question",
        "selected_option",
    )