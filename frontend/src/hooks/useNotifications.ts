import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../api/notifications";

import type { Notification } from "../types/notification";

export function useNotifications() {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = useCallback(
    async () => {
      try {
        setError("");

        const [
          notificationData,
          unreadCountData,
        ] = await Promise.all([
          getNotifications(),
          getUnreadNotificationCount(),
        ]);

        setNotifications(notificationData);
        setUnreadCount(unreadCountData);
      } catch {
        setError(
          "Unable to load notifications.",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadNotifications();

    const interval = window.setInterval(
      loadNotifications,
      30000,
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [loadNotifications]);

  const markAsRead = async (
    notificationId: string,
  ) => {
    const updated =
      await markNotificationAsRead(
        notificationId,
      );

    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? updated
          : notification,
      ),
    );

    setUnreadCount((count) =>
      updated.is_read
        ? Math.max(0, count - 1)
        : count,
    );
  };

  const markAllAsRead = async () => {
    await markAllNotificationsAsRead();

    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        is_read: true,
      })),
    );

    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refresh: loadNotifications,
    markAsRead,
    markAllAsRead,
  };
}