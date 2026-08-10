import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function ProtectedRoute() {
  const {
    isAuthenticated,
    loading,
  } = useAuth();

  // ==================================================
  // Authentication Loading
  // ==================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4">
        <div className="flex flex-col items-center">
          {/* Spinner */}

          <div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600 sm:h-8 sm:w-8" />

          <p className="mt-2 text-xs font-medium text-gray-500 sm:text-sm">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // ==================================================
  // Not Authenticated
  // ==================================================

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ==================================================
  // Protected Content
  // ==================================================

  return <Outlet />;
}

export default ProtectedRoute;