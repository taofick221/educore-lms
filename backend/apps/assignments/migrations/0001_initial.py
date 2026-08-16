from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):
    initial = True
    dependencies = [
        ("accounts", "0001_initial"),
        ("courses", "0003_remove_resource_courses_res_lecture_3b6e05_idx_and_more"),
        ("enrollments", "0001_initial"),
    ]
    operations = [
        migrations.CreateModel(
            name="Assignment",
            fields=[
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("title", models.CharField(max_length=255)),
                ("description", models.TextField()),
                ("max_score", models.PositiveIntegerField(default=100)),
                ("due_at", models.DateTimeField(blank=True, null=True)),
                ("is_published", models.BooleanField(db_index=True, default=False)),
                ("course", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="assignments", to="courses.course")),
            ],
            options={"ordering": ["due_at", "created_at"]},
        ),
        migrations.CreateModel(
            name="Submission",
            fields=[
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("text", models.TextField(blank=True)),
                ("attachment", models.FileField(blank=True, upload_to="assignments/submissions/")),
                ("status", models.CharField(choices=[("submitted", "Submitted"), ("graded", "Graded"), ("returned", "Returned")], default="submitted", max_length=20)),
                ("score", models.PositiveIntegerField(blank=True, null=True)),
                ("feedback", models.TextField(blank=True)),
                ("graded_at", models.DateTimeField(blank=True, null=True)),
                ("assignment", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="submissions", to="assignments.assignment")),
                ("enrollment", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="assignment_submissions", to="enrollments.enrollment")),
                ("graded_by", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="graded_assignments", to=settings.AUTH_USER_MODEL)),
                ("student", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="assignment_submissions", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ["-created_at"]},
        ),
        migrations.AddIndex(model_name="assignment", index=models.Index(fields=["course", "is_published"], name="assignment_course_pub_idx")),
        migrations.AddIndex(model_name="submission", index=models.Index(fields=["assignment", "status"], name="submission_assignment_idx")),
        migrations.AddIndex(model_name="submission", index=models.Index(fields=["student", "status"], name="submission_student_idx")),
        migrations.AddConstraint(model_name="submission", constraint=models.UniqueConstraint(fields=("assignment", "student"), name="unique_assignment_submission_per_student")),
    ]
