import React from 'react';
import { Search, Bell, Sun, Moon, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

const Header = ({ onNewTask, onOpenNotifications, onOpenSearch }) => {
    const { notifications } = useApp();
    const { theme, toggleTheme } = useTheme();
    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <header className="flex items-center justify-between p-4 border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-30">
            <div className="relative w-96 hidden md:block group" onClick={onOpenSearch}>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                    <Search className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <button
                    className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-left text-muted-foreground hover:border-primary/50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all flex justify-between items-center"
                >
                    <span>Search...</span>
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded border border-border font-medium opacity-70">
                        ⌘K
                    </span>
                </button>
            </div>

            <div className="flex items-center gap-4 ml-auto">
                <button
                    onClick={() => toggleTheme()}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <button
                    onClick={onOpenNotifications}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors relative"
                >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-surface"></span>
                    )}
                </button>

                <button
                    onClick={onNewTask}
                    className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-300 transition-colors shadow-glow"
                >
                    <Plus className="w-4 h-4" />
                    New Task
                </button>
            </div>
        </header>
    );
};

export default Header;
