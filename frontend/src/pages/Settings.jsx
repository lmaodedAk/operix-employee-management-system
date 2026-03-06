import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Camera, Moon, Sun, Monitor, Bell, Shield, Key, Smartphone, Mail } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { cn } from '../lib/utils';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const { theme, toggleTheme } = useTheme();

    const tabs = [
        { id: 'Profile', label: 'Profile' },
        { id: 'Notifications', label: 'Notifications' },
        { id: 'Appearance', label: 'Appearance' },
        { id: 'Security', label: 'Security' },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">Settings</h1>
                <p className="text-muted-foreground">Manage your account and preferences</p>
            </div>

            <div className="flex border-b border-border mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "px-4 py-2 text-sm font-medium transition-colors border-b-2 relative top-[1px]",
                            activeTab === tab.id
                                ? "text-foreground border-primary"
                                : "text-muted-foreground border-transparent hover:text-foreground hover:border-border"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-surface border border-border rounded-xl p-6 shadow-sm min-h-[400px]">
                {activeTab === 'Profile' && <ProfileSettings />}
                {activeTab === 'Notifications' && <NotificationSettings />}
                {activeTab === 'Appearance' && <AppearanceSettings />}
                {activeTab === 'Security' && <SecuritySettings />}
            </div>
        </div>
    );
};

/* --- Sub-Components --- */

import ConfirmationModal from '../components/modals/ConfirmationModal';

const ProfileSettings = () => {
    const { updateUser } = useApp(); // Keep updateUser from useApp (even if undefined for now)
    const { user, logout } = useAuth(); // Use useAuth for user/logout
    const navigate = useNavigate();
    const fileInputRef = React.useRef(null);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateUser({ avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        updateUser({
            name: `${formData.get('firstName')} ${formData.get('lastName')}`,
            email: formData.get('email'),
            phone: formData.get('phone')
        });
    };

    return (
        <div className="animate-in fade-in duration-300">
            <h2 className="text-xl font-semibold text-foreground mb-1">Profile Information</h2>
            <p className="text-muted-foreground text-sm mb-8">Update your personal details</p>

            <div className="flex items-center gap-6 mb-8">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-3xl font-medium text-muted-foreground overflow-hidden border-2 border-border group-hover:border-primary transition-colors">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
                <div>
                    <h3 className="text-lg font-medium text-foreground">{user.name}</h3>
                    <p className="text-muted-foreground">{user.role}</p>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-primary text-sm font-medium hover:underline mt-1"
                    >
                        Change Photo
                    </button>
                </div>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">First Name</label>
                    <input
                        name="firstName"
                        type="text"
                        defaultValue={user.name.split(' ')[0]}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                    <input
                        name="lastName"
                        type="text"
                        defaultValue={user.name.split(' ')[1] || ''}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                </div>
                <div className="md:col-span-2 space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <input
                        name="email"
                        type="email"
                        defaultValue={user.email}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                </div>
                <div className="md:col-span-2 space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <input
                        name="phone"
                        type="tel"
                        defaultValue="+1 234 567 890"
                        className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                </div>
                <div className="md:col-span-2 flex justify-end mt-4">
                    <button type="submit" className="bg-foreground text-background px-6 py-2.5 rounded-lg font-semibold hover:bg-foreground/90 transition-colors shadow-sm">
                        Save Changes
                    </button>
                </div>
            </form>

            <div className="md:col-span-2 pt-6 border-t border-border mt-6">
                <h3 className="text-lg font-medium text-destructive mb-2">Account Actions</h3>
                <button
                    type="button"
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-md"
                >
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                        <path d="M13.5 7.5L10.5 10.75M13.5 7.5L10.5 4.25M13.5 7.5L4 7.5M8 13.5H1.5L1.5 1.5L8 1.5" stroke="currentColor" strokeLinecap="square" />
                    </svg>
                    Log Out
                </button>
            </div>

            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogout}
                title="Log Out"
                message="Are you sure you want to log out of your account? You will need to sign in again to access the dashboard."
                confirmText="Log Out"
                isDestructive={true}
            />
        </div>
    );
};

const NotificationSettings = () => (
    <div className="animate-in fade-in duration-300 space-y-8">
        <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">Notifications</h2>
            <p className="text-muted-foreground text-sm">Choose what you want to be notified about</p>
        </div>

        <div className="space-y-6">
            <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <h3 className="font-medium text-foreground">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground mb-3">Receive emails about your account activity.</p>
                    <div className="space-y-3">
                        <ToggleItem label="News and updates" defaultChecked />
                        <ToggleItem label="Tips and tutorials" defaultChecked />
                        <ToggleItem label="User research" />
                    </div>
                </div>
            </div>

            <div className="h-px bg-border" />

            <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Bell className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <h3 className="font-medium text-foreground">Push Notifications</h3>
                    <p className="text-sm text-muted-foreground mb-3">Get real-time updates on your device.</p>
                    <div className="space-y-3">
                        <ToggleItem label="New comments" defaultChecked />
                        <ToggleItem label="Task assignments" defaultChecked />
                        <ToggleItem label="Meeting reminders" defaultChecked />
                    </div>
                </div>
            </div>
        </div>
        <div className="flex justify-end pt-4">
            <button className="bg-foreground text-background px-6 py-2.5 rounded-lg font-semibold hover:bg-foreground/90 transition-colors shadow-sm">
                Save Preferences
            </button>
        </div>
    </div>
);

