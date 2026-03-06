import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { useApp } from '../../context/AppContext';

const NewRequestModal = ({ isOpen, onClose }) => {
    const { createRequest } = useApp();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('time_off');
    const [loading, setLoading] = useState(false);

    const requestTypes = [
        { id: 'time_off', label: 'Time Off' },
        { id: 'hardware', label: 'Hardware/Equipment' },
        { id: 'expense', label: 'Expense Reimbursement' },
        { id: 'other', label: 'Other Request' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        await createRequest(type, title, description, {});

        setLoading(false);
        onClose();
        setTitle('');
        setDescription('');
        setType('time_off');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Submit New Request">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Request Type</label>
                    <select
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        {requestTypes.map(t => (
                            <option key={t.id} value={t.id}>{t.label}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                    <input
                        required
                        type="text"
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="e.g. Vacation in July"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                    <textarea
                        required
                        rows="4"
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        placeholder="Provide details about your request..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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
                        disabled={loading || !title.trim() || !description.trim()}
                        className="px-4 py-2 text-sm font-medium bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default NewRequestModal;
