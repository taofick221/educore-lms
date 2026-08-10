import { Link, useParams } from "react-router-dom";

import CourseDetails from "../../components/courses/CourseDetails";
import Spinner from "../../components/common/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useCourse } from "../../hooks/useCourses";

function CourseDetailsPage() {
  const { slug } = useParams();

  const {
    course,
    loading,
    error,
  } = useCourse(slug || "");

  // ==================================================
  // Loading
  // ==================================================

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-10">
        <Spinner />
      </section>
    );
  }

  // ==================================================
  // Error / Not Found
  // ==================================================

  if (error || !course) {
    return (
      <section className="min-h-[60vh] bg-gray-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto flex min-h-[50vh] max-w-lg items-center justify-center">
          <div className="w-full rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm sm:p-7">
            {/* Icon */}

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-lg font-bold text-red-600">
              !
            </div>

            {/* Error */}

            <div className="mt-4">
              <ErrorMessage
                message={
                  error ||
                  "Course not found."
                }
              />
            </div>

            {/* Back */}

            <Link
              to="/courses"
              className="mt-5 inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ==================================================
  // Course
  // ==================================================

  return <CourseDetails course={course} />;
}

export default CourseDetailsPage;