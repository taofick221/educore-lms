import CourseCard from "./CourseCard";
import type { Course } from "../../types/course";

interface Props {
  courses: Course[];
}

function CourseGrid({ courses }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
        />
      ))}
    </div>
  );
}

export default CourseGrid;