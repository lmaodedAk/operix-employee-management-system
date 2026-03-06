import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, UserCheck, UserX, AlertCircle, Search, Filter, MoreHorizontal } from 'lucide-react';

const AdminAttendance = () => {
    const { team } = useApp();
    const [date, setDate] = useState(new Date());
    const [attendanceData, setAttendanceData] = useState([]);

    const [stats, setStats] = useState({ present: 0, absent: 0, leave: 0, total: 0 });

    useEffect(() => {
        const saved = localStorage.getItem('operix_attendance');
        const logs = saved ? JSON.parse(saved) : [];
        setAttendanceData(logs);

        const today = new Date().toLocaleDateString();
        const presentSet = new Set(logs.filter(l => new Date(l.timestamp).toLocaleDateString() === today && l.type === 'in').map(l => l.email));

        const onLeaveCount = team.filter(m => m.status === 'On Leave').length;

        setStats({
            present: presentSet.size,
            absent: team.length - presentSet.size - onLeaveCount,
            leave: onLeaveCount,
            total: team.length
        });
    }, [team]);

    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Attendance</h1>
                    <p className="text-slate-400">Monitor employee attendance</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                            <UserCheck className="w-6 h-6 text-blue-500" />
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded-full text-green-500 bg-green-500/10">90.1%</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{stats.present}</h3>
                    <p className="text-slate-400 text-sm">Present Today</p>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-500/10 rounded-lg">
                            <UserX className="w-6 h-6 text-red-500" />
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded-full text-red-500 bg-red-500/10">5.6%</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{stats.absent}</h3>
                    <p className="text-slate-400 text-sm">Absent Today</p>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                            <Clock className="w-6 h-6 text-blue-400" />
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded-full text-blue-400 bg-blue-500/10">4.2%</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{stats.leave}</h3>
                    <p className="text-slate-400 text-sm">On Leave</p>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-slate-700/50 rounded-lg">
                            <UserCheck className="w-6 h-6 text-slate-300" />
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded-full text-green-500 bg-green-500/10">+2 this week</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{stats.total}</h3>
                    <p className="text-slate-400 text-sm">Total Employees</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-white">Monthly Calendar</h3>
                        <div className="flex gap-2">
                            <span className="text-sm text-slate-400">{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="text-xs text-slate-500 uppercase tracking-wider font-medium py-2">{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {emptyDays.map(i => <div key={`empty-${i}`} className="h-14"></div>)}
                        {calendarDays.map(d => {
                            const isPresent = d % 2 !== 0 && d < new Date().getDate();
                            const isAbsent = d % 5 === 0 && d < new Date().getDate();
                            const isToday = d === new Date().getDate();

                            return (
                                <div key={d} className={`h-14 rounded-lg flex items-center justify-center text-sm font-medium relative transition-colors ${isToday ? 'bg-blue-600 border border-blue-400 text-white' : 'bg-slate-900/50 text-slate-400 hover:bg-slate-700/50'
                                    }`}>
                                    {d}
                                    {isPresent && !isToday && <div className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                                    {isAbsent && !isToday && <div className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-red-500"></div>}
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex gap-4 mt-6 text-xs text-slate-400">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Present</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Absent</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> On Leave</div>
                    </div>
                </div>

                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Today's Status</h3>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {team.slice(0, 10).map(member => {
                            const isPresent = attendanceData.some(l => l.email === member.email && new Date(l.timestamp).toLocaleDateString() === new Date().toLocaleDateString() && l.type === 'in');
                            const time = isPresent ? '09:02 AM' : '---';

                            return (
                                <div key={member.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/30 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-300">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{member.name}</p>
                                            <p className="text-xs text-slate-500">{time}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${isPresent ? 'bg-green-500/10 text-green-400'
                                            : member.status === 'On Leave' ? 'bg-yellow-500/10 text-yellow-400'
                                                : 'bg-red-500/10 text-red-400'
                                        }`}>
                                        {isPresent ? 'Present' : member.status === 'On Leave' ? 'On Leave' : 'Absent'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAttendance;
