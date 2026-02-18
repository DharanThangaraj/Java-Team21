import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const { login } = useAuth();
    const { showToast } = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/users/login", form);
            login(res.data);
            showToast("Login Successful!", "success");
            navigate("/");
        } catch (err) {
            showToast("Invalid credentials", "error");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 left-0 -ml-20 -mt-20 h-96 w-96 rounded-full bg-indigo-500/10 blur-[100px]"></div>
            <div className="absolute bottom-0 right-0 -mr-20 -mb-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[100px]"></div>

            <div className="w-full max-w-lg relative z-10 animate-in fade-in zoom-in duration-700">
                <div className="text-center mb-10">
                    <div className="inline-block p-4 rounded-3xl bg-indigo-600 shadow-2xl shadow-indigo-200 mb-6 active:scale-95 transition-all">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                    </div>
                    <h2 className="text-5xl font-black text-slate-800 tracking-tighter mb-2">Welcome Back</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Enter your details to access the portal</p>
                </div>

                <div className="glass-card rounded-[3rem] p-10 md:p-14 shadow-2xl border-t-8 border-indigo-600">
                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Corporate Email</label>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 p-5 pl-14 rounded-2xl font-bold transition-all"
                                        placeholder="name@university.edu"
                                        required
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Security Code</label>
                                <div className="relative group">
                                    <input
                                        type="password"
                                        className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 p-5 pl-14 rounded-2xl font-bold transition-all"
                                        placeholder="••••••••"
                                        required
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-6 rounded-2xl font-black text-xl shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transition-all active:scale-95"
                        >
                            Sign In To Portal
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                        <p className="text-slate-500 font-bold mb-4">New to the system?</p>
                        <Link
                            to="/signup"
                            className="inline-block py-4 px-10 rounded-2xl border-2 border-indigo-600 text-indigo-600 font-extrabold hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                        >
                            Request Access
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
