import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Import useNavigate
import { LayoutDashboard, Users, Calendar, FileText, BarChart2, Bell, Settings, HelpCircle, ShieldAlert, ChevronLeft, ChevronRight, LogOut, Shield, Clock, ClipboardList } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';

import ConfirmationModal from '../components/modals/ConfirmationModal';

const Sidebar = () => {
    const { notifications } = useApp();
    const { user, logout } = useAuth(); // Use useAuth for user and logout
    const navigate = useNavigate();
    const unreadCount = notifications.filter(n => n.unread).length;
    const [collapsed, setCollapsed] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);


    const employeeNav = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Users, label: 'Team', path: '/team', badge: null },
        { icon: Calendar, label: 'Schedule', path: '/schedule' },
        { icon: ClipboardList, label: 'Requests', path: '/requests' },
        { icon: Clock, label: 'Attendance', path: '/employee/attendance' },
        { icon: BarChart2, label: 'Performance', path: '/employee/performance' },
        { icon: FileText, label: 'Documents', path: '/documents' },
        { icon: BarChart2, label: 'Analytics', path: '/analytics' },
        { icon: Bell, label: 'Notifications', path: '/notifications', badge: unreadCount > 0 ? unreadCount : null },
    ];

    const adminNav = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Bell, label: 'Requests', path: '/admin/requests', badge: null },
        { icon: Users, label: 'Employees', path: '/team' },
        { icon: Calendar, label: 'Tasks', path: '/admin/schedule' },
        { icon: Clock, label: 'Attendance', path: '/admin/attendance' },
        { icon: BarChart2, label: 'Performance Reviews', path: '/admin/performance' },
        { icon: BarChart2, label: 'Analytics', path: '/analytics' },
        { icon: Shield, label: 'Roles & Permissions', path: '/admin/roles' },
    ];

    const navItems = user?.role === 'admin' ? adminNav : employeeNav;

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <aside className={cn(
            "bg-surface border-r border-border flex flex-col h-screen sticky top-0 left-0 transition-all duration-300 z-40",
            collapsed ? "w-20" : "w-64"
        )}>
            <div className="p-6 flex items-center gap-3 relative group">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                {!collapsed && (
                    <span className="font-bold text-lg text-foreground tracking-tight animate-in fade-in duration-300">
                        Operix
                    </span>
                )}

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 bg-surface border border-border rounded-full p-1 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                </button>
            </div>

            <nav className="flex-1 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                            isActive
                                ? "bg-primary/10 text-primary" // Subtle active state
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                        title={collapsed ? item.label : ""}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-primary")} />
                                {!collapsed && <span>{item.label}</span>}

                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                                )}

                                {!collapsed && item.badge && (
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-destructive text-destructive-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[1.25rem] text-center">
                                        {item.badge}
                                    </span>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-border space-y-1">
                <NavLink
                    to="/settings"
                    className={({ isActive }) => cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full",
                        isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                    title={collapsed ? "Settings" : ""}
                >
                    {({ isActive }) => (
                        <>
                            <Settings className={cn("w-5 h-5 shrink-0", isActive && "text-primary")} />
                            {!collapsed && <span>Settings</span>}
                        </>
                    )}
                </NavLink>
                <NavLink
                    to="/help"
                    className={({ isActive }) => cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full",
                        isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                    title={collapsed ? "Help & Support" : ""}
                >
                    {({ isActive }) => (
                        <>
                            <HelpCircle className={cn("w-5 h-5 shrink-0", isActive && "text-primary")} />
                            {!collapsed && <span>Help & Support</span>}
                        </>
                    )}
                </NavLink>
            </div>

            <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-medium text-white shrink-0">
                        {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </div>
                    {!collapsed && (
                        <div className="flex-1 min-w-0 animate-in fade-in duration-300">
                            <p className="text-sm font-medium text-foreground truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                    )}
                    {!collapsed && (
                        <button
                            onClick={() => setIsLogoutModalOpen(true)}
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors ml-auto shadow-sm"
                            title="Log Out"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogout}
                title="Log Out"
                message="Are you sure you want to log out of your account?"
                confirmText="Log Out"
                isDestructive={true}
            />
        </aside>
    );
};

export default Sidebar;
