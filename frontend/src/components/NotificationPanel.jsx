import React, { useRef, useEffect } from 'react';
import { X, Bell, CheckCircle, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

const NotificationPanel = ({ isOpen, onClose }) => {
    const { notifications, markNotificationRead } = useApp();
    const panelRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                ref={panelRef}
                className="w-full max-w-md bg-surface border-l border-border h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col"
            >
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-primary" />
                        <h2 className="font-semibold text-foreground">Notifications</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-muted rounded-full transition-colors">
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <Bell className="w-12 h-12 mb-2 opacity-20" />
                            <p>No notifications yet</p>
                        </div>
                    ) : (
                        notifications.slice(0, 10).map((notif) => (
                            <div
                                key={notif.id}
                                onClick={() => markNotificationRead(notif.id)}
                                className={cn(
                                    "p-3 rounded-xl border transition-all cursor-pointer hover:bg-muted/50",
                                    notif.unread
                                        ? "bg-primary/5 border-primary/20"
                                        : "bg-surface border-border"
                                )}
                            >
                                <div className="flex gap-3">
                                    <div className={cn(
                                        "w-2 h-2 mt-2 rounded-full shrink-0",
                                        notif.unread ? "bg-primary" : "bg-transparent"
                                    )} />
                                    <div>
                                        <h4 className={cn("text-sm font-medium", notif.unread ? "text-foreground" : "text-muted-foreground")}>
                                            {notif.title}
                                        </h4>
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                            {notif.description}
                                        </p>
                                        <span className="text-[10px] text-muted-foreground mt-2 block flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {notif.timestamp}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t border-border bg-muted/30">
                    <button className="w-full py-2 text-sm text-primary font-medium hover:underline">
                        View All Notifications
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationPanel;
