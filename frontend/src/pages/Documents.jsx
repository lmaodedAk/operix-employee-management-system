import React, { useState, useRef } from 'react';
import { FileText, Download, MoreVertical, FileSpreadsheet, File, Send, MessageSquare, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/ui/Modal';
import { cn } from '../lib/utils';

const Documents = () => {
    const { team, addNotification } = useApp();
    const fileInputRef = useRef(null);

    const [docs, setDocs] = useState([
        { id: 1, name: 'Q4 Financial Report.pdf', size: '2.4 MB', type: 'pdf', user: 'Akshat Jain' },
        { id: 2, name: 'Employee Handbook v2.1.pdf', size: '5.1 MB', type: 'pdf', user: 'Rahul Bose' },
        { id: 3, name: 'Product Roadmap 2024.xlsx', size: '1.8 MB', type: 'xlsx', user: 'Amit Shah' },
        { id: 4, name: 'Brand Guidelines.pdf', size: '12.3 MB', type: 'pdf', user: 'Meera Nair' },
    ]);

    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [recipient, setRecipient] = useState('');
    const [comment, setComment] = useState('');

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const newDoc = {
                id: Date.now(),
                name: file.name,
                size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                type: file.name.split('.').pop(),
                user: 'You' // Current user
            };
            setDocs(prev => [newDoc, ...prev]);

            addNotification({
                iconType: 'documents',
                title: 'File Uploaded',
                description: `${file.name} was successfully uploaded.`,
                category: 'Work'
            });
        }
    };

    const openShareModal = (doc) => {
        setSelectedDoc(doc);
        setShareModalOpen(true);
        setRecipient('');
        setComment('');
    };

    const handleShare = () => {
        if (!recipient) return;

        setDocs(prev => prev.map(d => d.id === selectedDoc.id ? {
            ...d,
            sentTo: recipient,
            status: 'Sent',
            lastComment: comment
        } : d));

        addNotification({
            iconType: 'people',
            title: 'Document Shared',
            description: `${selectedDoc.name} sent to ${recipient}`,
            category: 'Work'
        });

        setShareModalOpen(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Documents</h1>
                    <p className="text-slate-400">Manage and organize your files</p>
                </div>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-glow"
                >
                    <Upload className="w-4 h-4" />
                    Upload New
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                />
            </div>

            <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-soft">
                <div className="divide-y divide-border">
                    {docs.map((doc) => (
                        <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center p-4 hover:bg-slate-800/30 transition-colors group gap-4">
                            <div className="flex items-center flex-1 min-w-0">
                                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center mr-4 shrink-0">
                                    {doc.type === 'pdf' ? <FileText className="w-5 h-5 text-red-400" /> :
                                        doc.type === 'xlsx' ? <FileSpreadsheet className="w-5 h-5 text-green-400" /> :
                                            <File className="w-5 h-5 text-blue-400" />}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-sm font-medium text-white truncate">{doc.name}</h4>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                                        <span>{doc.size}</span>
                                        <span>•</span>
                                        <span>Uploaded by {doc.user}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 justify-between sm:justify-end w-full sm:w-auto">
                                {doc.sentTo && (
                                    <div className="text-xs text-right hidden md:block">
                                        <div className="text-primary font-medium flex items-center gap-1 justify-end">
                                            <Send className="w-3 h-3" /> Sent to {doc.sentTo}
                                        </div>
                                        {doc.lastComment && (
                                            <div className="text-slate-500 max-w-[150px] truncate" title={doc.lastComment}>
                                                "{doc.lastComment}"
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => openShareModal(doc)}
                                        className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700 flex items-center gap-2"
                                    >
                                        <Send className="w-3 h-3" /> Share
                                    </button>

                                    <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
                title={`Share ${selectedDoc?.name}`}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Send to Authority</label>
                        <select
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                        >
                            <option value="">Select a recipient...</option>
                            {team.map(member => (
                                <option key={member.id} value={member.name}>{member.name} ({member.role})</option>
                            ))}
                            <option value="HR Director">HR Director</option>
                            <option value="Compliance Officer">Compliance Officer</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Add a Comment</label>
                        <textarea
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]"
                            placeholder="Please review this document..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={() => setShareModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleShare}
                            disabled={!recipient}
                            className="px-4 py-2 text-sm font-medium bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Send Document
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Documents;
