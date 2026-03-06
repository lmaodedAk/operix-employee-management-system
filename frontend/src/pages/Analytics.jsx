import React from 'react';
import { TrendingUp, Users, Clock, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../lib/utils';

const StatBox = ({ title, value, change, icon: Icon, trend }) => (
    <div className="bg-surface p-6 rounded-xl border border-border hover:border-primary/20 transition-all duration-300 group">
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-lg ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                <Icon className="w-6 h-6" />
            </div>
            <span className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                trend === 'up' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
            )}>
                {change}
                {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            </span>
        </div>
        <div className="text-3xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{value}</div>
        <div className="text-sm text-muted-foreground font-medium">{title}</div>
    </div>
);

const BarChart = ({ data }) => (
    <div className="h-64 flex items-end gap-2 sm:gap-4 mt-8 px-2">
        {data.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full relative h-[200px] flex items-end">
                    <div
                        className="w-full bg-primary/20 rounded-t-sm hover:bg-primary transition-all duration-500 group-hover:shadow-[0_0_20px_-5px_var(--tw-shadow-color)] shadow-primary/30"
                        style={{ height: `${item.height}%` }}
                    >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface border border-border text-xs font-bold text-foreground px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl">
                            {item.value}
                            <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2 h-2 bg-surface border-r border-b border-border rotate-45"></div>
                        </div>
                    </div>
                </div>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{item.label}</span>
            </div>
        ))}
    </div>
);

const LineChart = () => (
    <div className="h-64 mt-8 relative flex items-end w-full">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
            {[0, 25, 50, 75, 100].map(y => (
                <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 4" />
            ))}

            <defs>
                <linearGradient id="gradientGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
            </defs>

            <path
                d="M0,60 L20,55 L40,50 L60,60 L80,45 L100,50 L100,100 L0,100 Z"
                fill="url(#gradientGreen)"
            />

            <polyline
                points="0,60 20,55 40,50 60,60 80,45 100,50"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                className="drop-shadow-lg"
            />

            {[0, 20, 40, 60, 80, 100].map((x, i) => {
                const ys = [60, 55, 50, 60, 45, 50];
                return (
                    <circle
                        key={x}
                        cx={x}
                        cy={ys[i]}
                        r="3"
                        fill="#surface"
                        stroke="#10b981"
                        strokeWidth="2"
                        className="hover:r-4 transition-all"
                    />
                )
            })}
        </svg>

        <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
        </div>
    </div>
);

const Analytics = () => {
    const productivityData = [
        { label: 'Mon', value: '82%', height: 82 },
        { label: 'Tue', value: '88%', height: 88 },
        { label: 'Wed', value: '94%', height: 94 },
        { label: 'Thu', value: '85%', height: 85 },
        { label: 'Fri', value: '78%', height: 78 },
    ];

    const growthData = [
        { label: 'Jan', value: '+12', height: 40 },
        { label: 'Feb', value: '+15', height: 45 },
        { label: 'Mar', value: '+22', height: 50 },
        { label: 'Apr', value: '+28', height: 60 },
        { label: 'May', value: '+35', height: 75 },
        { label: 'Jun', value: '+42', height: 96 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-1">Insightful Operations Hub</h1>
                    <p className="text-muted-foreground">Real-time performance metrics and team analytics</p>
                </div>
                <div className="flex bg-surface border border-border rounded-lg p-1">
                    <button className="px-4 py-1.5 text-sm font-medium bg-background text-foreground shadow-sm rounded-md transition-all">Overview</button>
                    <button className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-all">Reports</button>
                    <button className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-all">Settings</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatBox title="Total Employees" value="2,847" change="+12.5%" icon={Users} trend="up" />
                <StatBox title="Avg. Productivity" value="87.3%" change="+5.2%" icon={TrendingUp} trend="up" />
                <StatBox title="Avg. Work Hours" value="7.8h" change="-2.1%" icon={Clock} trend="down" />
                <StatBox title="Goals Completed" value="156" change="+18.7%" icon={Target} trend="up" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-surface p-6 rounded-xl border border-border shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-foreground">Employee Growth</h3>
                            <p className="text-muted-foreground text-sm">Monthly headcount trajectory</p>
                        </div>
                        <span className="bg-emerald-500/10 text-emerald-500 text-sm font-bold px-3 py-1 rounded-full">+32.4%</span>
                    </div>
                    <BarChart data={growthData} />
                </div>

                <div className="bg-surface p-6 rounded-xl border border-border shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-foreground mb-1">Department Distribution</h3>
                    <p className="text-muted-foreground text-sm mb-6">Team composition breakdown</p>

                    <div className="relative w-48 h-48 mx-auto mb-8">
                        <svg viewBox="0 0 100 100" className="w-full h-full rotate-[-90deg]">
                            <circle cx="50" cy="50" r="40" stroke="#3b82f6" strokeWidth="12" fill="none" strokeDasharray="251" strokeDashoffset="0" /> {/* Blue 45% */}
                            <circle cx="50" cy="50" r="40" stroke="#10b981" strokeWidth="12" fill="none" strokeDasharray="251" strokeDashoffset="113" /> {/* Green 30% */}
                            <circle cx="50" cy="50" r="40" stroke="#f59e0b" strokeWidth="12" fill="none" strokeDasharray="251" strokeDashoffset="188" /> {/* Orange 25% */}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-3xl font-bold text-foreground">2.8k</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Total</span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                <span className="text-muted-foreground">Engineering</span>
                            </div>
                            <span className="font-bold text-foreground">45%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                <span className="text-muted-foreground">Product</span>
                            </div>
                            <span className="font-bold text-foreground">30%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                <span className="text-muted-foreground">Design</span>
                            </div>
                            <span className="font-bold text-foreground">25%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
                    <h3 className="text-lg font-bold text-foreground mb-1">Weekly Productivity</h3>
                    <p className="text-muted-foreground text-sm mb-6">Efficiency metrics by day</p>
                    <BarChart data={productivityData} />
                </div>

                <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
                    <h3 className="text-lg font-bold text-foreground mb-1">Hires vs Departures</h3>
                    <p className="text-muted-foreground text-sm mb-6">Long-term retention analytics</p>
                    <LineChart />
                </div>
            </div>
        </div>
    );
};

export default Analytics;
