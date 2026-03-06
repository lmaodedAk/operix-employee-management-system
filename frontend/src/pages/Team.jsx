import React, { useState } from 'react';
import { Search, Plus, Filter, Mail, Award, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AddEmployeeModal from '../components/modals/AddEmployeeModal';
import { cn } from '../lib/utils';

const Team = () => {
    const { team } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [departmentFilter, setDepartmentFilter] = useState('All');

    const filteredTeam = team.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.role.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = departmentFilter === 'All' || member.department === departmentFilter;
        return matchesSearch && matchesDept;
    });

    const allDepartments = [
        'All', 'Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Legal', 'IT'
    ];
    const uniqueDepartments = Array.from(new Set([...allDepartments, ...team.map(t => t.department)]));

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-1">Team</h1>
                    <p className="text-muted-foreground">Manage your team members and their roles</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-glow"
                >
                    <Plus className="w-4 h-4" />
                    Add Employee
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 bg-surface p-4 rounded-xl border border-border shadow-soft">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search employees..."
                        className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative min-w-[200px]">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <select
                        className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm appearance-none"
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                    >
                        {uniqueDepartments.map(dept => (
                            <option key={dept} value={dept}>{dept} Departments</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-soft">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-medium">
                                <th className="p-4">Employee</th>
                                <th className="p-4 hidden md:table-cell">Role</th>
                                <th className="p-4 hidden sm:table-cell">Department</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 hidden lg:table-cell">Join Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredTeam.map((member) => (
                                <tr key={member.id} className="hover:bg-secondary/30 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-foreground">
                                                {member.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="font-medium text-foreground">{member.name}</div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
                                                    <Mail className="w-3 h-3" />
                                                    {member.name.toLowerCase().replace(' ', '')}@operix.com
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 hidden md:table-cell">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-foreground border border-border">
                                            <Award className="w-3 h-3 mr-1 text-primary" />
                                            {member.role}
                                        </span>
                                    </td>
                                    <td className="p-4 hidden sm:table-cell text-sm text-muted-foreground">
                                        {member.department}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-2 h-2 rounded-full",
                                                member.status === 'Active' ? 'bg-green-500' :
                                                    member.status === 'Away' ? 'bg-yellow-500' : 'bg-slate-500'
                                            )} />
                                            <span className="text-sm text-foreground">{member.status}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 hidden lg:table-cell text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {member.joinDate}
                                        </div>
                                    </td>
                                </tr>))}
                            {filteredTeam.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">
                                        No employees found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddEmployeeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Team;
