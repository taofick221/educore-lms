import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* ==================================================
            Main Footer
        ================================================== */}

        <div className="grid gap-6 sm:grid-cols-3 sm:gap-8 lg:grid-cols-4 lg:gap-10">
          {/* ==================================================
              Brand
          ================================================== */}

          <div className="sm:col-span-2 lg:col-span-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 sm:gap-2"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-extrabold text-white sm:h-9 sm:w-9 sm:rounded-xl sm:text-sm">
                E
              </span>

              <span className="text-lg font-extrabold tracking-tight text-gray-900 sm:text-xl">
                Edu
                <span className="text-indigo-600">
                  Core
                </span>
              </span>
            </Link>

            <p className="mt-2 max-w-md text-xs leading-5 text-gray-500 sm:mt-3 sm:text-sm sm:leading-6">
              Learn practical skills through structured
              courses, expert content, and progress-based
              learning.
            </p>
          </div>

          {/* ==================================================
              Explore
          ================================================== */}

          <div>
            <h3 className="text-xs font-bold text-gray-900 sm:text-sm">
              Explore
            </h3>

            <div className="mt-2.5 space-y-2 sm:mt-3 sm:space-y-2.5">
              <Link
                to="/courses"
                className="block text-xs text-gray-500 transition hover:text-indigo-600 sm:text-sm"
              >
                Courses
              </Link>

              <Link
                to="/"
                className="block text-xs text-gray-500 transition hover:text-indigo-600 sm:text-sm"
              >
                Home
              </Link>
            </div>
          </div>

          {/* ==================================================
              Account
          ================================================== */}

          <div>
            <h3 className="text-xs font-bold text-gray-900 sm:text-sm">
              Account
            </h3>

            <div className="mt-2.5 space-y-2 sm:mt-3 sm:space-y-2.5">
              <Link
                to="/login"
                className="block text-xs text-gray-500 transition hover:text-indigo-600 sm:text-sm"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="block text-xs text-gray-500 transition hover:text-indigo-600 sm:text-sm"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>

        {/* ==================================================
            Bottom
        ================================================== */}

        <div className="mt-6 flex flex-col gap-1.5 border-t border-gray-100 pt-4 sm:mt-7 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-5">
          <p className="text-[10px] text-gray-500 sm:text-xs sm:text-sm">
            © {new Date().getFullYear()} EduCore. All
            rights reserved.
          </p>

          <p className="text-[10px] text-gray-400 sm:text-xs">
            Learn. Grow. Succeed.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;