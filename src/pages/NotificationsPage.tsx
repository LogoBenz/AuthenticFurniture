import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Filter,
  Calendar,
  Trophy,
  Vote,
  Users,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { useClub } from '../contexts/ClubContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Notification, NotificationType } from '../types';
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';

type NotificationFilter = 'all' | 'unread' | 'club' | 'event' | 'election' | 'system';

const NOTIFICATION_FILTERS: { value: NotificationFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'club', label: 'Clubs' },
  { value: 'event', label: 'Events' },
  { value: 'election', label: 'Elections' },
  { value: 'system', label: 'System' },
];

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'club_joined':
    case 'club_left':
    case 'club_approved':
    case 'club_rejected':
      return <Trophy className="w-5 h-5" />;
    case 'event_created':
    case 'event_reminder':
    case 'event_cancelled':
      return <Calendar className="w-5 h-5" />;
    case 'election_started':
    case 'election_reminder':
      return <Vote className="w-5 h-5" />;
    case 'membership_approved':
    case 'membership_rejected':
      return <Users className="w-5 h-5" />;
    case 'system':
    case 'announcement':
      return <AlertCircle className="w-5 h-5" />;
    default:
      return <Bell className="w-5 h-5" />;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'club_joined':
    case 'club_approved':
    case 'membership_approved':
      return 'text-green-600 bg-green-100';
    case 'club_rejected':
    case 'membership_rejected':
    case 'event_cancelled':
      return 'text-red-600 bg-red-100';
    case 'election_started':
    case 'election_reminder':
      return 'text-purple-600 bg-purple-100';
    case 'event_created':
    case 'event_reminder':
      return 'text-blue-600 bg-blue-100';
    case 'system':
    case 'announcement':
      return 'text-orange-600 bg-orange-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const formatNotificationTime = (date: Date) => {
  if (isToday(date)) {
    return `Today at ${format(date, 'HH:mm')}`;
  }
  if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'HH:mm')}`;
  }
  return format(date, 'MMM dd, yyyy HH:mm');
};

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationAsRead } = useClub();
  const [selectedFilter, setSelectedFilter] = useState<NotificationFilter>('all');

  const filteredNotifications = notifications.filter(notification => {
    switch (selectedFilter) {
      case 'unread':
        return !notification.isRead;
      case 'club':
        return ['club_joined', 'club_left', 'club_approved', 'club_rejected', 'membership_approved', 'membership_rejected'].includes(notification.type);
      case 'event':
        return ['event_created', 'event_reminder', 'event_cancelled'].includes(notification.type);
      case 'election':
        return ['election_started', 'election_reminder'].includes(notification.type);
      case 'system':
        return ['system', 'announcement'].includes(notification.type);
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.isRead) {
        markNotificationAsRead(notification.id);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">
            Stay updated with your club activities and announcements
            {unreadCount > 0 && (
              <span className="ml-2">
                ({unreadCount} unread)
              </span>
            )}
          </p>
        </div>
        
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-wrap gap-2">
          {NOTIFICATION_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedFilter(filter.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === filter.value
                  ? 'bg-emu-100 text-emu-700 border border-emu-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
              {filter.value === 'unread' && unreadCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">🔔</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-600">
            {selectedFilter === 'unread' 
              ? "You're all caught up! No unread notifications."
              : "No notifications match your current filter."
            }
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification, index) => {
            const iconColor = getNotificationColor(notification.type);
            
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card 
                  className={`p-4 transition-all duration-200 ${
                    notification.isRead 
                      ? 'bg-white border-gray-200' 
                      : 'bg-emu-50 border-emu-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={`p-2 rounded-lg ${iconColor}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-sm font-medium ${
                            notification.isRead ? 'text-gray-900' : 'text-gray-900 font-semibold'
                          }`}>
                            {notification.title}
                          </h3>
                          <p className={`text-sm mt-1 ${
                            notification.isRead ? 'text-gray-600' : 'text-gray-700'
                          }`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatNotificationTime(notification.createdAt)}
                          </p>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          
                          {notification.actionUrl && (
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* Unread indicator */}
                      {!notification.isRead && (
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-emu-600 rounded-r-full" />
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};