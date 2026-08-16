from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):
    initial = True
    dependencies = [
        ("accounts", "0001_initial"),
        ("courses", "0003_remove_resource_courses_res_lecture_3b6e05_idx_and_more"),
    ]
    operations = [
        migrations.CreateModel(
            name="Quiz",
            fields=[
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("title", models.CharField(max_length=255)),
                ("description", models.TextField(blank=True)),
                ("passing_score", models.PositiveSmallIntegerField(default=70)),
                ("time_limit_minutes", models.PositiveIntegerField(default=0)),
                ("is_published", models.BooleanField(db_index=True, default=False)),
                ("course", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="quizzes", to="courses.course")),
            ],
            options={"ordering": ["-created_at"]},
        ),
        migrations.CreateModel(
            name="Question",
            fields=[
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("text", models.TextField()),
                ("order", models.PositiveIntegerField(default=1)),
                ("points", models.PositiveIntegerField(default=1)),
                ("quiz", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="questions", to="quizzes.quiz")),
            ],
        ),
        migrations.CreateModel(
            name="Option",
            fields=[
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("text", models.CharField(max_length=500)),
                ("is_correct", models.BooleanField(default=False)),
                ("question", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="options", to="quizzes.question")),
            ],
        ),
        migrations.CreateModel(
            name="Attempt",
            fields=[
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("status", models.CharField(choices=[("in_progress", "In Progress"), ("submitted", "Submitted")], default="in_progress", max_length=20)),
                ("score", models.DecimalField(decimal_places=2, default=0, max_digits=5)),
                ("started_at", models.DateTimeField(auto_now_add=True)),
                ("submitted_at", models.DateTimeField(blank=True, null=True)),
                ("quiz", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="attempts", to="quizzes.quiz")),
                ("student", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="quiz_attempts", to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name="Answer",
            fields=[
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("attempt", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="answers", to="quizzes.attempt")),
                ("question", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="answers", to="quizzes.question")),
                ("selected_option", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="selected_answers", to="quizzes.option")),
            ],
        ),
        migrations.AddIndex(model_name="quiz", index=models.Index(fields=["course", "is_published"], name="quiz_course_pub_idx")),
        migrations.AddIndex(model_name="attempt", index=models.Index(fields=["student", "quiz", "status"], name="attempt_student_quiz_idx")),
        migrations.AddConstraint(model_name="question", constraint=models.UniqueConstraint(fields=("quiz", "order"), name="unique_quiz_question_order")),
        migrations.AddConstraint(model_name="answer", constraint=models.UniqueConstraint(fields=("attempt", "question"), name="unique_attempt_question_answer")),
    ]
