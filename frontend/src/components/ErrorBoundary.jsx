import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-background flex items-center justify-center p-4">
                    <div className="bg-surface border border-red-900/50 p-6 rounded-xl max-w-md w-full shadow-2xl text-center">
                        <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
                        <p className="text-slate-400 mb-6 text-sm">
                            We encountered an unexpected error. The application has been protected from crashing completely.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-medium transition-colors w-full"
                        >
                            Reload Application
                        </button>
                        {this.state.error && (
                            <div className="mt-4 p-3 bg-black/50 rounded text-left overflow-auto max-h-32">
                                <code className="text-xs text-red-300 font-mono">
                                    {this.state.error.toString()}
                                </code>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
