export type NotificationType = 
  | 'task_assigned'
  | 'task_completed'
  | 'project_updated'
  | 'invite_received'
  | 'invite_approved'
  | 'invite_approval_required';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read_at?: string | null;
  created_at: string;
}

export interface NotificationResponse {
  notifications: Notification[];
  unread_count: number;
  total: number;
}

export interface UnreadCountResponse {
  count: number;
}
