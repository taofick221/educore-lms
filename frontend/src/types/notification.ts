export interface Notification {
  id: string;
  notification_type: string;
  title: string;
  message: string;
  is_read: boolean;
  read_at: string | null;
  content_type: number | null;
  object_id: string | null;
  created_at: string;
}

export interface UnreadCountResponse {
  count: number;
}

export interface MarkAllReadResponse {
  detail: string;
  updated_count: number;
}