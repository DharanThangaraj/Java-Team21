import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import NotificationSection from "../components/NotificationSection";
import ResourceDetailModal from "../components/ResourceDetailModal";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalResources: 0,
    availableResources: 0,
    bookedResources: 0,
    totalList: [],
    availableList: [],
    bookedList: []
  });

  const [modal, setModal] = useState({ isOpen: false, title: "", items: [], type: "" });

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get("/resources/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const roleGradients = {
    ADMIN: "from-rose-500 to-red-600 shadow-rose-200",
    FACULTY: "from-indigo-500 to-violet-600 shadow-indigo-200",
    STUDENT: "from-emerald-500 to-teal-600 shadow-emerald-200"
  };

  const currentGradient = roleGradients[user?.role] || roleGradients.STUDENT;

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10">

        {/* Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 md:p-12 text-white shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 text-slate-300">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-2 tracking-tight text-white">
                Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{user?.name}</span>!
              </h2>
              <p className="text-lg opacity-80 font-medium">Your gateway to campus resources.</p>
            </div>
            <div className={`flex items-center space-x-3 px-6 py-3 rounded-2xl bg-gradient-to-br ${currentGradient} shadow-lg ring-1 ring-white/20`}>
              <div className="h-3 w-3 rounded-full bg-white animate-pulse"></div>
              <span className="text-sm font-bold uppercase tracking-widest text-white">{user?.role} PORTAL</span>
            </div>
          </div>
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
        </div>

        {/* Stats Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold tracking-tight text-slate-800">System Overview</h3>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 uppercase tracking-wider">
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping"></span>
              <span>Live Monitor</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              label="Total Resources"
              value={stats.totalResources}
              icon={<path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />}
              color="blue"
              onClick={() => setModal({ isOpen: true, title: "Total Resources", items: stats.totalList, type: "total" })}
            />
            <StatCard
              label="Available Now"
              value={stats.availableResources}
              icon={<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
              color="emerald"
              onClick={() => setModal({ isOpen: true, title: "Available Resources", items: stats.availableList, type: "available" })}
            />
            <StatCard
              label="Active Bookings"
              value={stats.bookedResources}
              icon={<path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
              color="orange"
              onClick={() => setModal({ isOpen: true, title: "Currently Booked", items: stats.bookedList, type: "booked" })}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {user?.role === 'ADMIN' && (
            <QuickActionCard
              to="/users"
              title="User Management"
              desc="Oversee all campus members and permissions"
              role="ADMIN"
            />
          )}
          <QuickActionCard
            to="/booking"
            title="Book Resources"
            desc="Reserve equipment, halls, or classrooms"
            role={user?.role}
          />
        </div>

        <NotificationSection />

        <ResourceDetailModal
          isOpen={modal.isOpen}
          onClose={() => setModal({ ...modal, isOpen: false })}
          title={modal.title}
          items={modal.items}
          type={modal.type}
        />
      </div>
    </>
  );
}

function StatCard({ label, value, icon, color, onClick }) {
  const colors = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    orange: "text-orange-600 bg-orange-50 border-orange-100"
  };

  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden glass-card p-8 rounded-[2rem] text-left hover:shadow-2xl hover:-translate-y-1 transition-all"
    >
      <div className={`p-4 rounded-2xl w-fit mb-6 ${colors[color]} ring-1 ring-inset`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
      </div>
      <div>
        <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2 transition-premium group-hover:text-slate-700">{label}</h3>
        <p className={`text-4xl font-black tracking-tight ${color === 'blue' ? 'text-slate-900' : 'text-' + color + '-600'}`}>{value}</p>
      </div>
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-premium">
        <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
      </div>
    </button>
  );
}

function QuickActionCard({ to, title, desc, role }) {
  return (
    <Link
      to={to}
      className="group p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all flex items-center justify-between"
    >
      <div className="space-y-2 text-slate-400">
        <h3 className="text-xl font-bold text-slate-800 transition-premium group-hover:text-indigo-600">{title}</h3>
        <p className="font-medium">{desc}</p>
      </div>
      <div className="p-4 rounded-full bg-slate-50 group-hover:bg-indigo-50 transition-premium">
        <svg className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
    </Link>
  );
}

export default Dashboard;
