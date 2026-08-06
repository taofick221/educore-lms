from django.urls import path

from .views import (
    CategoryListCreateAPIView,
    CategoryRetrieveUpdateDestroyAPIView,
    CourseListCreateAPIView,
    CourseRetrieveUpdateDestroyAPIView,
    LectureListCreateAPIView,
    LectureRetrieveUpdateDestroyAPIView,
    ResourceListCreateAPIView,
    ResourceRetrieveUpdateDestroyAPIView,
    SectionListCreateAPIView,
    SectionRetrieveUpdateDestroyAPIView,
)

app_name = "courses"

urlpatterns = [
    # ======================================================
    # Categories
    # ======================================================
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

    # ======================================================
    # Courses
    # ======================================================
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

    # ======================================================
    # Sections
    # ======================================================
    path(
        "sections/",
        SectionListCreateAPIView.as_view(),
        name="section-list",
    ),
    path(
        "sections/<slug:slug>/",
        SectionRetrieveUpdateDestroyAPIView.as_view(),
        name="section-detail",
    ),

    # ======================================================
    # Lectures
    # ======================================================
    path(
        "lectures/",
        LectureListCreateAPIView.as_view(),
        name="lecture-list",
    ),
    path(
        "lectures/<slug:slug>/",
        LectureRetrieveUpdateDestroyAPIView.as_view(),
        name="lecture-detail",
    ),

    # ======================================================
    # Resources
    # ======================================================
    path(
        "resources/",
        ResourceListCreateAPIView.as_view(),
        name="resource-list",
    ),
    path(
        "resources/<uuid:pk>/",
        ResourceRetrieveUpdateDestroyAPIView.as_view(),
        name="resource-detail",
    ),
]