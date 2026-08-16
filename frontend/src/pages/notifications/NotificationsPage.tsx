import { useMemo, useState } from "react";

import { useNotifications } from "../../hooks/useNotifications";

function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const [filter, setFilter] = useState<
    "all" | "unread"
  >("all");

  const visibleNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter(
        (notification) =>
          !notification.is_read,
      );
    }

    return notifications;
  }, [filter, notifications]);

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-7 sm:px-6 sm:py-9">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Updates
              </p>

              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                Notifications
              </h1>

              <p className="mt-1.5 text-sm text-gray-500">
                Stay updated with your EduCore activity.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="shrink-0 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 sm:px-4 sm:text-sm"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6 sm:py-7">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition sm:px-4 ${
                filter === "all"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              All
            </button>

            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition sm:px-4 ${
                filter === "unread"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span className="ml-1.5">
                  ({unreadCount})
                </span>
              )}
            </button>
          </div>

          <p className="text-xs text-gray-400">
            {visibleNotifications.length}{" "}
            {visibleNotifications.length === 1
              ? "notification"
              : "notifications"}
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4 sm:p-5"
              >
                <div className="h-3 w-32 rounded bg-gray-200" />
                <div className="mt-3 h-3 w-full rounded bg-gray-100" />
                <div className="mt-2 h-3 w-2/3 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
            <p className="text-sm font-bold text-red-700">
              Unable to load notifications
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Please try again later.
            </p>
          </div>
        ) : visibleNotifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17H9m10-2.5c0 1.38-1.12 2.5-2.5 2.5h-9A2.5 2.5 0 015 14.5c0-.88.23-1.74.67-2.5L7 9.7V8a5 5 0 0110 0v1.7l1.33 2.3c.44.76.67 1.62.67 2.5z"
                />
              </svg>
            </div>

            <h2 className="mt-4 text-base font-extrabold text-gray-900">
              No notifications
            </h2>

            <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-gray-500 sm:text-sm">
              {filter === "unread"
                ? "You have no unread notifications."
                : "You'll see important account, course and order updates here."}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {visibleNotifications.map(
              (notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() =>
                    !notification.is_read &&
                    markAsRead(notification.id)
                  }
                  className={`flex w-full gap-3 border-b border-gray-100 p-4 text-left transition last:border-b-0 hover:bg-gray-50 sm:gap-4 sm:p-5 ${
                    !notification.is_read
                      ? "bg-indigo-50/30"
                      : "bg-white"
                  }`}
                >
                  <div
                    className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                      notification.is_read
                        ? "bg-gray-200"
                        : "bg-indigo-600"
                    }`}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <h2
                        className={`text-sm ${
                          notification.is_read
                            ? "font-semibold text-gray-800"
                            : "font-extrabold text-gray-900"
                        }`}
                      >
                        {notification.title}
                      </h2>

                      <span className="shrink-0 text-[10px] font-medium text-gray-400">
                        {new Date(
                          notification.created_at,
                        ).toLocaleString()}
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs leading-5 text-gray-500 sm:text-sm sm:leading-6">
                      {notification.message}
                    </p>

                    {!notification.is_read && (
                      <span className="mt-2 inline-block text-[10px] font-bold text-indigo-600">
                        Mark as read
                      </span>
                    )}
                  </div>
                </button>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default NotificationsPage;