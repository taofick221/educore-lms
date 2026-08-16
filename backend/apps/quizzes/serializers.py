from rest_framework import serializers

from .models import Answer, Attempt, Option, Question, Quiz


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ("id", "text")
        read_only_fields = fields


class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ("id", "text", "order", "points", "options")
        read_only_fields = fields


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ("id", "course", "title", "description", "passing_score", "time_limit_minutes", "questions")
        read_only_fields = fields


class AttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attempt
        fields = ("id", "quiz", "status", "score", "started_at", "submitted_at")
        read_only_fields = fields


class SubmitAnswerSerializer(serializers.Serializer):
    question = serializers.PrimaryKeyRelatedField(queryset=Question.objects.all())
    selected_option = serializers.PrimaryKeyRelatedField(queryset=Option.objects.all())


class SubmitAttemptSerializer(serializers.Serializer):
    answers = SubmitAnswerSerializer(many=True)
