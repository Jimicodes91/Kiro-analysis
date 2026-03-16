import { ApiResponse } from '@/types/api.types';
import { NotificationResponse, UnreadCountResponse } from '@/types/notification.types';
import { secureRequest } from './api.service';

const NOTIFICATION_BASE_URL = '/notifications';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const notificationService = {
  /**
   * Get user notifications with pagination
   */
  getUserNotifications: async (limit: number = 50, offset: number = 0): Promise<ApiResponse<NotificationResponse>> => {
    const response = await secureRequest({
      url: `${API_BASE_URL}${NOTIFICATION_BASE_URL}?limit=${limit}&offset=${offset}`,
      method: 'get',
    });
    return response.data;
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async (): Promise<ApiResponse<UnreadCountResponse>> => {
    const response = await secureRequest({
      url: `${API_BASE_URL}${NOTIFICATION_BASE_URL}/unread-count`,
      method: 'get',
    });
    return response.data;
  },

  /**
   * Mark a notification as read
   */
  markAsRead: async (notificationId: string): Promise<ApiResponse<void>> => {
    const response = await secureRequest({
      url: `${API_BASE_URL}${NOTIFICATION_BASE_URL}/${notificationId}/mark-read`,
      method: 'post',
      body: {},
    });
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<ApiResponse<void>> => {
    const response = await secureRequest({
      url: `${API_BASE_URL}${NOTIFICATION_BASE_URL}/mark-all-read`,
      method: 'post',
      body: {},
    });
    return response.data;
  },
};
