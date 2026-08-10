import { Link } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";

function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left branding */}

        <div className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-700 lg:flex">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-purple-400/20 blur-3xl" />

          <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">

            <Link
              to="/"
              className="text-2xl font-extrabold tracking-tight text-white"
            >
              Edu<span className="text-indigo-200">Core</span>
            </Link>

            <div className="max-w-lg">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-3xl font-extrabold text-white backdrop-blur">
                E
              </div>

              <h1 className="mt-8 text-4xl font-extrabold leading-tight text-white xl:text-5xl">
                Continue your
                <br />
                learning journey.
              </h1>

              <p className="mt-5 text-lg leading-8 text-indigo-100">
                Learn practical skills, follow structured courses,
                and track your progress with EduCore.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Structured courses and lectures",
                  "Track your learning progress",
                  "Learn at your own pace",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm font-medium text-white"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                      ✓
                    </span>

                    {item}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm text-indigo-200">
              © 2026 EduCore
            </p>
          </div>
        </div>

        {/* Login */}

        <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-12">
          <div className="w-full max-w-md">

            {/* Mobile logo */}

            <div className="mb-8 lg:hidden">
              <Link
                to="/"
                className="text-2xl font-extrabold tracking-tight text-gray-900"
              >
                Edu<span className="text-indigo-600">Core</span>
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Sign in to continue learning.
                </p>
              </div>

              <div className="mt-7">
                <LoginForm />
              </div>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200" />

                <span className="text-xs text-gray-400">
                  OR
                </span>

                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <p className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Create an account
                </Link>
              </p>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;