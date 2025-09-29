import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationCenter = ({ notifications, onMarkAsRead, onClearAll }) => {
  const [filter, setFilter] = useState('all');

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert':
        return { icon: 'AlertTriangle', color: 'text-error' };
      case 'warning':
        return { icon: 'AlertCircle', color: 'text-warning' };
      case 'info':
        return { icon: 'Info', color: 'text-primary' };
      case 'success':
        return { icon: 'CheckCircle', color: 'text-success' };
      default:
        return { icon: 'Bell', color: 'text-muted-foreground' };
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filteredNotifications = notifications?.filter(notification => {
    if (filter === 'unread') return !notification?.read;
    if (filter === 'alerts') return notification?.type === 'alert' || notification?.type === 'warning';
    return true;
  });

  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Bell" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-1 bg-error text-error-foreground text-xs rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        
        {notifications?.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            iconName="Trash2"
            iconSize={16}
          >
            Clear All
          </Button>
        )}
      </div>
      {/* Filter Tabs */}
      <div className="flex border-b border-border">
        {[
          { key: 'all', label: 'All', count: notifications?.length },
          { key: 'unread', label: 'Unread', count: unreadCount },
          { key: 'alerts', label: 'Alerts', count: notifications?.filter(n => n?.type === 'alert' || n?.type === 'warning')?.length }
        ]?.map((tab) => (
          <button
            key={tab?.key}
            onClick={() => setFilter(tab?.key)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              filter === tab?.key
                ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/30'
            }`}
          >
            {tab?.label}
            {tab?.count > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-muted text-muted-foreground text-xs rounded">
                {tab?.count}
              </span>
            )}
          </button>
        ))}
      </div>
      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredNotifications?.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredNotifications?.map((notification) => {
              const iconConfig = getNotificationIcon(notification?.type);
              
              return (
                <div
                  key={notification?.id}
                  className={`p-4 hover:bg-muted/30 transition-colors cursor-pointer ${
                    !notification?.read ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                  }`}
                  onClick={() => onMarkAsRead(notification?.id)}
                >
                  <div className="flex items-start space-x-3">
                    <Icon 
                      name={iconConfig?.icon} 
                      size={18} 
                      className={iconConfig?.color} 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p className={`text-sm ${!notification?.read ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                          {notification?.message}
                        </p>
                        <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                          {formatTimeAgo(notification?.timestamp)}
                        </span>
                      </div>
                      
                      {notification?.studentName && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Student: {notification?.studentName}
                        </p>
                      )}
                      
                      {notification?.action && (
                        <div className="mt-2">
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={(e) => {
                              e?.stopPropagation();
                              notification?.action?.handler();
                            }}
                            iconName={notification?.action?.icon}
                            iconPosition="left"
                            iconSize={14}
                          >
                            {notification?.action?.label}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Icon name="Bell" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">
              {filter === 'unread' ? 'No unread notifications' : 
               filter === 'alerts' ? 'No alerts' : 'No notifications'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              You're all caught up!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;