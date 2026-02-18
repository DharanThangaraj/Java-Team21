import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationDropdown from "./NotificationDropdown";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleColors = {
    ADMIN: "from-red-600 to-rose-700",
    FACULTY: "from-indigo-600 to-violet-700",
    STUDENT: "from-emerald-600 to-teal-700"
  };

  const gradient = roleColors[user?.role] || "from-indigo-600 to-violet-700";

  return (
    <nav className={`sticky top-0 z-50 bg-gradient-to-r ${gradient} text-white shadow-2xl`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-indigo-100">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-all">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">CampusRes</span>
        </Link>

        <div className="hidden md:flex items-center space-x-1">
          <NavLink to="/" label="Dashboard" />
          {user?.role === 'ADMIN' && <NavLink to="/users" label="Users" />}
          <NavLink to="/booking" label="Bookings" />
          <NavLink to="/resources" label="Resources" />
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4 border-l border-white/20 pl-6">
              <NotificationDropdown user={user} />
              <div className="flex flex-col items-end mr-2">
                <span className="text-xs font-semibold uppercase tracking-wider opacity-80">{user.role}</span>
                <span className="text-sm font-medium text-white">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-bold border border-white/30 transition-all active:scale-95"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-2 rounded-full text-sm font-bold shadow-lg transition-all"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, label }) {
  return (
    <Link
      to={to}
      className="px-4 py-2 rounded-lg hover:bg-white/10 hover:text-white transition-all font-medium"
    >
      {label}
    </Link>
  );
}

export default Navbar;
