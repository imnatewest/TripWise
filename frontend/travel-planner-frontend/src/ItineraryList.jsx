import { useEffect, useState } from "react";
import API from "./api";
import DatePicker from "react-datepicker";
import { parseISO, format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";


function ItineraryList({ tripId }) {
  const [itineraries, setItineraries] = useState([]);
  const [newItinerary, setNewItinerary] = useState({ title: "", date: "", notes: "" });
  const [newDate, setNewDate] = useState("");

  useEffect(() => {
    API.get(`/trips/${tripId}/itineraries`)
      .then((res) => setItineraries(res.data))
      .catch(console.error);
  }, [tripId]);

  const addItinerary = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/trips/${tripId}/itineraries`, newItinerary);
      setItineraries((prev) => [...prev, res.data]);
      setNewItinerary({ title: "", date: "", notes: "" });
    } catch (err) {
      alert("Failed to add itinerary");
    }
  };

  const deleteItinerary = async (id) => {
    try {
      await API.delete(`/trips/${tripId}/itineraries/${id}`);
      setItineraries((prev) => prev.filter((it) => it.id !== id));
    } catch (err) {
      alert("Failed to delete itinerary");
    }
  };

  return (
    <div className="mt-4">
      <h3 className="font-bold">Itinerary</h3>
      {itineraries.length === 0 ? (
        <p className="text-gray-500">No plans yet</p>
      ) : (
        <ul className="list-disc list-inside space-y-1">
          {itineraries.map((it) => (
            <li key={it.id} className="flex justify-between items-center">
              <span>
                <span className="font-semibold">{it.date}:</span> {it.title} — {it.notes}
              </span>
              <button
                onClick={() => deleteItinerary(it.id)}
                className="bg-red-600 text-white px-2 py-1 rounded ml-4"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add Itinerary Form */}
      <form onSubmit={addItinerary} className="mt-3 space-y-2">
        <input
          type="text"
          placeholder="Title"
          value={newItinerary.title}
          onChange={(e) => setNewItinerary({ ...newItinerary, title: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <DatePicker
          selected={newDate ? parseISO(newDate) : null}
          onChange={(date) => setNewDate(format(date, "yyyy-MM-dd"))}
          dateFormat="MMM d, yyyy"
          placeholderText="Select a date"
          className="w-full p-2 border rounded placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Notes"
          value={newItinerary.notes}
          onChange={(e) => setNewItinerary({ ...newItinerary, notes: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">
          Add Itinerary
        </button>
      </form>
    </div>
  );
}

export default ItineraryList;
