import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MoreVertical, MapPin, Video, Users, Plus, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import AddTaskModal from '../components/modals/AddTaskModal';
import axios from 'axios';

const DateCard = ({ day, date, active, onClick }) => (
    <button
        onClick={onClick}
        className={cn(
            "flex flex-col p-4 rounded-xl border min-w-[100px] transition-all cursor-pointer text-left hover:scale-[1.02] active:scale-95",
            active
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 border-primary"
                : "bg-surface border-border hover:border-primary/50"
        )}>
        <span className={cn("text-xs font-semibold uppercase tracking-wider mb-1", active ? "text-primary-foreground/80" : "text-muted-foreground")}>{day}</span>
        <span className={cn("text-2xl font-bold", active ? "text-primary-foreground" : "text-foreground")}>{date}</span>
        <div className="mt-auto pt-3 w-full">
            <div className={cn("h-1 w-full rounded-full overflow-hidden", active ? "bg-primary-foreground/20" : "bg-muted")}>
                <div className={cn("h-full w-1/3 rounded-full", active ? "bg-white" : "bg-primary")} />
            </div>
        </div>
    </button>
);

const TaskItem = ({ task, onComplete, onAction, onUnblock }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className={cn(
            "group flex items-start gap-4 p-4 rounded-xl border bg-surface transition-all hover:border-primary/50 hover:shadow-sm relative overflow-visible",
            task.status === 'completed' ? "opacity-60 bg-muted/20" : "opacity-100",
            task.status === 'blocked' ? "border-red-500/50 bg-red-50/10 shadow-lg shadow-red-500/5" : ""
        )}>
            <div className="w-16 shrink-0 flex flex-col items-center pt-1">
                <span className="text-lg font-bold text-foreground font-mono">{task.time || 'All Day'}</span>
                <span className="text-[10px] uppercase font-medium text-muted-foreground tracking-wide">
                    {task.time ? 'Scheduled' : 'Flexible'}
                </span>
            </div>

            <div className="flex-1 min-w-0 border-l-2 border-border pl-4">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    {task.type === 'Meeting' ? (
                        <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 border border-emerald-500/20">
                            <Video className="w-3 h-3" /> Meeting
                        </span>
                    ) : (
                        <span className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 border border-primary/20">
                            <Clock className="w-3 h-3" /> Task
                        </span>
                    )}

                    {task.status === 'blocked' && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse shadow-sm">
                            BLOCKED
                        </span>
                    )}

                    {task.location && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
                            <MapPin className="w-3 h-3" /> {task.location}
                        </span>
                    )}
                </div>

                <h3 className={cn("text-base font-semibold text-foreground mb-1", task.status === 'completed' && "line-through decoration-muted-foreground")}>
                    {task.title}
                </h3>

                <div className="flex items-center gap-3">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        {task.assignedTo || 'Unassigned'}
                    </p>
                </div>

                {task.status === 'blocked' && (
                    <div className="mt-4 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <button
                            onClick={() => onUnblock(task.id)}
                            className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all active:scale-95 shadow-lg shadow-green-500/20 flex items-center gap-2"
                        >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Unblock Task
                        </button>
                        <button
                            onClick={() => onAction(task.id, 'reassign')}
                            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-4 py-2 rounded-lg transition-all active:scale-95 shadow-sm flex items-center gap-2"
                        >
                            <Users className="w-3.5 h-3.5 text-blue-500" />
                            Request Reassignment
                        </button>
                    </div>
                )}
            </div>

            {task.status !== 'completed' && task.status !== 'blocked' && (
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onComplete(task.id)}
                        className="p-2 text-muted-foreground hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                        title="Mark Completed"
                    >
                        <CheckCircle className="w-5 h-5" />
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                        >
                            <MoreVertical className="w-5 h-5" />
                        </button>

                        {showMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                                <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg z-50 py-1">
                                    <button
                                        onClick={() => { onAction(task.id, 'block'); setShowMenu(false); }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        Mark as Blocked
                                    </button>
                                    <button
                                        onClick={() => { onAction(task.id, 'reassign'); setShowMenu(false); }}
                                        className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                                    >
                                        Request Reassignment
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const Schedule = () => {
    const { tasks, completeTask, user, refreshData } = useApp();
    const [selectedDate, setSelectedDate] = useState('06'); // Match seed data date
    const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);

    const myTasks = tasks.filter(t =>
        (t.assignedTo === 'Me' || t.assignedTo === user?.name || t.assignedTo === 'Team') &&
        t.date.endsWith(selectedDate)
    );

    const [reassignmentSent, setReassignmentSent] = useState(false);

    const handleAction = async (taskId, action) => {
        if (action === 'block') {
            try {
                await axios.patch(`/api/tasks/${taskId}`, { status: 'blocked' });
                refreshData();
            } catch (error) {
                console.error("Failed to block task", error);
            }
        } else if (action === 'reassign') {
            try {
                await axios.post('/api/requests', {
                    type: 'reassign_task',
                    title: 'Reassignment Request',
                    description: `Requesting reassignment for Task #${taskId}`,
                    payload: { taskId },
                    submitterName: user?.name || 'Employee'
                });
                setReassignmentSent(true);
                setTimeout(() => setReassignmentSent(false), 3000);
                refreshData();
            } catch (error) {
                console.error("Failed to request reassignment", error);
            }
        }
    };

    const handleUnblock = async (taskId) => {
        try {
            await axios.patch(`/api/tasks/${taskId}`, { status: 'pending' });

            await axios.post('/api/notifications', {
                iconType: 'check',
                title: 'Task Unblocked',
                description: `${user?.name || 'Employee'} has unblocked the task.`,
                recipientRole: 'admin',
                category: 'Work'
            });

            refreshData();
        } catch (error) {
            console.error("Failed to unblock task", error);
        }
    };

    const displayDate = `February ${selectedDate}, 2026`;

    const weekDays = [
        { day: 'Mon', date: '02' },
        { day: 'Tue', date: '03' },
        { day: 'Wed', date: '04' },
        { day: 'Thu', date: '05' },
        { day: 'Fri', date: '06' },
        { day: 'Sat', date: '07' },
        { day: 'Sun', date: '08' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Schedule</h1>
                    <p className="text-muted-foreground">Manage your tasks and meetings</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-surface text-sm font-medium hover:bg-muted transition-colors">
                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                        <span>Feb 2026</span>
                    </button>

                    <button
                        onClick={() => setIsMeetingModalOpen(true)}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        Schedule Meeting
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {weekDays.map((d, i) => (
                    <DateCard
                        key={i}
                        {...d}
                        active={selectedDate === d.date}
                        onClick={() => setSelectedDate(d.date)}
                    />
                ))}
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">{displayDate}</h2>
                        <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full mt-1 inline-block">
                            {myTasks.length} events scheduled
                        </span>
                    </div>
                </div>

                <div className="grid gap-3 relative">
                    {reassignmentSent && (
                        <div className="absolute -top-12 left-0 right-0 flex justify-center z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-xl text-sm font-bold flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Reassignment Request Sent to Admin
                            </div>
                        </div>
                    )}
                    {myTasks.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground border border-dashed rounded-xl">
                            No tasks scheduled for this day
                        </div>
                    ) : (
                        myTasks.map(task => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onComplete={completeTask}
                                onAction={handleAction}
                                onUnblock={handleUnblock}
                            />
                        ))
                    )}
                </div>
            </div>

            <AddTaskModal
                isOpen={isMeetingModalOpen}
                onClose={() => setIsMeetingModalOpen(false)}
                defaultType="Meeting"
            />
        </div>
    );
};

export default Schedule;
