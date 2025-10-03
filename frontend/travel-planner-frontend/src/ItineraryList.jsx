import { useEffect, useState } from "react";
import API from "./api";
import DatePicker from "react-datepicker";
import { parseISO, format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

function ItineraryList({ tripId }) {
  const [itineraries, setItineraries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newItinerary, setNewItinerary] = useState({ title: "", date: "", notes: "" });


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
        <div className="space-y-2 mt-2">
          {itineraries.map((it) => (
            <div
              key={it.id}
              className="flex justify-between items-center bg-gray-50 p-2 rounded shadow-sm"
            >
              <div>
                <p className="text-sm text-gray-600">
                  {it.date ? format(parseISO(it.date), "MMM d, yyyy") : ""}
                </p>
                <p className="font-medium">{it.title}</p>
                {it.notes && <p className="text-gray-500 text-sm">{it.notes}</p>}
              </div>
              <button
                onClick={() => deleteItinerary(it.id)}
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Itinerary Form */}
      {showForm ? (
          <form onSubmit={addItinerary} className="mt-3 space-y-2 bg-white p-3 rounded shadow">
            <input
              type="text"
              placeholder="Title"
              value={newItinerary.title}
              onChange={(e) => setNewItinerary({ ...newItinerary, title: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
            <DatePicker
              selected={newItinerary.date ? parseISO(newItinerary.date) : null}
              onChange={(date) => {
                if (date) {
                  setNewItinerary((prev) => ({ ...prev, date: format(date, "yyyy-MM-dd") }));
                }
              }}
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
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                Add
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="mt-3 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            + Add Itinerary
          </button>
        )}

    </div>
  );
}

export default ItineraryList;
