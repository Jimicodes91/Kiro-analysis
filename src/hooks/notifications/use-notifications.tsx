import { notificationService } from '@/services/notification.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const NOTIFICATION_QUERY_KEYS = {
  notifications: ['notifications'],
  unreadCount: ['notifications', 'unread-count'],
};

/**
 * Hook to fetch user notifications
 */
export const useGetNotifications = (limit: number = 50, offset: number = 0) => {
  return useQuery({
    queryKey: [...NOTIFICATION_QUERY_KEYS.notifications, limit, offset],
    queryFn: async () => {
      const response = await notificationService.getUserNotifications(limit, offset);
      if (!response.status) {
        throw new Error(response.message || 'Failed to fetch notifications');
      }
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

/**
 * Hook to fetch unread notification count
 */
export const useGetUnreadCount = () => {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.unreadCount,
    queryFn: async () => {
      const response = await notificationService.getUnreadCount();
      if (!response.status) {
        throw new Error(response.message || 'Failed to fetch unread count');
      }
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

/**
 * Hook to mark a notification as read
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => notificationService.markAsRead(notificationId),
    onSuccess: () => {
      // Invalidate both notifications and unread count queries
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.notifications });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.unreadCount });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to mark notification as read');
    },
  });
};

/**
 * Hook to mark all notifications as read
 */
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      // Invalidate both notifications and unread count queries
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.notifications });
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.unreadCount });
      toast.success('All notifications marked as read');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to mark all notifications as read');
    },
  });
};
