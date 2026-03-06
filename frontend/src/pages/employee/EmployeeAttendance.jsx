import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Clock, Calendar as CalendarIcon, Hash, CheckCircle, LogIn, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

const EmployeeAttendance = () => {
    const { user } = useAuth();
    const [clockedIn, setClockedIn] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState('00:00:00');
    const [logs, setLogs] = useState([]);

    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        if (!user) return;
        const saved = localStorage.getItem('operix_attendance');
        if (saved) {
            const allLogs = JSON.parse(saved);
            const myLogs = allLogs.filter(l => l.email === user.email);
            setLogs(myLogs);

            const sortedLogs = [...myLogs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            if (sortedLogs.length > 0 && sortedLogs[0].type === 'in') {
                setClockedIn(true);
                setStartTime(new Date(sortedLogs[0].timestamp));
            }
        }
    }, [user]);

    useEffect(() => {
        let interval;
        if (clockedIn && startTime) {
            interval = setInterval(() => {
                const now = new Date();
                const diff = now - startTime;
                const hours = Math.floor(diff / 3600000);
                const minutes = Math.floor((diff % 3600000) / 60000);
                const seconds = Math.floor((diff % 60000) / 1000);
                setElapsedTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            }, 1000);
        } else {
            setElapsedTime('00:00:00');
        }
        return () => clearInterval(interval);
    }, [clockedIn, startTime]);

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
        const allLogs = existing ? JSON.parse(existing) : [];
        const updatedLogs = [newLog, ...allLogs];
        localStorage.setItem('operix_attendance', JSON.stringify(updatedLogs));

        setLogs(updatedLogs.filter(l => l.email === user.email));
        if (type === 'in') {
            setClockedIn(true);
            setStartTime(new Date());
        } else {
            setClockedIn(false);
            setStartTime(null);
        }
    };

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Attendance</h1>
                    <p className="text-slate-400">Track your work hours</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1 border border-slate-700">
                    <span className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${clockedIn ? 'bg-green-500/20 text-green-400' : 'text-slate-400'}`}>
                        {clockedIn ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-6">
                    <div className={`p-6 rounded-2xl border transition-all duration-500 relative overflow-hidden ${clockedIn ? 'bg-gradient-to-br from-blue-900/40 to-slate-900 border-blue-500/30' : 'bg-slate-800 border-slate-700'
                        }`}>
                        {clockedIn && <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>}

                        <div className="relative z-10 text-center">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Current Session</h2>
                            <div className="text-5xl font-mono font-bold text-white mb-6 tracking-tight tabular-nums drop-shadow-lg">
                                {elapsedTime}
                            </div>
                            <button
                                onClick={handlePunch}
                                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg ${clockedIn
                                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
                                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
                                    }`}
                            >
                                {clockedIn ? <><LogOut className="w-5 h-5" /> Stop Work</> : <><LogIn className="w-5 h-5" /> Start Work</>}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                            <Clock className="w-6 h-6 text-blue-400 mb-2" />
                            <h4 className="text-2xl font-bold text-white">164h</h4>
                            <p className="text-xs text-slate-400 uppercase font-medium">Total Hours</p>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                            <CheckCircle className="w-6 h-6 text-green-400 mb-2" />
                            <h4 className="text-2xl font-bold text-white">22</h4>
                            <p className="text-xs text-slate-400 uppercase font-medium">Days Present</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-slate-800 rounded-2xl border border-slate-700 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-slate-400" />
                            Attendance History
                        </h3>
                        <div className="flex items-center gap-2">
                            <button onClick={prevMonth} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"><ChevronLeft className="w-5 h-5" /></button>
                            <span className="text-sm font-medium text-white w-32 text-center">
                                {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                            </span>
                            <button onClick={nextMonth} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"><ChevronRight className="w-5 h-5" /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="text-center text-xs font-medium text-slate-500 uppercase py-2">{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {emptyDays.map(i => <div key={`empty-${i}`} className="h-20 sm:h-24 bg-transparent"></div>)}
                        {calendarDays.map(day => {
                            const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toLocaleDateString();
                            const dayLogs = logs.filter(l => new Date(l.timestamp).toLocaleDateString() === checkDate);
                            const hasPunchIn = dayLogs.some(l => l.type === 'in');
                            const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();

                            let hours = 0;
                            if (dayLogs.length >= 2) hours = 8.5; // Mock for visual pop

                            return (
                                <div key={day} className={`h-20 sm:h-24 rounded-xl border border-slate-700/50 p-2 flex flex-col justify-between transition-colors hover:border-slate-600 ${isToday ? 'bg-blue-500/10 border-blue-500/50' : 'bg-slate-900/50'
                                    }`}>
                                    <span className={`text-sm font-medium ${isToday ? 'text-blue-400' : 'text-slate-400'}`}>{day}</span>

                                    {hasPunchIn && (
                                        <div className="space-y-1.5 mt-1">
                                            <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-green-500 h-full w-3/4 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                            </div>
                                            <div className="text-[10px] font-semibold text-slate-300 flex justify-between items-center bg-slate-800/80 rounded px-1 py-0.5 border border-slate-700/50">
                                                <span>09:00</span>
                                                <span className="text-slate-600 mx-0.5">-</span>
                                                <span>17:30</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeAttendance;
