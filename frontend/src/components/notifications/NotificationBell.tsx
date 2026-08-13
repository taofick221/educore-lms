import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useNotifications } from "../../hooks/useNotifications";

function NotificationBell() {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
  } = useNotifications();

  const [open, setOpen] = useState(false);

  const containerRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent,
    ) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  const recentNotifications =
    notifications.slice(0, 5);

  const handleNotificationClick = async (
    notificationId: string,
    isRead: boolean,
  ) => {
    if (!isRead) {
      await markAsRead(notificationId);
    }

    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <svg
          className="h-5 w-5"
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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 20h4"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-w-4.5 h-4.5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[9px] font-extrabold text-white ring-2 ring-white">
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-[60] w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-900/10">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">
                Notifications
              </h3>

              <p className="mt-0.5 text-[11px] text-gray-500">
                {unreadCount} unread
              </p>
            </div>

            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3 p-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse space-y-2"
                >
                  <div className="h-3 w-28 rounded bg-gray-200" />
                  <div className="h-3 w-full rounded bg-gray-100" />
                  <div className="h-2.5 w-20 rounded bg-gray-100" />
                </div>
              ))}
            </div>
          ) : recentNotifications.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <svg
                  className="h-5 w-5"
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

              <p className="mt-3 text-sm font-bold text-gray-900">
                You're all caught up
              </p>

              <p className="mt-1 text-xs text-gray-500">
                New updates will appear here.
              </p>
            </div>
          ) : (
            <div className="max-h-[360px] overflow-y-auto">
              {recentNotifications.map(
                (notification) => (
                  <Link
                    key={notification.id}
                    to="/notifications"
                    onClick={() =>
                      handleNotificationClick(
                        notification.id,
                        notification.is_read,
                      )
                    }
                    className={`block border-b border-gray-50 px-4 py-3.5 transition hover:bg-gray-50 ${
                      !notification.is_read
                        ? "bg-indigo-50/40"
                        : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <span
                        className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                          notification.is_read
                            ? "bg-gray-200"
                            : "bg-indigo-600"
                        }`}
                      />

                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900">
                          {notification.title}
                        </p>

                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
                          {notification.message}
                        </p>

                        <p className="mt-1.5 text-[10px] font-medium text-gray-400">
                          {new Date(
                            notification.created_at,
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ),
              )}
            </div>
          )}

          <div className="border-t border-gray-100 bg-gray-50 px-4 py-2.5">
            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="block text-center text-xs font-bold text-gray-600 transition hover:text-indigo-600"
            >
              Open notification center
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;