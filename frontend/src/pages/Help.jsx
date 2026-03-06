import React from 'react';
import { Search, ChevronDown, Send, Mail, Phone, ExternalLink, HelpCircle, Book, Video, MessageSquare } from 'lucide-react';

const FAQItem = ({ question }) => (
    <div className="bg-surface border border-border rounded-lg p-4 cursor-pointer hover:bg-slate-800/50 transition-colors group">
        <div className="flex justify-between items-center">
            <span className="font-medium text-foreground">{question}</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
    </div>
);

const ResourceCard = ({ icon: Icon, title, desc }) => (
    <div className="bg-surface border border-border rounded-xl p-6 hover:border-primary/50 transition-colors cursor-pointer group">
        <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
            <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
        </div>
        <h3 className="font-medium text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
);

const Help = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">Help & Support</h1>
                <p className="text-slate-400">Find answers and get assistance</p>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search for help..."
                    className="w-full bg-surface border border-border rounded-xl pl-12 pr-4 py-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-soft"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-4">
                            <HelpCircle className="w-5 h-5 text-primary" />
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-3">
                            <FAQItem question="How do I reset my password?" />
                            <FAQItem question="How can I update my profile information?" />
                            <FAQItem question="How do I request time off?" />
                            <FAQItem question="Can I export my documents?" />
                            <FAQItem question="How do I add a new team member?" />
                            <FAQItem question="What notifications will I receive?" />
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-4">
                            <Book className="w-5 h-5 text-primary" />
                            Resources
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ResourceCard icon={Book} title="Documentation" desc="Comprehensive guides and API references" />
                            <ResourceCard icon={Video} title="Video Tutorials" desc="Step-by-step video walkthroughs" />
                            <ResourceCard icon={FileText} title="Release Notes" desc="Latest updates and feature releases" />
                            <ResourceCard icon={MessageSquare} title="Community Forum" desc="Connect with other users" />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-surface border border-border rounded-xl p-6 shadow-soft">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                            <MessageSquare className="w-5 h-5" />
                            Contact Support
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">Can't find what you're looking for? Send us a message.</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Subject</label>
                                <input type="text" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Brief description of your issue" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Message</label>
                                <textarea className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]" placeholder="Describe your issue in detail..." />
                            </div>
                            <button className="w-full bg-foreground text-background py-2 rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2">
                                <Send className="w-4 h-4" />
                                Send Message
                            </button>
                        </div>
                    </div>

                    <div className="bg-surface border border-border rounded-xl p-6 shadow-soft">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Contact</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                                <Mail className="w-5 h-5 text-muted-foreground" />
                                <span className="text-sm text-foreground">support@operix.com</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                                <Phone className="w-5 h-5 text-muted-foreground" />
                                <span className="text-sm text-foreground">+1 (234) 567-890</span>
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-slate-500 text-center">
                            Support hours: Mon-Fri, 9 AM - 6 PM EST
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
import { FileText } from 'lucide-react';

export default Help;
