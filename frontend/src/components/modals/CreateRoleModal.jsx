import React, { useState } from 'react';
import { Shield, X, Check } from 'lucide-react';

const CreateRoleModal = ({ isOpen, onClose, onCreate }) => {
    const [roleName, setRoleName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('blue');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!roleName) return;
        onCreate({ title: roleName, description, color });
        setRoleName('');
        setDescription('');
        onClose();
    };

    const colors = ['blue', 'green', 'purple', 'orange', 'red', 'pink'];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-500" />
                        Create New Role
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Role Name</label>
                        <input
                            type="text"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-600"
                            placeholder="e.g. Senior Editor"
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-600"
                            placeholder="Briefly describe this role..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Role Color</label>
                        <div className="flex gap-2">
                            {colors.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${color === c ? 'border-white scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                                        } bg-${c}-500`}
                                >
                                    {color === c && <Check className="w-4 h-4 text-white" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!roleName}
                            className={`px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 ${!roleName ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
                                }`}
                        >
                            <Shield className="w-4 h-4" />
                            Create Role
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRoleModal;
