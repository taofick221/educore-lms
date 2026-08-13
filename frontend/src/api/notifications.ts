import apiClient from "./client";

import type {
  MarkAllReadResponse,
  Notification,
  UnreadCountResponse,
} from "../types/notification";

export const getNotifications = async (
  isRead?: boolean,
): Promise<Notification[]> => {
  const response = await apiClient.get<Notification[]>(
    "/notifications/",
    {
      params:
        isRead === undefined
          ? undefined
          : {
              is_read: isRead,
            },
    },
  );

  return response.data;
};

export const getUnreadNotifications =
  async (): Promise<Notification[]> => {
    const response =
      await apiClient.get<Notification[]>(
        "/notifications/unread/",
      );

    return response.data;
  };

export const getUnreadNotificationCount =
  async (): Promise<number> => {
    const response =
      await apiClient.get<UnreadCountResponse>(
        "/notifications/unread-count/",
      );

    return response.data.count;
  };

export const markNotificationAsRead =
  async (
    notificationId: string,
  ): Promise<Notification> => {
    const response =
      await apiClient.post<Notification>(
        `/notifications/${notificationId}/mark-read/`,
      );

    return response.data;
  };

export const markAllNotificationsAsRead =
  async (): Promise<MarkAllReadResponse> => {
    const response =
      await apiClient.post<MarkAllReadResponse>(
        "/notifications/mark-all-read/",
      );

    return response.data;
  };