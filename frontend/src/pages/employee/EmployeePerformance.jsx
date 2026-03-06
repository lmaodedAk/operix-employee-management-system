import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Star, TrendingUp, Award, Target, Calendar, CheckCircle, ArrowUpRight } from 'lucide-react';

const EmployeePerformance = () => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        if (!user) return;
        const saved = localStorage.getItem('operix_reviews');
        if (saved) {
            const allReviews = JSON.parse(saved);
            const myReviews = allReviews.filter(r => r.employeeId === user.id || r.employeeName === user.name);
            setReviews(myReviews);
        }
    }, [user]);

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    const latestReview = reviews.length > 0 ? reviews[0] : null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Performance</h1>
                    <p className="text-slate-400">Growth & Development</p>
                </div>
                <button className="flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300">
                    View Goals <ArrowUpRight className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl border border-blue-500/30 p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-200 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-500/30 mb-4 inline-block">
                                Latest Assessment
                            </span>
                            <h2 className="text-4xl font-bold text-white mb-2">Keep up the good work!</h2>
                            <p className="text-blue-200 max-w-md">
                                You are performing above expectations in most areas. Your dedication to the team is highly verified.
                            </p>

                            <div className="flex gap-4 mt-8">
                                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 min-w-[120px]">
                                    <p className="text-xs text-blue-200 uppercase mb-1">Overall Score</p>
                                    <p className="text-3xl font-bold text-white">{latestReview ? latestReview.rating : 'N/A'}<span className="text-sm text-blue-300">/5</span></p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 min-w-[120px]">
                                    <p className="text-xs text-blue-200 uppercase mb-1">Goal Completion</p>
                                    <p className="text-3xl font-bold text-white">92<span className="text-sm text-blue-300">%</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="50%" cy="50%" r="45%" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="transparent" />
                                <circle cx="50%" cy="50%" r="45%" stroke="#60a5fa" strokeWidth="8" fill="transparent" strokeDasharray={283} strokeDashoffset={283 - (283 * (latestReview ? latestReview.rating : 0) / 5)} strokeLinecap="round" className="drop-shadow-[0_0_10px_rgba(96,165,250,0.5)] transition-all duration-1000" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 mb-1" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                            <Target className="w-5 h-5 text-purple-400" />
                            Key Competencies
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Communication', val: 90, color: 'bg-blue-500' },
                                { label: 'Technical Skill', val: 85, color: 'bg-purple-500' },
                                { label: 'Teamwork', val: 95, color: 'bg-green-500' },
                                { label: 'Punctuality', val: 78, color: 'bg-yellow-500' }
                            ].map((skill, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs font-medium text-slate-400 mb-1">
                                        <span>{skill.label}</span>
                                        <span className="text-white">{skill.val}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${skill.color}`} style={{ width: `${skill.val}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold text-white mb-6">Review History</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-slate-500">No reviews yet</div>
                    ) : (
                        reviews.map(review => (
                            <div key={review.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-slate-500 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-slate-700/50 rounded-lg group-hover:bg-slate-700 transition-colors">
                                        <Award className="w-6 h-6 text-yellow-500" />
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium">{new Date(review.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-end gap-2 mb-2">
                                    <h4 className="text-3xl font-bold text-white">{review.rating}</h4>
                                    <span className="text-sm text-slate-500 mb-1">/ 5.0</span>
                                </div>
                                <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <div key={s} className={`h-1 flex-1 rounded-full ${review.rating >= s ? 'bg-yellow-500' : 'bg-slate-700'}`}></div>
                                    ))}
                                </div>
                                <p className="text-slate-300 text-sm line-clamp-3">
                                    "{review.feedback}"
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeePerformance;
