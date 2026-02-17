import Navbar from "../components/Navbar";

function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="p-10 bg-gray-100 min-h-screen">
        <h2 className="text-3xl font-bold mb-8">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold text-indigo-600">Users</h3>
            <p className="mt-2 text-gray-500">Manage students & staff</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold text-green-600">Resources</h3>
            <p className="mt-2 text-gray-500">Labs, Classrooms, Halls</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold text-red-600">Bookings</h3>
            <p className="mt-2 text-gray-500">Reserve campus resources</p>
          </div>

        </div>
      </div>
    </>
  );
}

export default Dashboard;
