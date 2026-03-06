import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { useApp } from '../../context/AppContext';

const SendUpdateModal = ({ isOpen, onClose }) => {
    const { addNotification } = useApp();
    const [message, setMessage] = useState('');
    const [department, setDepartment] = useState('All');
    const [loading, setLoading] = useState(false);

    const departments = [
        'All', 'Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Legal', 'IT'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        await new Promise(resolve => setTimeout(resolve, 800));

        await addNotification({
            iconType: 'alert',
            title: `Update Sent to ${department}`,
            description: message.length > 50 ? message.substring(0, 50) + '...' : message,
            category: 'System'
        });

        setLoading(false);
        onClose();
        setMessage('');
        setDepartment('All');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Send Team Update">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Target Department</label>
                    <select
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                    >
                        {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Update Message</label>
                    <textarea
                        required
                        rows="4"
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        placeholder="What's the update? e.g. 'Q1 Goals have been smashed!'"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
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
                        disabled={loading || !message.trim()}
                        className="px-4 py-2 text-sm font-medium bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send Update'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default SendUpdateModal;
