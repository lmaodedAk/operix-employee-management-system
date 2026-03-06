import React, { useState } from 'react';
import { Bell, Check, Trash2, Calendar, FileText, Users, AlertCircle, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

const NotificationItem = ({ notification, onRead }) => {
    const iconMap = {
        alert: AlertCircle,
        people: Users,
        documents: FileText,
        calendar: Calendar,
        default: Bell
    };
    const Icon = iconMap[notification.iconType] || iconMap.default;

    return (
        <div className={cn(
            "p-4 rounded-xl border flex gap-4 transition-all animate-in fade-in duration-300",
            notification.unread
                ? "bg-surface border-border hover:border-primary/50 relative overflow-hidden"
                : "bg-surface/50 border-transparent opacity-80"
        )}>
            {notification.unread && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
            )}

            <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                notification.unread ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>
                <Icon className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <h3 className={cn("font-medium text-sm", notification.unread ? "text-foreground" : "text-muted-foreground")}>
                        {notification.title}
                    </h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {notification.timestamp}
                    </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {notification.description}
                </p>
                {notification.unread && (
                    <button
                        onClick={() => onRead(notification.id)}
                        className="text-xs text-primary font-medium mt-2 hover:underline flex items-center gap-1"
                    >
                        <Check className="w-3 h-3" /> Mark as read
                    </button>
                )}
            </div>
        </div>
    );
};

const FilterTab = ({ label, count, active, onClick }) => (
    <button
        onClick={onClick}
        className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors border flex items-center gap-2",
            active
                ? "bg-foreground text-background border-foreground"
                : "bg-surface border-border text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
    >
        {label}
        {count > 0 && (
            <span className={cn(
                "px-1.5 py-0.5 rounded-full text-[10px]",
                active ? "bg-background text-foreground" : "bg-muted-foreground/20 text-foreground"
            )}>
                {count}
            </span>
        )}
    </button>
);

const Notifications = () => {
    const { notifications, markNotificationRead, markAllNotificationsRead, clearNotifications } = useApp();
    const [filter, setFilter] = useState('All');

    const filters = [
        { id: 'All', label: 'All' },
        { id: 'Unread', label: 'Unread' },
        { id: 'Alerts', label: 'Alerts', type: 'alert' },
        { id: 'People', label: 'People', type: 'people' },
        { id: 'Documents', label: 'Documents', type: 'documents' },
        { id: 'Calendar', label: 'Calendar', type: 'calendar' },
    ];

    const getFilteredNotifications = () => {
        if (filter === 'All') return notifications;
        if (filter === 'Unread') return notifications.filter(n => n.unread);
        const activeFilter = filters.find(f => f.id === filter);
        return notifications.filter(n => n.iconType === activeFilter.type);
    };

    const filteredData = getFilteredNotifications();
    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-1">Notifications</h1>
                    <p className="text-muted-foreground">Stay updated with the latest activities</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={markAllNotificationsRead}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-surface hover:bg-muted border border-border rounded-lg transition-colors text-foreground"
                    >
                        <Check className="w-4 h-4" />
                        Mark all read
                    </button>
                    <button
                        onClick={clearNotifications}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-destructive/10 text-destructive border border-transparent hover:border-destructive/20 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Clear all
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 pb-2">
                {filters.map(f => (
                    <FilterTab
                        key={f.id}
                        label={f.label}
                        count={f.id === 'All' ? 0 : f.id === 'Unread' ? unreadCount : 0} // Only show unread count for simplicity
                        active={filter === f.id}
                        onClick={() => setFilter(f.id)}
                    />
                ))}
            </div>

            <div className="space-y-3">
                {filteredData.length > 0 ? (
                    filteredData.map(notif => (
                        <NotificationItem
                            key={notif.id}
                            notification={notif}
                            onRead={markNotificationRead}
                        />
                    ))
                ) : (
                    <div className="text-center py-20 bg-surface border border-border rounded-xl border-dashed">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">No notifications found</h3>
                        <p className="text-muted-foreground mt-1">We'll notify you when something arrives.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
