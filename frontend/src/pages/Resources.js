import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

function Resources() {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({ name: "", type: "", capacity: "" });
  const [editingId, setEditingId] = useState(null);
  const { showToast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/resources");
      setResources(res.data);
    } catch (err) {
      showToast("Failed to fetch resources", "error");
    }
    setLoading(false);
  }, [showToast]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/resources/${editingId}`, form);
        showToast("Resource updated successfully!", "success");
      } else {
        await api.post("/resources", form);
        showToast("Resource added successfully!", "success");
      }
      setForm({ name: "", type: "", capacity: "" });
      setEditingId(null);
      fetchResources();
    } catch (err) {
      showToast("Action failed", "error");
    }
  };

  const handleEdit = (resource) => {
    setForm({ name: resource.name, type: resource.type, capacity: resource.capacity });
    setEditingId(resource.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-12">
        <header className="border-b border-slate-200 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Campus Assets</h2>
            <p className="text-slate-500 font-medium italic">Configure and manage shared resources across the campus.</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-6 py-3">
            <span className="text-indigo-600 font-black text-2xl">{resources.length}</span>
            <span className="text-indigo-400 font-bold text-xs uppercase ml-2 tracking-widest">Total Active Assets</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Management Form - Only visible to ADMIN */}
          {isAdmin && (
            <aside className="lg:col-span-4 h-fit sticky top-28">
              <div className="glass-card rounded-[2.5rem] p-8 border-t-8 border-indigo-600">
                <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center">
                  <span className="bg-indigo-100 p-2 rounded-xl mr-4">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </span>
                  {editingId ? "Modify Asset" : "New Asset"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Asset Label</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 p-4 rounded-2xl font-bold transition-all"
                        placeholder="e.g., Seminar Hall A"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                      <select
                        className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 p-4 rounded-2xl font-bold transition-all"
                        required
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                      >
                        <option value="">Select Category...</option>
                        <option value="CLASSROOM">Classroom</option>
                        <option value="LABORATORY">Laboratory</option>
                        <option value="CONFERENCE_ROOM">Conference Room</option>
                        <option value="EQUIPMENT">Special Equipment</option>
                        <option value="OTHER">Other Space</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Max Occupancy</label>
                      <input
                        type="number"
                        className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 p-4 rounded-2xl font-bold transition-all"
                        placeholder="0"
                        required
                        min="1"
                        value={form.capacity}
                        onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3">
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transition-all active:scale-95"
                    >
                      {editingId ? "Save Changes" : "Create Asset"}
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={() => { setEditingId(null); setForm({ name: "", type: "", capacity: "" }); }}
                        className="text-slate-400 hover:text-slate-600 text-sm font-bold p-2"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </aside>
          )}

          {/* List Section - Spans full width if not admin */}
          <main className={`${isAdmin ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col gap-6`}>
            <div className={`grid grid-cols-1 ${isAdmin ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6`}>
              {resources.length === 0 && !loading ? (
                <div className="col-span-full py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300">
                  <svg className="w-20 h-20 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  <p className="text-xl font-black italic">No assets registered yet</p>
                </div>
              ) : (
                resources.map(r => (
                  <div key={r.id} className="group glass-card rounded-[2.5rem] p-8 hover:shadow-2xl hover:border-indigo-100 transition-all border-l-8 border-l-slate-200 hover:border-l-indigo-500 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all`}>
                        {r.type?.replace('_', ' ')}
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => handleEdit(r)}
                          className="p-3 rounded-2xl text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-90 shadow-sm border border-slate-100 bg-white"
                          title="Edit Resource"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                      )}
                    </div>

                    <h4 className="text-2xl font-black text-slate-800 mb-2 truncate">{r.name}</h4>

                    <div className="flex items-center space-x-4 pt-4 border-t border-slate-50 mt-4">
                      <div className="flex -space-x-2 overflow-hidden">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-200 border border-white"></div>
                        ))}
                      </div>
                      <span className="text-sm font-bold text-slate-400">Up to <span className="text-indigo-600">{r.capacity}</span> guests</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default Resources;
