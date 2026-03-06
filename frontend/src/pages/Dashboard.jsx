import React, { useState } from 'react';
import { Users, Briefcase, TrendingUp, Clock, UserPlus, Calendar as CalendarIcon, ClipboardList, Send, Coffee, FileText, Zap, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import AddEmployeeModal from '../components/modals/AddEmployeeModal';
import AddTaskModal from '../components/modals/AddTaskModal';
import SendUpdateModal from '../components/modals/SendUpdateModal';
import DailySummaryModal from '../components/modals/DailySummaryModal';

const StatCard = ({ icon: Icon, label, value, trend, trendUp }) => (
    <div className="bg-surface p-6 rounded-xl border border-border shadow-soft relative overflow-hidden group hover:border-primary/50 transition-colors">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            {trend && (
                <span className={cn("text-xs font-medium px-2 py-1 rounded-full", trendUp ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10")}>
                    {trend}
                </span>
            )}
        </div>
        <h3 className="text-3xl font-bold text-foreground mb-1">{value}</h3>
        <p className="text-muted-foreground text-sm">{label}</p>
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
    </div>
);

const ActionButton = ({ icon: Icon, label, subLabel, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-start p-5 bg-surface border border-border rounded-xl hover:bg-secondary/50 hover:border-primary/50 transition-all duration-200 text-left group shadow-soft"
    >
        <div className="p-2.5 bg-secondary rounded-lg mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Icon className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
        </div>
        <span className="text-foreground font-medium mb-1 group-hover:translate-x-1 transition-transform">{label}</span>
        <span className="text-xs text-muted-foreground">{subLabel}</span>
    </button>
);

const ActivityItem = ({ title, desc, time, type }) => (
    <div className="flex gap-4 p-4 hover:bg-secondary/50 rounded-lg transition-colors border-l-2 border-transparent hover:border-primary">
        <div className={cn("w-2 h-2 mt-2 rounded-full",
            type === 'completed' ? 'bg-green-500' :
                type === 'new' ? 'bg-blue-500' : 'bg-slate-500'
        )} />
        <div>
            <h4 className="text-sm font-medium text-foreground">{title}</h4>
            <p className="text-xs text-muted-foreground mt-1">{desc}</p>
            <span className="text-[10px] text-muted-foreground mt-2 block uppercase tracking-wider">{time}</span>
        </div>
    </div>
);

const Dashboard = () => {
    const { team, tasks, requests, notifications, addNotification, createRequest, user } = useApp();

    const [showEmployeeModal, setShowEmployeeModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showSendUpdateModal, setShowSendUpdateModal] = useState(false);
    const [showDailySummaryModal, setShowDailySummaryModal] = useState(false);
    const [taskModalType, setTaskModalType] = useState('Task');

    const totalEmployees = team.length;
    const pendingTasks = tasks.filter(t => t.status === 'pending').length;
    const activeRequests = requests ? requests.filter(r => r.status === 'pending').length : 0;
    const leaveBalance = 15; // Days

    const handleSendUpdate = () => {
        setShowSendUpdateModal(true);
    };

    const handleRequestTimeOff = async () => {
        await createRequest({
            title: 'Time Off Request',
            description: `Employee ${user?.name || 'User'} has requested time off.`,
            type: 'time_off',
            status: 'pending',
            submitterName: user?.name || 'Current User',
            timestamp: new Date().toLocaleString(),
            payload: {
                reason: 'Personal Leave'
            }
        });

        addNotification({
            iconType: 'people',
            title: 'Request Sent',
            description: 'Your time off request has been sent to HR for approval.',
            category: 'HR'
        });
    };

    const openTaskModal = (type) => {
        setTaskModalType(type);
        setShowTaskModal(true);
    };

    const [clockedIn, setClockedIn] = React.useState(false);
    const [latestReview, setLatestReview] = React.useState(null);
    const [lastPunchTime, setLastPunchTime] = React.useState(null);

    React.useEffect(() => {
        if (!user || !user.email || !user.name) return; // Ensure user data is available

        const savedAttendance = localStorage.getItem('operix_attendance');
        if (savedAttendance) {
            const logs = JSON.parse(savedAttendance);
            const myLogs = logs.filter(l => l.email === user.email);
            if (myLogs.length > 0) {
                const lastLog = myLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
                if (lastLog.type === 'in') {
                    setClockedIn(true);
                    setLastPunchTime(new Date(lastLog.timestamp));
                }
            }
        }

        const savedReviews = localStorage.getItem('operix_reviews');
        if (savedReviews) {
            const allReviews = JSON.parse(savedReviews);
            const myReview = allReviews.find(r => r.employeeName === user.name);
            setLatestReview(myReview);
        }
    }, [user]);

    const handlePunch = () => {
        const type = clockedIn ? 'out' : 'in';
        const newLog = {
            id: Date.now(),
            email: user.email,
            name: user.name,
            timestamp: new Date().toISOString(),
            type
        };

        const existing = localStorage.getItem('operix_attendance');
        const logs = existing ? JSON.parse(existing) : [];
        const updatedLogs = [newLog, ...logs];

        localStorage.setItem('operix_attendance', JSON.stringify(updatedLogs));
        setClockedIn(!clockedIn);
        setLastPunchTime(new Date());

    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">My Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {user?.name?.split(' ')[0] || 'Employee'}. Here's your overview.</p>
                </div>

                <div className="flex items-center gap-4 bg-surface p-2 pr-6 rounded-full border border-border shadow-soft">
                    <button
                        onClick={handlePunch}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all active:scale-95 shadow-lg ${clockedIn
                            ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
                            : 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/20'
                            }`}
                    >
                        <Clock className="w-5 h-5" />
                        {clockedIn ? 'Punch Out' : 'Punch In'}
                    </button>
                    <div className="text-sm">
                        <p className="text-muted-foreground font-medium uppercase text-xs tracking-wider">Current Status</p>
                        <p className={`font-bold ${clockedIn ? 'text-green-500' : 'text-muted-foreground'}`}>
                            {clockedIn ? 'Clocked In' : 'Clocked Out'}
                        </p>
                    </div>
                </div>
            </div>

            {latestReview && (
                <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-500/30 rounded-xl p-6 relative overflow-hidden group hover:border-purple-500/50 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Star className="w-32 h-32 text-white" />
                    </div>
                    <div className="flex items-start gap-4 relative z-10">
                        <div className="p-3 bg-purple-500/20 rounded-lg">
                            <Star className="w-8 h-8 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-1">Performance Review Available</h3>
                            <p className="text-purple-200 text-sm mb-4">
                                You received a rating of <span className="font-bold text-foreground text-lg">{latestReview.rating}/5.0</span> on {new Date(latestReview.date).toLocaleDateString()}.
                            </p>
                            <div className="bg-surface/60 p-4 rounded-lg border border-purple-500/20 text-muted-foreground text-sm italic">
                                "{latestReview.feedback}"
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Pending Tasks" value={pendingTasks} icon={Clock} color="blue" />
                <StatCard label="Leave Balance" value={`${leaveBalance} Days`} icon={CalendarIcon} color="green" />
                <StatCard label="Active Requests" value={activeRequests} icon={FileText} color="purple" />
            </div>

            <div>
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <ActionButton
                        icon={UserPlus}
                        label="Add Employee"
                        subLabel="Onboard new team member"
                        onClick={() => setShowEmployeeModal(true)}
                        color="blue"
                    />
                    <ActionButton
                        icon={CalendarIcon}
                        label="Schedule Meeting"
                        subLabel="Book a team meeting"
                        onClick={() => openTaskModal('Meeting')}
                        color="indigo"
                    />
                    <ActionButton
                        icon={ClipboardList}
                        label="Assign Task"
                        subLabel="Create and assign tasks"
                        onClick={() => openTaskModal('Task')}
                        color="purple"
                    />
                    <ActionButton
                        icon={FileText}
                        label="Daily Summary"
                        subLabel="Log your achievements"
                        onClick={() => setShowDailySummaryModal(true)}
                        color="cyan"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-surface border border-border rounded-xl overflow-hidden shadow-soft">
                    <div className="p-6 border-b border-border">
                        <h3 className="font-semibold text-foreground">Recent Activity</h3>
                        <p className="text-xs text-muted-foreground">What's happening in your organization</p>
                    </div>
                    <div className="divide-y divide-border">
                        {notifications.slice(0, 3).map(notif => (
                            <ActivityItem
                                key={notif.id}
                                title={notif.title}
                                desc={notif.description}
                                time={notif.timestamp}
                                type="new"
                            />
                        ))}
                        {tasks.slice(0, 2).map(task => (
                            <ActivityItem
                                key={`task-${task.id}`}
                                title={`Task: ${task.title}`}
                                desc={`Assigned to ${task.assignedTo}`}
                                time={task.status === 'completed' ? 'Completed' : 'Pending'}
                                type={task.status === 'completed' ? 'completed' : 'default'}
                            />
                        ))}
                        {notifications.length === 0 && tasks.length === 0 && (
                            <div className="p-6 text-muted-foreground text-center text-sm">No recent activity</div>
                        )}
                    </div>
                </div>

                <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-soft">
                    <div className="p-6 border-b border-border flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold text-foreground">Team Members</h3>
                            <p className="text-xs text-muted-foreground">{team.filter(t => t.status === 'Active').length} active</p>
                        </div>
                        <button className="text-xs bg-secondary hover:bg-secondary/80 text-foreground px-3 py-1 rounded-full transition-colors">
                            + Invite
                        </button>
                    </div>
                    <div className="p-4 space-y-4">
                        {team.slice(0, 5).map(member => (
                            <div key={member.id} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-xs font-bold text-white">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                                </div>
                                <span className={cn("w-2 h-2 rounded-full", member.status === 'Active' ? "bg-green-500" : "bg-yellow-500")}></span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <AddEmployeeModal isOpen={showEmployeeModal} onClose={() => setShowEmployeeModal(false)} />
            <AddTaskModal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} defaultType={taskModalType} />
            <SendUpdateModal isOpen={showSendUpdateModal} onClose={() => setShowSendUpdateModal(false)} />
            <DailySummaryModal isOpen={showDailySummaryModal} onClose={() => setShowDailySummaryModal(false)} />
        </div>
    );
};

export default Dashboard;
