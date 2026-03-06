import React, { useState } from 'react';
import { X, CheckCircle, FileText } from 'lucide-react';

const DailySummaryModal = ({ isOpen, onClose }) => {
    const [summary, setSummary] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setTimeout(() => {
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                setSummary('');
                onClose();
            }, 1500);
        }, 500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-border">
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Daily Summary
                    </h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    {submitted ? (
                        <div className="flex flex-col items-center justify-center py-8 text-green-500 animate-in fade-in zoom-in">
                            <CheckCircle className="w-16 h-16 mb-4" />
                            <h3 className="text-lg font-semibold text-foreground">Summary Submitted!</h3>
                            <p className="text-muted-foreground">Great work today.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    What did you accomplish today?
                                </label>
                                <textarea
                                    className="w-full h-32 p-3 rounded-lg border border-border bg-input/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                    placeholder="List your completed tasks and any blockers..."
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 rounded-lg border border-border hover:bg-muted text-foreground font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                                >
                                    Submit Summary
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DailySummaryModal;
