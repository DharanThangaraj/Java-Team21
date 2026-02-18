import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { useToast } from "../context/ToastContext";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "" });
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (form.password.length <= 6) {
      showToast("Password must be more than 6 characters", "error");
      return;
    }
    try {
      await api.post("/users", form);
      showToast("Signup Successful! Please login.", "success");
      navigate("/login");
    } catch (err) {
      showToast("Email already exists or signup failed", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-indigo-500/10 blur-[100px]"></div>

      <div className="w-full max-w-2xl relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <div className="inline-block p-4 rounded-3xl bg-indigo-600 shadow-2xl shadow-indigo-200 mb-6 active:scale-95 transition-all">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="text-5xl font-black text-slate-800 tracking-tighter mb-2">Create Account</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Join our campus resource community</p>
        </div>

        <div className="glass-card rounded-[3rem] p-10 md:p-14 shadow-2xl border-t-8 border-indigo-600">
          <form onSubmit={handleSignup} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="col-span-1">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Full Legal Name</label>
                <div className="relative group">
                  <input
                    type="text"
                    className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 p-5 pl-14 rounded-2xl font-bold transition-all"
                    placeholder="John Doe"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                  </div>
                </div>
              </div>

              <div className="col-span-1">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Campus Email</label>
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

              <div className="col-span-1">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Secure Password</label>
                <div className="relative group">
                  <input
                    type="password"
                    className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 p-5 pl-14 rounded-2xl font-bold transition-all"
                    placeholder="Min 7 characters"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                  </div>
                </div>
              </div>

              <div className="col-span-1">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Access Role</label>
                <div className="relative group">
                  <select
                    className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 p-5 pl-14 rounded-2xl font-bold appearance-none outline-none transition-all"
                    required
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="">Select Role...</option>
                    <option value="STUDENT">Student</option>
                    <option value="FACULTY">Faculty</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                  </div>
                  <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-6 rounded-2xl font-black text-xl shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transition-all active:scale-95"
            >
              Initialize Profile
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 font-bold mb-4">Already have security clearance?</p>
            <Link to="/login" className="text-indigo-600 font-black text-lg hover:underline decoration-2 underline-offset-4">Sign In to Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
