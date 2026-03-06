import React, { useState } from 'react';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Filter, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import NewRequestModal from '../../components/modals/NewRequestModal';

const RequestCard = ({ request }) => {
    const statusConfig = {
        pending: { color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: Clock, label: 'Pending' },
        approved: { color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle, label: 'Approved' },
        rejected: { color: 'text-red-500 bg-red-500/10 border-red-500/20', icon: XCircle, label: 'Rejected' }
    };

    const config = statusConfig[request.status] || statusConfig.pending;
    const StatusIcon = config.icon;

    return (
        <div className="bg-surface border border-border rounded-xl p-5 hover:border-primary/50 transition-all group shadow-soft">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-secondary rounded-lg text-primary">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{request.title}</h4>
                        <p className="text-xs text-muted-foreground">{request.timestamp || 'Recently'}</p>
                    </div>
                </div>
                <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider", config.color)}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {config.label}
                </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {request.description}
            </p>

            <div className="pt-4 border-t border-border flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Type: {request.type?.replace('_', ' ')}
                </span>
                {request.status === 'pending' && (
                    <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                        Awaiting Admin Review
                    </span>
                )}
            </div>
        </div>
    );
};

const MyRequests = () => {
    const { requests, loading } = useApp();
    const [filter, setFilter] = useState('all');
    const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);

    const filteredRequests = filter === 'all'
        ? requests
        : requests.filter(r => r.status === filter);

    const stats = {
        all: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        approved: requests.filter(r => r.status === 'approved').length,
        rejected: requests.filter(r => r.status === 'rejected').length
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">My Requests</h1>
                    <p className="text-muted-foreground">Track and manage your requests to the administration.</p>
                </div>
                <button
                    onClick={() => setIsNewRequestModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    New Request
                </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {['all', 'pending', 'approved', 'rejected'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            "px-5 py-2.5 rounded-full text-sm font-bold transition-all border whitespace-nowrap flex items-center gap-2",
                            filter === f
                                ? "bg-foreground text-background border-foreground shadow-md"
                                : "bg-surface text-muted-foreground border-border hover:border-primary/50"
                        )}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                        <span className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded-full",
                            filter === f ? "bg-background/20" : "bg-muted"
                        )}>
                            {stats[f]}
                        </span>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRequests.length > 0 ? (
                    filteredRequests.map(request => (
                        <RequestCard key={request.id} request={request} />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-surface rounded-2xl border border-dashed border-border group hover:border-primary/30 transition-colors">
                        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                            <AlertCircle className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">No Requests Found</h3>
                        <p className="text-muted-foreground max-w-xs mx-auto">
                            {filter === 'all'
                                ? "You haven't submitted any requests yet."
                                : `You don't have any ${filter} requests at the moment.`}
                        </p>
                    </div>
                )}
            </div>

            <NewRequestModal
                isOpen={isNewRequestModalOpen}
                onClose={() => setIsNewRequestModalOpen(false)}
            />
        </div>
    );
};

export default MyRequests;
