import Heading from '@/components/ui/heading';
import { useGetNotifications, useMarkAllAsRead, useMarkAsRead } from '@/hooks/notifications/use-notifications';
import { Notification } from '@/types/notification.types';
import { formatDistanceToNow } from 'date-fns';
import React, { useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [limit] = useState(50);
  const [offset] = useState(0);
  
  const { data, isLoading } = useGetNotifications(limit, offset);
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  const notifications = data?.notifications || [];
  const unreadCount = data?.unread_count || 0;

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.read_at) {
      markAsReadMutation.mutate(notification.id);
    }

    // Navigate to link if provided
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_assigned':
        return '📋';
      case 'task_completed':
        return '✅';
      case 'project_updated':
        return '📁';
      case 'invite_received':
        return '✉️';
      case 'invite_approved':
        return '👍';
      case 'invite_approval_required':
        return '⏳';
      default:
        return '🔔';
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Heading size="h3">Notifications</Heading>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            disabled={markAllAsReadMutation.isPending}
          >
            <FiCheckCircle className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="text-6xl mb-4">🔔</div>
            <Heading size="h3" className="mb-2">No notifications yet</Heading>
            <p>When you receive notifications, they'll appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification: Notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-5 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.read_at ? 'bg-blue-50/50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0">{getNotificationIcon(notification.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{notification.title}</p>
                          {!notification.read_at && (
                            <span className="px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-sm text-gray-400 mt-2">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
