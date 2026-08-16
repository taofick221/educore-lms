from django import forms
from django.core.exceptions import ValidationError
from django.forms.models import BaseInlineFormSet

from .models import Option, Question


class QuestionInlineForm(forms.ModelForm):

    option_a = forms.CharField(
        label="Option A",
        required=False,
        widget=forms.TextInput(
            attrs={
                "class": "quiz-option-input",
                "placeholder": "Enter option A",
            }
        ),
    )

    option_b = forms.CharField(
        label="Option B",
        required=False,
        widget=forms.TextInput(
            attrs={
                "class": "quiz-option-input",
                "placeholder": "Enter option B",
            }
        ),
    )

    option_c = forms.CharField(
        label="Option C",
        required=False,
        widget=forms.TextInput(
            attrs={
                "class": "quiz-option-input",
                "placeholder": "Enter option C",
            }
        ),
    )

    option_d = forms.CharField(
        label="Option D",
        required=False,
        widget=forms.TextInput(
            attrs={
                "class": "quiz-option-input",
                "placeholder": "Enter option D",
            }
        ),
    )

    correct_option = forms.ChoiceField(
        label="Correct Answer",
        choices=(
            ("A", "A"),
            ("B", "B"),
            ("C", "C"),
            ("D", "D"),
        ),
        required=False,
        widget=forms.RadioSelect(
            attrs={
                "class": "quiz-correct-radio",
            }
        ),
    )

    class Meta:
        model = Question

        fields = (
            "text",
            "order",
            "points",
        )

        widgets = {
            "text": forms.Textarea(
                attrs={
                    "class": "quiz-question-text",
                    "rows": 4,
                    "placeholder": "Enter the question...",
                }
            ),
            "order": forms.NumberInput(
                attrs={
                    "class": "quiz-number-input",
                    "min": 1,
                }
            ),
            "points": forms.NumberInput(
                attrs={
                    "class": "quiz-number-input",
                    "min": 1,
                }
            ),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # New question
        if not self.instance.pk:
            return

        options = list(
            self.instance.options.order_by("created_at")
        )

        option_fields = (
            "option_a",
            "option_b",
            "option_c",
            "option_d",
        )

        correct_answer = None

        for index, option in enumerate(options[:4]):

            field_name = option_fields[index]

            self.fields[field_name].initial = option.text

            if option.is_correct:
                correct_answer = chr(
                    ord("A") + index
                )

        self.fields["correct_option"].initial = correct_answer


class QuestionInlineFormSet(BaseInlineFormSet):

    def clean(self):
        super().clean()

        if any(self.errors):
            return

        for form in self.forms:

            # Deleted question
            if form.cleaned_data.get("DELETE"):
                continue

            # Completely empty extra row
            if not form.has_changed():
                continue

            cleaned_data = form.cleaned_data

            options = [
                cleaned_data.get("option_a", "").strip(),
                cleaned_data.get("option_b", "").strip(),
                cleaned_data.get("option_c", "").strip(),
                cleaned_data.get("option_d", "").strip(),
            ]

            filled_options = [
                option
                for option in options
                if option
            ]

            # At least 2 options
            if len(filled_options) < 2:
                raise ValidationError(
                    "Each question must have at least 2 options."
                )

            correct = cleaned_data.get("correct_option")

            # Must select correct answer
            if not correct:
                raise ValidationError(
                    "Please select the correct answer."
                )

            correct_index = (
                ord(correct) - ord("A")
            )

            # Correct option cannot be empty
            if not options[correct_index]:
                raise ValidationError(
                    "The selected correct answer cannot be empty."
                )

    def save_options(self, question, form):
        """
        Synchronize the four admin option fields
        with the actual Option database records.
        """

        option_values = [
            form.cleaned_data.get("option_a", "").strip(),
            form.cleaned_data.get("option_b", "").strip(),
            form.cleaned_data.get("option_c", "").strip(),
            form.cleaned_data.get("option_d", "").strip(),
        ]

        correct = form.cleaned_data.get(
            "correct_option"
        )

        # Remove empty options
        option_values = [
            value
            for value in option_values
            if value
        ]

        # Existing options
        existing_options = list(
            question.options.order_by("created_at")
        )

        # Update existing / create new
        for index, text in enumerate(option_values):

            is_correct = (
                correct
                == chr(ord("A") + index)
            )

            if index < len(existing_options):

                option = existing_options[index]

                option.text = text
                option.is_correct = is_correct

                option.save(
                    update_fields=[
                        "text",
                        "is_correct",
                    ]
                )

            else:

                Option.objects.create(
                    question=question,
                    text=text,
                    is_correct=is_correct,
                )

        # Delete extra old options
        if len(existing_options) > len(option_values):

            for option in existing_options[
                len(option_values):
            ]:
                option.delete()

    def save_existing(
        self,
        form,
        instance,
        commit=True,
    ):
        question = super().save_existing(
            form,
            instance,
            commit=commit,
        )

        if commit:
            self.save_options(
                question,
                form,
            )

        return question

    def save_new(
        self,
        form,
        commit=True,
    ):
        question = super().save_new(
            form,
            commit=commit,
        )

        if commit:
            self.save_options(
                question,
                form,
            )

        return question