import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { useApp } from '../../context/AppContext';

const AddTaskModal = ({ isOpen, onClose, defaultType = 'Task' }) => {
    const { addTask, addNotification } = useApp();
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [assignee, setAssignee] = useState('Me'); // Changed from assignedTo to assignee
    const [type, setType] = useState(defaultType); // Managed separately from other fields
    const [loading, setLoading] = useState(false);

    const [department, setDepartment] = useState('Engineering'); // Default department

    React.useEffect(() => {
        if (isOpen) {
            setType(defaultType);
            setTitle('');
            setDate(new Date().toISOString().split('T')[0]);
            setTime('');
            setLocation('');
            setAssignee('Me');
            setDepartment('Engineering');
        }
    }, [isOpen, defaultType]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        await addTask({
            text: title,
            date,
            time,
            location,
            person: assignee,
            department, // Include department
            type: type,
            completed: false
        });

        if (type === 'Meeting') {
            await addNotification({
                iconType: 'calendar',
                title: 'New Meeting Scheduled',
                description: `${title} (${department}) on ${date} at ${time || 'N/A'}`,
                category: 'Calendar'
            });
        } else {
            await addNotification({
                iconType: 'alert',
                title: 'New Task Assigned',
                description: `${title} assigned to ${assignee} in ${department}`,
                category: 'Work'
            });
        }

        setLoading(false);
        onClose();
        setTitle('');
        setDate(new Date().toISOString().split('T')[0]);
        setTime('');
        setLocation('');
        setAssignee('Me');
        setDepartment('Engineering');
        setType('Task');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Schedule ${type}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder={type === 'Meeting' ? "e.g. Weekly Standup" : "e.g. Fix Login Bug"}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
                        <input
                            type="date"
                            required
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Time</label>
                        <input
                            type="time"
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Location / Link</label>
                        <input
                            type="text"
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="e.g. Room A / Zoom"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Department</label>
                        <select
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        >
                            <option value="Engineering">Engineering</option>
                            <option value="Design">Design</option>
                            <option value="Product">Product</option>
                            <option value="Marketing">Marketing</option>
                            <option value="HR">HR</option>
                            <option value="Sales">Sales</option>
                            <option value="IT">IT</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Assign To</label>
                    <select
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={assignee}
                        onChange={(e) => setAssignee(e.target.value)}
                    >
                        <option value="Me">Me</option>
                        <option value="Team">Entire Team</option>
                        <option value="Sarah Chen">Sarah Chen</option>
                        <option value="Mike Johnson">Mike Johnson</option>
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
                        {loading ? 'Saving...' : `Save ${type}`}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddTaskModal;
