import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Video, Users, Plus, Filter, Search, MoreVertical, Lock, AlertTriangle, ArrowUpCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import AddTaskModal from '../../components/modals/AddTaskModal';
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
    </button>
);

const TaskRow = ({ task, onAction }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className={cn(
            "relative flex items-center gap-4 p-4 rounded-xl border bg-surface hover:border-primary/50 transition-all",
            task.status === 'completed' ? "opacity-60 bg-muted/20" : "",
            task.locked && "border-l-4 border-l-red-500" // Visual indicator for locked
        )}>
            <div className="w-24 text-center">
                <span className="block text-lg font-bold text-foreground">{task.time || 'All Day'}</span>
                <span className="text-[10px] uppercase text-muted-foreground">Scheduled</span>
            </div>

            <div className="flex-1">
                <div className="flex items-center gap-2">
                    {task.locked && <Lock className="w-3 h-3 text-red-500" />}
                    <h3 className={cn("font-semibold text-foreground", task.status === 'completed' && "line-through")}>{task.title}</h3>
                    {task.priority === 'High' && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">HIGH</span>}
                </div>

                <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" /> {task.assignedTo}
                    </span>
                    {task.location && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {task.location}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                {task.type === 'Meeting' ? (
                    <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded-full border border-emerald-500/20">
                        MEETING
                    </span>
                ) : (
                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full border border-primary/20">
                        TASK
                    </span>
                )}

                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>

                    {showMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                            <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg z-20 py-1">
                                <button
                                    onClick={() => { onAction(task.id, 'toggleLock', !task.locked); setShowMenu(false); }}
                                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-secondary flex items-center gap-2"
                                >
                                    <Lock className="w-3 h-3" /> {task.locked ? 'Unlock Task' : 'Lock Task'}
                                </button>
                                <button
                                    onClick={() => { onAction(task.id, 'setPriority', 'High'); setShowMenu(false); }}
                                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-secondary flex items-center gap-2"
                                >
                                    <ArrowUpCircle className="w-3 h-3" /> Set High Priority
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const AdminSchedule = () => {
    const { tasks, refreshData } = useApp();
    const [selectedDate, setSelectedDate] = useState('06'); // Match seed
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [modalType, setModalType] = useState('Task');

    const filteredTasks = tasks.filter(t => t.date.endsWith(selectedDate));

    const weekDays = [
        { day: 'Mon', date: '02' },
        { day: 'Tue', date: '03' },
        { day: 'Wed', date: '04' },
        { day: 'Thu', date: '05' },
        { day: 'Fri', date: '06' },
        { day: 'Sat', date: '07' },
        { day: 'Sun', date: '08' },
    ];

    const openModal = (type) => {
        setModalType(type);
        setIsTaskModalOpen(true);
    };

    const handleTaskAction = async (taskId, action, value) => {
        try {
            const payload = {};
            if (action === 'toggleLock') payload.locked = value;
            if (action === 'setPriority') payload.priority = value;

            await axios.patch(`/api/tasks/${taskId}`, payload);
            refreshData(); // Sync SSoT
        } catch (error) {
            console.error("Action failed", error);
            alert("Failed to update task");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Global Schedule</h1>
                    <p className="text-muted-foreground">Master view of all employee assignments</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => openModal('Meeting')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-surface hover:bg-muted font-medium transition-colors"
                    >
                        <Video className="w-4 h-4" /> Schedule Meeting
                    </button>
                    <button
                        onClick={() => openModal('Task')}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-md"
                    >
                        <Plus className="w-4 h-4" /> Create Task
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-3">
                {weekDays.map((d, i) => (
                    <DateCard
                        key={i}
                        {...d}
                        active={selectedDate === d.date}
                        onClick={() => setSelectedDate(d.date)}
                    />
                ))}
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">
                    Events for Feb {selectedDate} ({filteredTasks.length})
                </h2>
                <div className="grid gap-3">
                    {filteredTasks.length === 0 ? (
                        <div className="p-10 text-center text-muted-foreground border border-dashed rounded-xl">
                            No events scheduled for this day
                        </div>
                    ) : (
                        filteredTasks.map(task => (
                            <TaskRow key={task.id} task={task} onAction={handleTaskAction} />
                        ))
                    )}
                </div>
            </div>

            <AddTaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                defaultType={modalType}
            />
        </div>
    );
};

export default AdminSchedule;
