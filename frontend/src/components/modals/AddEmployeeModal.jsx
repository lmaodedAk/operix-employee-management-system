import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { useApp } from '../../context/AppContext';

const AddEmployeeModal = ({ isOpen, onClose }) => {
    const { addEmployee } = useApp();
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        phone: '', // Added phone state
        department: 'Engineering',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await addEmployee(formData);
        setLoading(false);
        onClose();
        setFormData({ name: '', role: '', phone: '', email: '', dob: '', department: 'Engineering' }); // Reset
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Employee">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="e.g. Alex Morgan"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Role</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="e.g. Senior Developer"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Phone</label>
                    <input
                        type="tel"
                        required
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="+1 234 567 890"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                    <input
                        type="email"
                        required
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="e.g. alex@operix.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Date of Birth</label>
                    <input
                        type="date"
                        required
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Department</label>
                    <select
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    >
                        <option value="Engineering">Engineering</option>
                        <option value="Product">Product</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="HR">HR</option>
                    </select>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                        {loading ? 'Adding...' : 'Add Employee'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddEmployeeModal;