const AppearanceSettings = () => {
    const { theme, toggleTheme, accentColor, setAccentColor } = useTheme();

    return (
        <div className="animate-in fade-in duration-300 space-y-8">
            <div>
                <h2 className="text-xl font-semibold text-foreground mb-1">Appearance</h2>
                <p className="text-muted-foreground text-sm">Customize how the application looks properly</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Theme</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button
                            onClick={() => toggleTheme('light')}
                            className={cn(
                                "group p-4 rounded-xl border-2 text-left transition-all hover:border-primary",
                                theme === 'light' ? "border-primary bg-primary/5" : "border-border bg-background"
                            )}
                        >
                            <div className="w-full h-24 rounded-lg bg-gray-100 border border-gray-200 mb-3 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-8 h-full bg-white border-r border-gray-200"></div>
                                <div className="absolute top-2 left-10 w-20 h-4 bg-white rounded-md shadow-sm"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sun className="w-4 h-4 text-orange-500" />
                                <span className="font-medium text-foreground">Light</span>
                            </div>
                        </button>

                        <button
                            onClick={() => toggleTheme('dark')}
                            className={cn(
                                "group p-4 rounded-xl border-2 text-left transition-all hover:border-primary",
                                theme === 'dark' ? "border-primary bg-primary/5" : "border-border bg-background"
                            )}
                        >
                            <div className="w-full h-24 rounded-lg bg-slate-900 border border-slate-800 mb-3 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-8 h-full bg-slate-950 border-r border-slate-800"></div>
                                <div className="absolute top-2 left-10 w-20 h-4 bg-slate-800 rounded-md"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Moon className="w-4 h-4 text-blue-400" />
                                <span className="font-medium text-foreground">Dark</span>
                            </div>
                        </button>

                        <button
                            onClick={() => toggleTheme('system')}
                            className={cn(
                                "group p-4 rounded-xl border-2 text-left transition-all hover:border-primary",
                                theme === 'system' ? "border-primary bg-primary/5" : "border-border bg-background"
                            )}
                        >
                            <div className="w-full h-24 rounded-lg bg-gradient-to-r from-gray-200 to-slate-800 mb-3 overflow-hidden relative shadow-inner">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Monitor className="w-8 h-8 text-slate-500/50" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Monitor className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium text-foreground">System</span>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Accent Color</h3>
                    <div className="flex gap-4">
                        {[
                            { id: 'blue', class: 'bg-blue-600' },
                            { id: 'emerald', class: 'bg-emerald-500' },
                            { id: 'violet', class: 'bg-violet-600' },
                            { id: 'orange', class: 'bg-orange-500' }
                        ].map((color) => (
                            <button
                                key={color.id}
                                onClick={() => setAccentColor(color.id)}
                                className={cn(
                                    "w-10 h-10 rounded-full ring-2 ring-offset-2 ring-offset-background transition-all hover:scale-110",
                                    color.class,
                                    accentColor === color.id ? "ring-foreground" : "ring-transparent"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SecuritySettings = () => (
    <div className="animate-in fade-in duration-300 space-y-8">
        <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">Security</h2>
            <p className="text-muted-foreground text-sm">Keep your account secure</p>
        </div>

        <div className="space-y-6">
            <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Key className="w-5 h-5" />
                </div>
                <div className="flex-1 max-w-md space-y-4">
                    <h3 className="font-medium text-foreground">Change Password</h3>
                    <div className="space-y-3">
                        <input
                            type="password"
                            placeholder="Current Password"
                            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <button className="bg-surface border border-border text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                            Update Password
                        </button>
                    </div>
                </div>
            </div>

            <div className="h-px bg-border" />

            <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Shield className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <h3 className="font-medium text-foreground">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground mb-3">Add an extra layer of security to your account.</p>
                    <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-background/50">
                        <div className="p-2 bg-muted rounded-full">
                            <Smartphone className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground">Authenticator App</p>
                            <p className="text-xs text-muted-foreground">Receive codes via an authentication app.</p>
                        </div>
                        <button className="ml-auto text-primary text-sm font-medium hover:underline">Setup</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ToggleItem = ({ label, defaultChecked }) => (
    <label className="flex items-center justify-between cursor-pointer group">
        <span className="text-sm text-foreground group-hover:text-primary transition-colors">{label}</span>
        <div className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
            <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </div>
    </label>
);

export default Settings;
