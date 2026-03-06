import React from 'react';
import { useApp } from '../../context/AppContext';
import { Check, X, Clock, User, FileText, Calendar, Briefcase } from 'lucide-react';

const RequestCard = ({ request, onApprove, onReject }) => {
    const getIcon = () => {
        switch (request.type) {
            case 'add_employee': return <User className="w-5 h-5 text-blue-400" />;
            case 'add_task': return <Briefcase className="w-5 h-5 text-purple-400" />;
            case 'time_off': return <Calendar className="w-5 h-5 text-orange-400" />;
            default: return <FileText className="w-5 h-5 text-slate-400" />;
        }
    };

    return (
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in slide-in-from-bottom-2 fade-in duration-300">
            <div className="flex gap-4">
                <div className="bg-slate-900 p-3 rounded-lg h-fit">
                    {getIcon()}
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{request.title}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-medium border border-yellow-500/20">
                            Pending
                        </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{request.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {request.submitterName}
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {request.timestamp}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
                <button
                    onClick={() => onReject(request.id)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
                >
                    <X className="w-4 h-4" />
                    Reject
                </button>
                <button
                    onClick={() => onApprove(request.id)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20"
                >
                    <Check className="w-4 h-4" />
                    Approve
                </button>
            </div>
        </div>
    );
};

const AdminRequests = () => {
    const { requests, approveRequest, rejectRequest } = useApp();
    const pendingRequests = requests.filter(r => r.status === 'pending');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Pending Requests</h1>
                <p className="text-slate-400">Review and manage employee requests</p>
            </div>

            <div className="grid gap-4">
                {pendingRequests.length === 0 ? (
                    <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-800 border-dashed">
                        <Check className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-300">All caught up!</h3>
                        <p className="text-slate-500">No pending requests to review.</p>
                    </div>
                ) : (
                    pendingRequests.map(req => (
                        <RequestCard
                            key={req.id}
                            request={req}
                            onApprove={approveRequest}
                            onReject={rejectRequest}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminRequests;
