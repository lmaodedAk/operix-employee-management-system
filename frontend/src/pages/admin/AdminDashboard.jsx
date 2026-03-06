import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ label, value, icon: IconComponent, color }) => (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg bg-${color}-500/10`}>
                <IconComponent className={`w-6 h-6 text-${color}-500`} />
            </div>
        </div>
        <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
        <p className="text-slate-400 text-sm">{label}</p>
    </div>
);

const AdminDashboard = () => {
    const { requests, team, tasks } = useApp();
    const pendingCount = requests.filter(r => r.status === 'pending').length;
    const approvedCount = requests.filter(r => r.status === 'approved').length;

    const [selectedId, setSelectedId] = React.useState(null);

    const realEmployees = team
        .filter(member => member.role !== 'admin')
        .map(member => {
            const activeTask = tasks.find(t => t.assignedTo === member.name && t.status !== 'completed');

            const onLeave = requests.some(r =>
                r.submitterName === member.name &&
                r.type === 'time_off' &&
                r.status === 'approved'
            );

            let status = 'Idle';
            let taskTitle = null;

            if (onLeave) {
                status = 'On Leave';
            } else if (activeTask) {
                status = 'Working';
                taskTitle = activeTask.title;
            }

            return {
                id: member.id,
                name: member.name,
                email: member.email,
                status: status,
                task: taskTitle,
                avatar: member.avatar
            };
        });

    const selectedEmployee = realEmployees.find((emp) => emp.id === selectedId);

    React.useEffect(() => {
        if (!selectedId && realEmployees.length > 0) {
            setSelectedId(realEmployees[0].id);
        }
    }, [realEmployees.length]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Overview</h1>
                    <p className="text-slate-400">Welcome back, Admin. System status is healthy.</p>
                </div>
                <Link
                    to="/admin/requests"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-500 transition-colors flex items-center gap-2"
                >
                    Review Requests
                    {pendingCount > 0 && (
                        <span className="bg-white text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">{pendingCount}</span>
                    )}
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Clock} label="Pending Requests" value={pendingCount} color="blue" />
                <StatCard icon={Users} label="Total Employees" value={team.length} color="indigo" />
                <StatCard icon={CheckCircle} label="Approved Today" value={approvedCount} color="green" />
                <StatCard icon={FileText} label="Total Requests" value={requests.length} color="slate" />
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-[500px]">

                <div className="w-full lg:w-1/3 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex flex-col shadow-lg">
                    <div className="p-4 border-b border-slate-700 bg-slate-800/50">
                        <h2 className="font-semibold text-white">Employees</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {realEmployees.length === 0 ? (
                            <div className="p-4 text-center text-slate-500">No employees found</div>
                        ) : (
                            realEmployees.map((emp) => (
                                <div
                                    key={emp.id}
                                    onClick={() => setSelectedId(emp.id)}
                                    className={`p-4 rounded-lg cursor-pointer border transition-all duration-200 ${selectedId === emp.id
                                        ? 'bg-blue-500/20 border-blue-500/50'
                                        : 'bg-slate-700/50 border-transparent hover:bg-slate-700 hover:border-slate-600'
                                        }`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-medium text-white">{emp.name}</span>
                                        {selectedId === emp.id && (
                                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className={`w-2 h-2 rounded-full ${emp.status === 'On Leave' ? 'bg-red-500' :
                                            emp.status === 'Working' ? 'bg-green-500' : 'bg-yellow-500'
                                            }`} />
                                        <p className="text-sm text-slate-400 truncate">
                                            {emp.status}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 flex flex-col p-8 shadow-lg">
                    {selectedEmployee ? (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <div>
                                <h1 className="text-3xl font-bold text-white tracking-tight">
                                    {selectedEmployee.name}
                                </h1>
                                <div className="mt-4 flex items-center gap-3">
                                    <span className="text-slate-400 font-medium">Status:</span>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-bold ${selectedEmployee.status === 'Working' ? 'bg-green-500/20 text-green-400' :
                                            selectedEmployee.status === 'On Leave' ? 'bg-red-500/20 text-red-400' :
                                                'bg-yellow-500/20 text-yellow-400'
                                            }`}
                                    >
                                        {selectedEmployee.status}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-700/50 rounded-xl border border-slate-600/50">
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                    Current Assignment
                                </h3>
                                {selectedEmployee.task ? (
                                    <p className="text-xl font-medium text-white">
                                        {selectedEmployee.task}
                                    </p>
                                ) : (
                                    <p className="text-lg text-slate-500 italic">
                                        {selectedEmployee.status === 'On Leave' ? 'Employee is on leave' : 'No task scheduled'}
                                    </p>
                                )}
                            </div>

                            <div className="pt-4">
                                <button
                                    className="bg-white text-slate-900 px-6 py-2.5 rounded-lg font-bold hover:bg-slate-200 transition-all active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={selectedEmployee.status === 'On Leave'}
                                >
                                    Assign Task
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                                <Users className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-lg font-medium">Select an employee to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
