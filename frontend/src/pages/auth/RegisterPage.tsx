import { Link } from "react-router-dom";
import RegisterForm from "../../components/auth/RegisterForm";

function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Branding */}

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
                Start learning.
                <br />
                Build your future.
              </h1>

              <p className="mt-5 text-lg leading-8 text-indigo-100">
                Create your EduCore account and start building
                practical skills through structured learning.
              </p>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm leading-6 text-white">
                  Start your learning journey with structured
                  courses and practical knowledge.
                </p>
              </div>
            </div>

            <p className="text-sm text-indigo-200">
              © 2026 EduCore
            </p>
          </div>
        </div>

        {/* Register */}

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

            {/* Form Card */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  Create your account
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Join EduCore and start learning today.
                </p>
              </div>

              <div className="mt-7">
                <RegisterForm />
              </div>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200" />

                <span className="text-xs text-gray-400">
                  OR
                </span>

                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Sign in
                </Link>
              </p>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default RegisterPage;