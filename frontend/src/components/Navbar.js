import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-lg">
      <h1 className="text-xl font-bold">Campus Resource</h1>
      <div className="space-x-6">
        <Link to="/" className="hover:text-gray-200">Dashboard</Link>
        <Link to="/users" className="hover:text-gray-200">Users</Link>
        <Link to="/resources" className="hover:text-gray-200">Resources</Link>
        <Link to="/booking" className="hover:text-gray-200">Booking</Link>
      </div>
    </div>
  );
}

export default Navbar;
