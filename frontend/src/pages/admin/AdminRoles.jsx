import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Users, Search, Plus, MoreHorizontal, User, UserCheck } from 'lucide-react';
import CreateRoleModal from '../../components/modals/CreateRoleModal';

const AdminRoles = () => {
    const { team } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [roles, setRoles] = useState([]);

    const defaultRoles = [
        {
            id: 'admin',
            title: 'Admin',
            description: 'Full system access',
            color: 'red',
            icon: Shield,
            members: team.filter(m => m.role === 'admin' || m.department === 'Admin').length,
            permissions: [
                { name: 'Manage Employees', enabled: true },
                { name: 'Approve Requests', enabled: true },
                { name: 'View Analytics', enabled: true },
                { name: 'Manage Roles', enabled: true },
                { name: 'System Settings', enabled: true },
            ]
        },
        {
            id: 'manager',
            title: 'Manager',
            description: 'Team management access',
            color: 'yellow',
            icon: Users,
            members: team.filter(m => m.role.includes('Manager')).length,
            permissions: [
                { name: 'Manage Employees', enabled: true },
                { name: 'Approve Requests', enabled: true },
                { name: 'View Analytics', enabled: true },
                { name: 'Manage Roles', enabled: false },
                { name: 'System Settings', enabled: false },
            ]
        },
        {
            id: 'employee',
            title: 'Employee',
            description: 'Standard employee access',
            color: 'blue',
            icon: Users,
            members: team.filter(m => m.role !== 'admin' && !m.role.includes('Manager')).length,
            permissions: [
                { name: 'Manage Employees', enabled: false },
                { name: 'Approve Requests', enabled: false },
                { name: 'View Analytics', enabled: false },
                { name: 'Manage Roles', enabled: false },
                { name: 'System Settings', enabled: false },
            ]
        }
    ];

    useEffect(() => {
        const savedRoles = localStorage.getItem('operix_roles');
        if (savedRoles) {
            setRoles(JSON.parse(savedRoles));
        } else {
            setRoles(defaultRoles);
            localStorage.setItem('operix_roles', JSON.stringify(defaultRoles));
        }
    }, [team]); // Re-run if team changes to update member counts logic if complex (simplified here)

    const handleCreateRole = (newRoleData) => {
        const newRole = {
            id: Date.now().toString(),
            title: newRoleData.title,
            description: newRoleData.description,
            color: newRoleData.color,
            icon: UserCheck, // Default icon for custom roles
            members: 0,
            permissions: [
                { name: 'Manage Employees', enabled: false },
                { name: 'Approve Requests', enabled: false },
                { name: 'View Analytics', enabled: false },
                { name: 'Manage Roles', enabled: false },
                { name: 'System Settings', enabled: false },
            ]
        };

        const updatedRoles = [...roles, newRole];
        setRoles(updatedRoles);
        localStorage.setItem('operix_roles', JSON.stringify(updatedRoles));
    };

    const togglePermission = (roleId, permName) => {
        const updatedRoles = roles.map(role => {
            if (role.id === roleId) {
                return {
                    ...role,
                    permissions: role.permissions.map(p =>
                        p.name === permName ? { ...p, enabled: !p.enabled } : p
                    )
                };
            }
            return role;
        });
        setRoles(updatedRoles);
        localStorage.setItem('operix_roles', JSON.stringify(updatedRoles));
    };

    const getIcon = (iconNameOrComponent) => {
        return iconNameOrComponent;
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Roles & Permissions</h1>
                    <p className="text-slate-400">Manage access control</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Create Role
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase())).map(role => {
                    const IconComponent = role.id === 'admin' ? Shield : role.id === 'manager' || role.id === 'employee' ? Users : UserCheck;

                    return (
                        <div key={role.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden relative group">
                            <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity bg-${role.color}-500/50`}></div>

                            <div className="p-6 border-b border-slate-700">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl bg-${role.color}-500/10`}>
                                        <IconComponent className={`w-8 h-8 text-${role.color}-500`} />
                                    </div>
                                    <button className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">{role.title}</h3>
                                <p className="text-slate-400 text-sm mb-4">{role.description}</p>

                                <div className="px-3 py-2 bg-slate-900/50 rounded-lg border border-slate-700/50 flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-300">{role.members} members</span>
                                    <div className="flex -space-x-2">
                                        {team.slice(0, 3).map((m, i) => (
                                            <div key={i} className="w-6 h-6 rounded-full bg-slate-700 border border-slate-800"></div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Permissions</p>
                                {role.permissions.map((perm, idx) => (
                                    <div key={idx} className="flex justify-between items-center group/perm hover:bg-slate-700/20 p-2 rounded -mx-2 transition-colors">
                                        <span className="text-sm text-slate-300 font-medium">{perm.name}</span>
                                        <button
                                            onClick={() => togglePermission(role.id, perm.name)}
                                            className={`w-10 h-5 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-${role.color}-500 ${perm.enabled ? `bg-${role.color}-500` : 'bg-slate-600'}`}
                                        >
                                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${perm.enabled ? 'left-6' : 'left-1'}`}></div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <CreateRoleModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateRole}
            />
        </div>
    );
};

export default AdminRoles;
