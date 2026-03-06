import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, Check, Search, BarChart2 } from 'lucide-react';

const AdminPerformance = () => {
    const { team } = useApp();
    const [reviews, setReviews] = useState([]);
    const [filter, setFilter] = useState('');

    const [activeReviewId, setActiveReviewId] = useState(null); // ID of employee being reviewed
    const [tempRating, setTempRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('operix_reviews');
        if (saved) setReviews(JSON.parse(saved));
    }, []);

    const handleSubmit = (employee) => {
        const newReview = {
            id: Date.now(),
            employeeId: employee.id,
            employeeName: employee.name,
            rating: tempRating || 5,
            feedback: feedbackText,
            date: new Date().toISOString()
        };
        const updated = [newReview, ...reviews];
        setReviews(updated);
        localStorage.setItem('operix_reviews', JSON.stringify(updated));

        setActiveReviewId(null);
        setFeedbackText('');
        setTempRating(0);
    };

    const getLatestReview = (empId) => {
        const empReviews = reviews.filter(r => r.employeeId === empId);
        return empReviews.length > 0 ? empReviews[0] : null; // Start with newest
    };

    const filteredTeam = team.filter(m =>
        m.role !== 'admin' && m.name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Performance Reviews</h1>
                    <p className="text-slate-400">Rate and provide feedback to employees</p>
                </div>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeam.map(emp => {
                    const lastReview = getLatestReview(emp.id);
                    const isReviewing = activeReviewId === emp.id;

                    return (
                        <div key={emp.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-blue-500/50 transition-colors">
                            <div className="p-6 border-b border-slate-700 flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white text-lg">
                                        {emp.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{emp.name}</h3>
                                        <p className="text-sm text-slate-400">{emp.role} &bull; {emp.department}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <Star key={s} className={`w-3 h-3 ${lastReview && lastReview.rating >= s ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
                                            ))}
                                            <span className="text-xs font-bold text-white ml-2">{lastReview ? lastReview.rating : 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 divide-x divide-slate-700 bg-slate-900/50">
                                <div className="p-4 text-center">
                                    <p className="text-xl font-bold text-white">96%</p>
                                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Attendance</p>
                                </div>
                                <div className="p-4 text-center">
                                    <p className="text-xl font-bold text-white">28</p>
                                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Tasks Done</p>
                                </div>
                                <div className="p-4 text-center">
                                    <p className="text-xl font-bold text-white">{lastReview ? lastReview.rating : '-'}</p>
                                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Score</p>
                                </div>
                            </div>

                            <div className="p-6">
                                {isReviewing ? (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                        <div>
                                            <label className="text-xs font-medium text-slate-400 mb-2 block uppercase">Select Rating</label>
                                            <div className="flex justify-between">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <button
                                                        key={star}
                                                        onClick={() => setTempRating(star)}
                                                        className={`p-2 rounded-lg transition-all ${tempRating >= star ? 'bg-yellow-500/10 text-yellow-400' : 'bg-slate-700 text-slate-400'}`}
                                                    >
                                                        <Star className={`w-5 h-5 ${tempRating >= star ? 'fill-current' : ''}`} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-slate-400 mb-2 block uppercase">Feedback</label>
                                            <textarea
                                                value={feedbackText}
                                                onChange={(e) => setFeedbackText(e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-sm text-white h-24 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                                placeholder={`Feedback for ${emp.name}...`}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleSubmit(emp)}
                                                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg text-sm transition-colors"
                                            >
                                                Submit Review
                                            </button>
                                            <button
                                                onClick={() => setActiveReviewId(null)}
                                                className="px-4 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 rounded-lg text-sm transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="text-xs text-slate-500 italic">
                                            Last reviewed: {lastReview ? new Date(lastReview.date).toLocaleDateString() : 'Never'}
                                        </div>
                                        {lastReview && (
                                            <p className="text-sm text-slate-300 line-clamp-2 min-h-[40px]">"{lastReview.feedback}"</p>
                                        )}
                                        <button
                                            onClick={() => {
                                                setActiveReviewId(emp.id);
                                                setTempRating(lastReview ? lastReview.rating : 0);
                                                setFeedbackText(lastReview ? lastReview.feedback : '');
                                            }}
                                            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 rounded-lg text-sm transition-colors"
                                        >
                                            {lastReview ? 'Update Review' : 'Write Review'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminPerformance;
