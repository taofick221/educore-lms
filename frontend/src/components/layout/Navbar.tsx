import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Navbar() {
  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  const handleNavigation = () => {
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({
    isActive,
  }: {
    isActive: boolean;
  }) =>
    `relative text-xs font-semibold transition sm:text-sm ${
      isActive
        ? "text-indigo-600"
        : "text-gray-600 hover:text-indigo-600"
    }`;

  const mobileNavLinkClass = ({
    isActive,
  }: {
    isActive: boolean;
  }) =>
    `block rounded-lg px-3 py-2 text-xs font-semibold transition sm:rounded-xl sm:py-2.5 sm:text-sm ${
      isActive
        ? "bg-indigo-50 text-indigo-700"
        : "text-gray-700 hover:bg-gray-50"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* ==================================================
            Main Header
        ================================================== */}

        <div className="flex h-14 items-center justify-between sm:h-16">
          {/* ==================================================
              Logo
          ================================================== */}

          <Link
            to="/"
            onClick={handleNavigation}
            className="flex shrink-0 items-center gap-1.5 sm:gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-extrabold text-white shadow-sm sm:h-10 sm:w-10 sm:rounded-xl sm:text-sm">
              E
            </div>

            <span className="text-base font-extrabold tracking-tight text-gray-900 sm:text-xl">
              Edu
              <span className="text-indigo-600">
                Core
              </span>
            </span>
          </Link>

          {/* ==================================================
              Desktop Navigation
          ================================================== */}

          <div className="hidden items-center gap-4 md:flex lg:gap-6">
            <NavLink
              to="/courses"
              className={navLinkClass}
            >
              Courses
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={navLinkClass}
                >
                  Dashboard
                </NavLink>

                {/* User */}

                <div className="flex items-center gap-2 border-l border-gray-200 pl-4 lg:pl-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600 sm:h-9 sm:w-9 sm:text-sm">
                    {user?.first_name
                      ?.charAt(0)
                      .toUpperCase() ||
                      "U"}
                  </div>

                  <div className="hidden min-w-0 lg:block">
                    <p className="text-[10px] leading-4 text-gray-400">
                      Welcome
                    </p>

                    <p className="max-w-24 truncate text-xs font-bold text-gray-800 sm:text-sm">
                      {user?.first_name ||
                        "User"}
                    </p>
                  </div>
                </div>

                {/* Logout */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:rounded-xl sm:px-3.5 sm:py-2 sm:text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={navLinkClass}
                >
                  Login
                </NavLink>

                <Link
                  to="/register"
                  className="rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 hover:shadow-md sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* ==================================================
              Mobile Menu Button
          ================================================== */}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                (previous) => !previous,
              )
            }
            aria-label={
              mobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileMenuOpen}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:h-10 sm:w-10 sm:rounded-xl md:hidden"
          >
            {mobileMenuOpen ? (
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            ) : (
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* ==================================================
            Mobile Navigation
        ================================================== */}

        {mobileMenuOpen && (
          <div className="border-t border-gray-100 py-2.5 sm:py-3 md:hidden">
            <div className="space-y-0.5 sm:space-y-1">
              <NavLink
                to="/courses"
                onClick={handleNavigation}
                className={mobileNavLinkClass}
              >
                Courses
              </NavLink>

              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/dashboard"
                    onClick={handleNavigation}
                    className={
                      mobileNavLinkClass
                    }
                  >
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/my-courses"
                    onClick={handleNavigation}
                    className={
                      mobileNavLinkClass
                    }
                  >
                    My Courses
                  </NavLink>

                  <NavLink
                    to="/profile"
                    onClick={handleNavigation}
                    className={
                      mobileNavLinkClass
                    }
                  >
                    Profile
                  </NavLink>

                  {/* Mobile User */}

                  <div className="mt-2 border-t border-gray-100 pt-2.5 sm:mt-3 sm:pt-3">
                    <div className="mb-2.5 flex items-center gap-2.5 px-3 sm:mb-3 sm:gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600 sm:h-9 sm:w-9 sm:text-sm">
                        {user?.first_name
                          ?.charAt(0)
                          .toUpperCase() ||
                          "U"}
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 sm:text-[11px]">
                          Welcome
                        </p>

                        <p className="truncate text-xs font-bold text-gray-800 sm:text-sm">
                          {user?.first_name ||
                            "User"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:rounded-xl sm:py-2.5 sm:text-sm"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    onClick={handleNavigation}
                    className={
                      mobileNavLinkClass
                    }
                  >
                    Login
                  </NavLink>

                  <Link
                    to="/register"
                    onClick={handleNavigation}
                    className="mt-1.5 block rounded-lg bg-indigo-600 px-3 py-2 text-center text-xs font-bold text-white transition hover:bg-indigo-700 sm:mt-2 sm:rounded-xl sm:py-2.5 sm:text-sm"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;