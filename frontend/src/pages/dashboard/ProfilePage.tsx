import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function ProfilePage() {
  const { user } = useAuth();

  const firstName =
    user?.first_name || "";

  const lastName =
    user?.last_name || "";

  const fullName =
    `${firstName} ${lastName}`.trim() ||
    "EduCore User";

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`
      .toUpperCase() || "U";

  return (
    <section className="min-h-screen bg-gray-50">
      {/* ==================================================
          Header
      ================================================== */}

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-9">
          <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 sm:text-xs">
            Account
          </p>

          <h1 className="mt-1 text-xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Profile
          </h1>

          <p className="mt-1 max-w-xl text-xs leading-5 text-gray-500 sm:mt-1.5 sm:text-sm sm:leading-6">
            Manage your EduCore account information.
          </p>
        </div>
      </div>

      {/* ==================================================
          Content
      ================================================== */}

      <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-5">

          {/* ==================================================
              Profile Summary
          ================================================== */}

          <div className="h-fit rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5 lg:sticky lg:top-24">
            <div className="flex items-center gap-3 sm:gap-4 lg:flex-col lg:text-center">

              {/* Avatar */}

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-lg font-extrabold text-indigo-600 ring-4 ring-indigo-50 sm:h-16 sm:w-16 sm:text-xl lg:h-20 lg:w-20 lg:text-2xl">
                {initials}
              </div>

              <div className="min-w-0 flex-1 lg:w-full">
                <h2 className="truncate text-base font-extrabold text-gray-900 sm:text-lg lg:text-xl">
                  {fullName}
                </h2>

                <p className="mt-0.5 truncate text-xs text-gray-500 sm:text-sm">
                  {user?.email ||
                    "No email available"}
                </p>

                <span className="mt-1.5 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 sm:mt-2 sm:text-[11px]">
                  Active Account
                </span>
              </div>
            </div>

            {/* Account Status */}

            <div className="mt-4 hidden border-t border-gray-100 pt-3 lg:block">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">
                  Account status
                </span>

                <span className="font-semibold text-emerald-600">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* ==================================================
              Right Content
          ================================================== */}

          <div className="min-w-0 space-y-3 sm:space-y-4">

            {/* ==================================================
                Personal Information
            ================================================== */}

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:rounded-2xl">

              <div className="border-b border-gray-100 px-4 py-3.5 sm:px-5 sm:py-4">
                <h2 className="text-sm font-extrabold text-gray-900 sm:text-base lg:text-lg">
                  Personal Information
                </h2>

                <p className="mt-0.5 text-[11px] leading-5 text-gray-500 sm:text-xs sm:text-sm">
                  Your account information registered with EduCore.
                </p>
              </div>

              <div className="grid gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-5">

                {/* First Name */}

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 sm:text-[11px]">
                    First Name
                  </p>

                  <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 sm:mt-1.5 sm:rounded-xl sm:px-4">
                    <p className="truncate text-xs font-semibold text-gray-800 sm:text-sm">
                      {firstName ||
                        "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Last Name */}

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 sm:text-[11px]">
                    Last Name
                  </p>

                  <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 sm:mt-1.5 sm:rounded-xl sm:px-4">
                    <p className="truncate text-xs font-semibold text-gray-800 sm:text-sm">
                      {lastName ||
                        "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Email */}

                <div className="sm:col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 sm:text-[11px]">
                    Email Address
                  </p>

                  <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 sm:mt-1.5 sm:rounded-xl sm:px-4">
                    <p className="truncate text-xs font-semibold text-gray-800 sm:text-sm">
                      {user?.email ||
                        "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================================================
                Quick Access
            ================================================== */}

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 sm:text-xs">
                  Shortcuts
                </p>

                <h2 className="mt-0.5 text-sm font-extrabold text-gray-900 sm:text-base lg:text-lg">
                  Quick Access
                </h2>
              </div>

              <div className="mt-3 grid gap-2.5 sm:mt-4 sm:grid-cols-2 sm:gap-3">

                {/* My Courses */}

                <Link
                  to="/my-courses"
                  className="group flex items-center gap-2.5 rounded-lg border border-gray-200 p-3 transition duration-200 hover:border-indigo-200 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:gap-3 sm:rounded-xl sm:p-3.5"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-600 sm:h-10 sm:w-10 sm:text-sm">
                    📚
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 transition group-hover:text-indigo-600 sm:text-sm">
                      My Courses
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-gray-500 sm:text-xs">
                      Continue your learning.
                    </p>
                  </div>

                  <span className="ml-auto text-xs text-gray-300 transition group-hover:text-indigo-600 sm:text-sm">
                    →
                  </span>
                </Link>

                {/* Browse Courses */}

                <Link
                  to="/courses"
                  className="group flex items-center gap-2.5 rounded-lg border border-gray-200 p-3 transition duration-200 hover:border-indigo-200 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:gap-3 sm:rounded-xl sm:p-3.5"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-xs font-bold text-violet-600 sm:h-10 sm:w-10 sm:text-sm">
                    +
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 transition group-hover:text-indigo-600 sm:text-sm">
                      Browse Courses
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-gray-500 sm:text-xs">
                      Explore new courses.
                    </p>
                  </div>

                  <span className="ml-auto text-xs text-gray-300 transition group-hover:text-indigo-600 sm:text-sm">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;