from django.urls import path

from .views import (
    CategoryListCreateAPIView,
    CategoryRetrieveUpdateDestroyAPIView,
    CourseListCreateAPIView,
    CourseRetrieveUpdateDestroyAPIView,
)

app_name = "courses"

urlpatterns = [
    path(
        "categories/",
        CategoryListCreateAPIView.as_view(),
        name="category-list",
    ),
    path(
        "categories/<slug:slug>/",
        CategoryRetrieveUpdateDestroyAPIView.as_view(),
        name="category-detail",
    ),
    path(
        "",
        CourseListCreateAPIView.as_view(),
        name="course-list",
    ),
    path(
        "<slug:slug>/",
        CourseRetrieveUpdateDestroyAPIView.as_view(),
        name="course-detail",
    ),
]