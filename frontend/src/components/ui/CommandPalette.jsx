import React, { useState, useEffect, useRef } from 'react';
import { Search, Map, Calendar, Users, FileText, Settings, ArrowRight, BarChart2, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { createPortal } from 'react-dom';


const CommandPalette = ({ isOpen, onClose, user }) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const navigate = useNavigate();


    const baseItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Map, type: 'Page', path: '/', description: 'Overview of all your operations and metrics.', roles: ['employee', 'admin'] },
    ];

    const employeeItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Map, type: 'Page', path: '/', description: 'Overview of your tasks and metrics.' },
        { id: 'team', label: 'Team', icon: Users, type: 'Page', path: '/team', description: 'View team members.' },
        { id: 'schedule', label: 'Schedule', icon: Calendar, type: 'Page', path: '/schedule', description: 'View your shifts and tasks.' },
        { id: 'documents', label: 'Documents', icon: FileText, type: 'Page', path: '/documents', description: 'Access files.' },
        { id: 'analytics', label: 'Analytics', icon: BarChart2, type: 'Page', path: '/analytics', description: 'View performance metrics.' },
        { id: 'settings', label: 'Settings', icon: Settings, type: 'Page', path: '/settings', description: 'Preferences.' },
        { id: 'profile', label: 'Edit Profile', icon: Users, type: 'Action', action: () => navigate('/settings'), description: 'Update profile.' },
    ];

    const adminItems = [
        { id: 'admin-overview', label: 'Admin Overview', icon: Map, type: 'Page', path: '/admin', description: 'System-wide overview.' },
        { id: 'admin-requests', label: 'Review Requests', icon: Bell, type: 'Page', path: '/admin/requests', description: 'Approve or reject pending requests.' },
        { id: 'team', label: 'All Employees', icon: Users, type: 'Page', path: '/team', description: 'Manage all employees.' },
        { id: 'analytics', label: 'System Analytics', icon: BarChart2, type: 'Page', path: '/analytics', description: 'View system-wide metrics.' },
        { id: 'settings', label: 'Settings', icon: Settings, type: 'Page', path: '/settings', description: 'System preferences.' },
    ];

    const roleItems = user?.role === 'admin' ? adminItems : employeeItems;

    const commonActions = [
        { id: 'theme', label: 'Toggle Theme', icon: Settings, type: 'Action', action: () => document.querySelector('.theme-toggle')?.click(), description: 'Switch Light/Dark mode.' },
    ];

    const items = [...roleItems, ...commonActions];

    const filteredItems = items.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % filteredItems.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const item = filteredItems[selectedIndex];
                if (item) {
                    if (item.path) navigate(item.path);
                    if (item.action) item.action();
                    onClose();
                }
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, filteredItems, selectedIndex, navigate, onClose]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const selectedItem = filteredItems[selectedIndex];

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-surface border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface/50">
                    <Search className="w-5 h-5 text-muted-foreground" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type a command or search..."
                        className="flex-1 bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <kbd className="hidden sm:inline-block px-2 py-0.5 bg-muted text-muted-foreground text-[10px] font-medium rounded border border-border">ESC</kbd>
                    </div>
                </div>

                <div className="flex bg-surface h-[300px]">
                    <div className="flex-1 overflow-y-auto p-2 border-r border-border">
                        {filteredItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                <Search className="w-8 h-8 mb-2 opacity-50" />
                                <p className="text-sm">No results found</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {filteredItems.map((item, index) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            if (item.path) navigate(item.path);
                                            if (item.action) item.action();
                                            onClose();
                                        }}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors",
                                            index === selectedIndex ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                                        )}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                    >
                                        <item.icon className={cn("w-4 h-4", index === selectedIndex ? "text-primary-foreground" : "text-muted-foreground")} />
                                        <span className="flex-1 truncate">{item.label}</span>
                                        {index === selectedIndex && <ArrowRight className="w-3 h-3 opacity-50" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="w-1/2 p-6 flex flex-col items-center justify-center text-center bg-muted/30 hidden sm:flex">
                        {selectedItem ? (
                            <div className="animate-in fade-in slide-in-from-left-4 duration-200">
                                <div className="w-16 h-16 bg-background border border-border rounded-2xl flex items-center justify-center mb-4 shadow-sm mx-auto">
                                    <selectedItem.icon className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-1">{selectedItem.label}</h3>
                                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">{selectedItem.type}</div>
                                <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                            </div>
                        ) : (
                            <div className="text-muted-foreground text-sm">Select an item to see details</div>
                        )}
                    </div>
                </div>

                <div className="bg-muted/50 px-4 py-2 border-t border-border flex justify-between items-center text-[10px] text-muted-foreground">
                    <div className="flex gap-3">
                        <span className="flex items-center gap-1"><kbd className="bg-background border border-border px-1 rounded">↑↓</kbd> to navigate</span>
                        <span className="flex items-center gap-1"><kbd className="bg-background border border-border px-1 rounded">↵</kbd> to select</span>
                    </div>
                    <span>Command Palette</span>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CommandPalette;
