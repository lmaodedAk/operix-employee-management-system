import React from 'react';
import Modal from '../ui/Modal';
import { AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", isDestructive = false }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    {isDestructive && (
                        <div className="p-2 bg-red-100 rounded-full flex-shrink-0">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                    )}
                    <div>
                        <p className="text-slate-300 leading-relaxed">
                            {message}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={cn(
                            "px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-lg",
                            isDestructive
                                ? "bg-red-600 hover:bg-red-700 text-white shadow-red-900/20"
                                : "bg-primary hover:bg-primary-hover text-white shadow-primary/20"
                        )}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;
