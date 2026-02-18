import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

function Booking() {
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    resourceId: "",
    startTime: "",
    endTime: "",
    purpose: "",
    participants: ""
  });

  const openRejectModal = (id) => {
    setSelectedBookingId(id);
    setShowRejectModal(true);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/resources");
      setResources(res.data);
      const resB = await api.get("/bookings");
      setBookings(resB.data);
    } catch (err) {
      showToast("Failed to load data", "error");
    }
    setLoading(false);
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.resourceId) return showToast("Select a resource", "warning");

    try {
      await api.post(`/bookings?userId=${user.id}`, {
        ...form,
        participants: parseInt(form.participants)
      });
      showToast("Booking request submitted!", "success");
      setForm({ resourceId: "", startTime: "", endTime: "", purpose: "", participants: "" });
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || "Booking failed", "error");
    }
  };

  const groupedResources = resources.reduce((acc, r) => {
    const type = r.type || "Other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(r);
    return acc;
  }, {});

  const handleApprove = async (id, role) => {
    try {
      const endpoint = role === 'FACULTY' ? 'approve-faculty' : 'approve-admin';
      await api.put(`/bookings/${id}/${endpoint}`);
      showToast("Approved successfully", "success");
      fetchData();
    } catch (err) {
      showToast("Approval failed", "error");
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) return showToast("Please provide a reason", "warning");
    try {
      await api.put(`/bookings/${selectedBookingId}/reject?reason=${rejectionReason}`);
      showToast("Rejected successfully", "success");
      setShowRejectModal(false);
      setRejectionReason("");
      fetchData();
    } catch (err) {
      showToast("Rejection failed", "error");
    }
  };

  const roleColors = {
    ADMIN: "border-red-500 bg-red-50 text-red-700",
    FACULTY: "border-indigo-500 bg-indigo-50 text-indigo-700",
    STUDENT: "border-emerald-500 bg-emerald-50 text-emerald-700"
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-12">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-slate-200 pb-8 space-y-4">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-slate-800 mb-2">Resource Booking</h2>
            <p className="text-slate-500 font-medium">Manage and monitor campus facility reservations.</p>
          </div>
          <div className="flex items-center space-x-2 text-sm font-bold text-slate-400 bg-slate-100 px-4 py-2 rounded-xl">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>All times are in Local Time</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* New Booking Form */}
          <section className="lg:col-span-5 space-y-6">
            <div className="glass-card rounded-[2.5rem] p-8 md:p-10 border-t-8 border-indigo-500">
              <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center">
                <span className="bg-indigo-100 text-indigo-600 p-2 rounded-xl mr-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </span>
                New Reservation
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Resource Select</label>
                  <select
                    className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 p-4 rounded-2xl font-medium transition-all"
                    value={form.resourceId}
                    required
                    onChange={(e) => setForm({ ...form, resourceId: e.target.value })}
                  >
                    <option value="">Select a resource...</option>
                    {Object.keys(groupedResources).map(type => (
                      <optgroup key={type} label={type} className="font-bold text-slate-400">
                        {groupedResources[type].map(r => (
                          <option key={r.id} value={r.id} className="text-slate-800 font-medium">{r.name} (Cap: {r.capacity})</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Arrival</label>
                    <input type="datetime-local"
                      className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 p-4 rounded-2xl font-medium"
                      required
                      value={form.startTime}
                      onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Departure</label>
                    <input type="datetime-local"
                      className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 p-4 rounded-2xl font-medium"
                      required
                      value={form.endTime}
                      onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Booking Goal</label>
                  <textarea
                    className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 p-4 rounded-2xl font-medium"
                    placeholder="Briefly describe the purpose..."
                    rows="3"
                    required
                    value={form.purpose}
                    onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Team Size</label>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 p-4 rounded-2xl font-medium"
                      required
                      min="1"
                      placeholder="Number of participants"
                      value={form.participants}
                      onChange={(e) => setForm({ ...form, participants: e.target.value })}
                    />
                    <div className="absolute inset-y-0 right-0 p-4 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transition-all active:scale-95"
                >
                  Submit Booking Request
                </button>
              </form>
            </div>
          </section>

          {/* Booking List */}
          <section className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold text-slate-800">Reservation History</h3>
              <button
                onClick={fetchData}
                className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
              >
                <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
            </div>

            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
              {bookings.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-300">
                  <p className="text-slate-400 font-bold text-xl italic line-through decoration-indigo-300">No Reservations Found</p>
                </div>
              ) : (
                bookings.map((b) => (
                  <div key={b.id} className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all border-l-8 border-l-slate-200 hover:border-l-indigo-500">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-indigo-600 font-black text-lg border border-slate-100">
                          #{b.id}
                        </div>
                        <div>
                          <h4 className="font-black text-slate-800 text-lg leading-tight">{b.resourceName || 'Resource Removed'}</h4>
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center mt-1">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                            {b.userName || 'Unknown User'}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-medium text-slate-600 bg-slate-50 p-4 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-black">Timeline</p>
                          {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-black">Capacity</p>
                          {b.participants} Attendees
                        </div>
                      </div>
                      <div className="col-span-full pt-2 mt-2 border-t border-slate-200">
                        <p className="text-[10px] text-slate-400 uppercase font-black mb-1">Purpose & Notes</p>
                        <p className="italic text-slate-500">"{b.purpose}"</p>
                      </div>
                      {b.rejectionReason && (
                        <div className="col-span-full bg-rose-50 text-rose-600 p-3 rounded-xl border border-rose-100 mt-2">
                          <p className="text-[10px] uppercase font-black mb-1">Rejection Feedback</p>
                          <p className="font-bold">{b.rejectionReason}</p>
                        </div>
                      )}
                    </div>

                    {/* Role-based actions */}
                    {shouldShowActions(user, b) && (
                      <div className="flex space-x-3 pt-6 mt-6 border-t border-slate-100">
                        <button
                          onClick={() => handleApprove(b.id, user.role)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl shadow-lg shadow-emerald-50 transition-all active:scale-95"
                        >
                          Approve Request
                        </button>
                        <button
                          onClick={() => openRejectModal(b.id)}
                          className="px-6 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-3 rounded-2xl transition-all active:scale-95"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100">
            <h3 className="text-3xl font-black mb-2 text-slate-800">Reject Booking</h3>
            <p className="text-slate-500 font-medium mb-8 text-sm">Please provide constructive feedback for the user regarding this decision.</p>
            <textarea
              className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-rose-500 p-4 rounded-2xl font-medium mb-8"
              rows="4"
              placeholder="e.g., The resource needs maintenance during this slot..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div className="flex space-x-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 font-bold text-slate-400 hover:text-slate-600 transition-all"
              >
                Go Back
              </button>
              <button
                onClick={handleReject}
                className="flex-[2] bg-rose-600 hover:bg-rose-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-rose-100 transition-all active:scale-95"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function StatusBadge({ status }) {
  const config = {
    APPROVED: { bg: "bg-emerald-100 text-emerald-700 ring-emerald-200", label: "Reserved" },
    REJECTED: { bg: "bg-rose-100 text-rose-700 ring-rose-200", label: "Rejected" },
    PENDING_FACULTY: { bg: "bg-amber-100 text-amber-700 ring-amber-200", label: "Faculty Pending" },
    PENDING_ADMIN: { bg: "bg-indigo-100 text-indigo-700 ring-indigo-200", label: "Admin Pending" }
  };
  const { bg, label } = config[status] || config.PENDING_FACULTY;

  return (
    <span className={`${bg} px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ring-1 ring-inset whitespace-nowrap`}>
      {label}
    </span>
  );
}

function shouldShowActions(user, booking) {
  if (user?.role === 'FACULTY' && booking.status === 'PENDING_FACULTY') return true;
  if (user?.role === 'ADMIN' && booking.status === 'PENDING_ADMIN') return true;
  return false;
}

export default Booking;
