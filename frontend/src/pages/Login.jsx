import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Updated import
import { Lock, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';

const Login = () => {
    const [loginType, setLoginType] = useState('employee'); // 'employee' or 'admin'
    const [email, setEmail] = useState('employee@test.com');
    const [password, setPassword] = useState('OperixUser2026!');
    const { login } = useAuth(); // Use useAuth
    const navigate = useNavigate();

    React.useEffect(() => {
        if (loginType === 'admin') {
            setEmail('admin@test.com');
            setPassword('OperixAdmin2026!');
        } else {
            setEmail('employee@test.com');
            setPassword('OperixUser2026!');
        }
    }, [loginType]);

    const handleSubmit = (e) => {
        e.preventDefault();

        let role = 'employee';
        let name = 'Employee User';
        let isValid = false;

        const cleanEmail = email.trim().toLowerCase();
        const cleanPassword = password.trim();

        if (cleanEmail === 'admin@test.com' && cleanPassword === 'OperixAdmin2026!') {
            role = 'admin';
            name = 'Admin User';
            isValid = true;
        } else if (cleanEmail === 'employee@test.com' && cleanPassword === 'OperixUser2026!') {
            role = 'employee';
            name = 'Sarah Chen';
            isValid = true;
        } else {
            console.log('Login failed:', { cleanEmail, cleanPassword }); // Debugging
            alert(`Invalid credentials. \nExpected: employee@test.com / OperixUser2026!\nReceived: ${cleanEmail} / ${cleanPassword}`);
            isValid = false;
        }

        if (isValid) {
            const userData = { email, name, role, avatar: `https://ui-avatars.com/api/?name=${name}&background=random` };
            login(userData);

            if (loginType === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl"></div>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-500 relative z-10">
                <div className="flex justify-center mb-8">
                    <div className={cn("p-4 rounded-2xl transition-colors duration-300", loginType === 'admin' ? "bg-slate-900 border border-slate-700" : "bg-primary/10")}>
                        {loginType === 'admin' ? (
                            <ShieldAlert className="w-10 h-10 text-blue-500" />
                        ) : (
                            <Lock className="w-10 h-10 text-primary" />
                        )}
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-center mb-2 tracking-tight text-slate-800">
                    {loginType === 'admin' ? 'Admin Portal' : 'Employee Login'}
                </h2>
                <p className="text-slate-500 text-center mb-8">
                    {loginType === 'admin' ? 'Secure functionality management' : 'Welcome back to Operix'}
                </p>

                <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-8 relative">
                    <button
                        type="button"
                        onClick={() => setLoginType('employee')}
                        className={cn(
                            "py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative z-10",
                            loginType === 'employee' ? "text-primary shadow-sm bg-white" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        Employee
                    </button>
                    <button
                        type="button"
                        onClick={() => setLoginType('admin')}
                        className={cn(
                            "py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative z-10",
                            loginType === 'admin' ? "text-blue-600 shadow-sm bg-white" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        Admin
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-slate-700">Email Address</label>
                        <input
                            type="email"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-slate-700">Password</label>
                        <input
                            type="password"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className={cn(
                            "w-full py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl translate-y-0 hover:-translate-y-0.5 active:translate-y-0",
                            loginType === 'admin'
                                ? "bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800"
                                : "bg-primary text-white shadow-primary/25 hover:bg-primary-hover"
                        )}
                    >
                        {loginType === 'admin' ? 'Authenticate System' : 'Sign In to Dashboard'}
                    </button>
                </form>

                <div className="mt-8 text-center text-xs text-slate-400">
                    <p className="font-medium uppercase tracking-wider mb-2">Default Credentials</p>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mx-auto inline-block text-left">
                        <p className="mb-1"><span className="font-semibold">User:</span> employee@test.com / OperixUser2026!</p>
                        <p><span className="font-semibold text-blue-600">Admin:</span> admin@test.com / OperixAdmin2026!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
