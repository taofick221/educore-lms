import type { Section } from "../../types/course";

interface Props {
  sections: Section[];
  selectedLecture: string | null;
  completedLectures?: Set<string>;
  onSelect: (lectureId: string) => void;
}

function LessonList({
  sections,
  selectedLecture,
  completedLectures = new Set<string>(),
  onSelect,
}: Props) {
  return (
    <div className="divide-y divide-gray-100">
      {sections.map(
        (section, sectionIndex) => (
          <div key={section.id}>
            {/* ==================================================
                Section Header
            ================================================== */}

            <div className="bg-gray-50 px-3 py-3 sm:px-5 sm:py-4">
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-[10px] font-bold text-indigo-600 sm:h-8 sm:w-8 sm:text-xs">
                  {sectionIndex + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-bold text-gray-900 sm:text-sm">
                    {section.title}
                  </h3>

                  {section.description && (
                    <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-gray-500 sm:mt-1 sm:text-xs sm:leading-5">
                      {section.description}
                    </p>
                  )}

                  <p className="mt-0.5 text-[10px] text-gray-400 sm:mt-1 sm:text-xs">
                    {section.lectures?.length || 0}{" "}
                    {section.lectures?.length === 1
                      ? "lecture"
                      : "lectures"}
                  </p>
                </div>
              </div>
            </div>

            {/* ==================================================
                Lectures
            ================================================== */}

            <div className="py-0.5 sm:py-1">
              {section.lectures?.map(
                (lecture, lectureIndex) => {
                  const isSelected =
                    selectedLecture ===
                    lecture.id;

                  const isCompleted =
                    completedLectures.has(
                      lecture.id,
                    );

                  return (
                    <button
                      key={lecture.id}
                      type="button"
                      onClick={() =>
                        onSelect(lecture.id)
                      }
                      className={`group flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition sm:gap-3 sm:px-5 sm:py-3 ${
                        isSelected
                          ? "bg-indigo-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {/* ==================================================
                          Lecture Status
                      ================================================== */}

                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold sm:h-8 sm:w-8 sm:text-xs ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-600"
                            : isSelected
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-100 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                        }`}
                      >
                        {isCompleted
                          ? "✓"
                          : isSelected
                            ? "▶"
                            : lectureIndex + 1}
                      </div>

                      {/* ==================================================
                          Lecture Information
                      ================================================== */}

                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate text-xs sm:text-sm ${
                            isCompleted
                              ? "font-semibold text-emerald-700"
                              : isSelected
                                ? "font-bold text-indigo-700"
                                : "font-medium text-gray-700"
                          }`}
                        >
                          {lecture.title}
                        </p>

                        <div className="mt-0.5 flex min-w-0 items-center gap-1.5 sm:mt-1 sm:gap-2">
                          <span className="shrink-0 text-[10px] text-gray-400 sm:text-xs">
                            {lecture.duration} min
                          </span>

                          {lecture.is_preview && (
                            <span className="shrink-0 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[8px] font-bold text-emerald-600 sm:px-2 sm:text-[10px]">
                              Preview
                            </span>
                          )}

                          {isCompleted && (
                            <span className="truncate text-[9px] font-bold text-emerald-600 sm:text-[10px]">
                              Completed
                            </span>
                          )}
                        </div>
                      </div>

                      {/* ==================================================
                          Selected Indicator
                      ================================================== */}

                      {isSelected &&
                        !isCompleted && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600 sm:h-2 sm:w-2" />
                        )}
                    </button>
                  );
                },
              )}
            </div>
          </div>
        ),
      )}
    </div>
  );
}

export default LessonList;