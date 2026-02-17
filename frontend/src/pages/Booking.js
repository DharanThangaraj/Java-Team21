import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/api";

function Booking() {

  const [form, setForm] = useState({
    userId: "",
    resourceId: "",
    bookingDate: "",
    timeSlot: ""
  });

  const handleSubmit = async () => {
    try {
      const res = await api.post("/bookings", form);
      alert(res.data);
    } catch {
      alert("Booking failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-10 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-6">Book Resource</h2>

        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">

          <input className="border p-2 rounded w-full"
            placeholder="User ID"
            onChange={(e)=>setForm({...form,userId:e.target.value})}
          />

          <input className="border p-2 rounded w-full"
            placeholder="Resource ID"
            onChange={(e)=>setForm({...form,resourceId:e.target.value})}
          />

          <input type="date"
            className="border p-2 rounded w-full"
            onChange={(e)=>setForm({...form,bookingDate:e.target.value})}
          />

          <input className="border p-2 rounded w-full"
            placeholder="Time Slot"
            onChange={(e)=>setForm({...form,timeSlot:e.target.value})}
          />

          <button
            onClick={handleSubmit}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 w-full"
          >
            Confirm Booking
          </button>

        </div>
      </div>
    </>
  );
}

export default Booking;
