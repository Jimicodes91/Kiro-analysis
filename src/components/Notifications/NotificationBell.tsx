import { useGetUnreadCount } from '@/hooks/notifications/use-notifications';
import React, { useEffect, useRef, useState } from 'react';
import { VscBell } from 'react-icons/vsc';
import NotificationDropdown from './NotificationDropdown';

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: unreadData } = useGetUnreadCount();
  const unreadCount = unreadData?.count || 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="mr-5 cursor-pointer relative border-2 border-brand-border p-2 rounded-full hover:bg-gray-50 transition-colors"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <VscBell className="text-[#111] w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-5 h-5 flex justify-center items-center text-xs font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && <NotificationDropdown onClose={() => setIsOpen(false)} />}
    </div>
  );
};

export default NotificationBell;
