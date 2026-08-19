from django.http import HttpRequest


def dashboard_callback(request: HttpRequest, context: dict):
    return context
