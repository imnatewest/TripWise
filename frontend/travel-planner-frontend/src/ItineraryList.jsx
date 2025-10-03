import { useEffect, useState } from "react";
import API from "./api";
import DatePicker from "react-datepicker";
import { parseISO, format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { MapPin, FileText, Trash2, Calendar, PlusCircle } from "lucide-react";

function ItineraryList({ tripId }) {
  const [itineraries, setItineraries] = useState([]);
  const [newItinerary, setNewItinerary] = useState({
    title: "",
    date: "",
    notes: "",
  });
  const [newDate, setNewDate] = useState("");

  useEffect(() => {
    API.get(`/trips/${tripId}/itineraries`)
      .then((res) => setItineraries(res.data))
      .catch(console.error);
  }, [tripId]);

  const addItinerary = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/trips/${tripId}/itineraries`, {
        ...newItinerary,
        date: newDate,
      });
      setItineraries((prev) => [...prev, res.data]);
      setNewItinerary({ title: "", date: "", notes: "" });
      setNewDate("");
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
      <h3 className="text-lg font-semibold mb-2">Itinerary</h3>
      {itineraries.length === 0 ? (
        <p className="text-gray-500 italic">No plans yet</p>
      ) : (
        <ul className="list-none space-y-3">
          {itineraries.map((it) => (
            <li
              key={it.id}
              className="flex justify-between items-start bg-gray-50 p-3 rounded-lg shadow-sm"
            >
              <div className="space-y-1">
                <p className="flex items-center text-gray-800">
                  <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-semibold">
                    {it.date ? format(parseISO(it.date), "MMM d, yyyy") : ""}
                  </span>
                </p>
                <p className="flex items-center text-gray-700">
                  <MapPin className="w-4 h-4 mr-2 text-green-600" />
                  {it.title || <span className="italic text-gray-400">No title</span>}
                </p>
                {it.notes && (
                  <p className="flex items-center text-gray-600">
                    <FileText className="w-4 h-4 mr-2 text-gray-500" />
                    {it.notes}
                  </p>
                )}
              </div>
              <button
                onClick={() => deleteItinerary(it.id)}
                className="flex items-center bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add Itinerary Form */}
      <form
        onSubmit={addItinerary}
        className="mt-4 space-y-3 bg-white p-4 rounded-lg shadow"
      >
        {/* Title */}
        <div className="flex items-center border rounded p-2">
          <MapPin className="w-5 h-5 text-green-600 mr-2" />
          <input
            type="text"
            placeholder="Title"
            value={newItinerary.title}
            onChange={(e) =>
              setNewItinerary({ ...newItinerary, title: e.target.value })
            }
            className="flex-1 outline-none"
          />
        </div>

        {/* Date */}
        <div className="flex items-center border rounded p-2">
          <Calendar className="w-5 h-5 text-blue-600 mr-2" />
          <DatePicker
            selected={newDate ? parseISO(newDate) : null}
            onChange={(date) => setNewDate(format(date, "yyyy-MM-dd"))}
            dateFormat="MMM d, yyyy"
            placeholderText="Select a date"
            className="flex-1 outline-none"
          />
        </div>

        {/* Notes */}
        <div className="flex items-center border rounded p-2">
          <FileText className="w-5 h-5 text-gray-600 mr-2" />
          <input
            type="text"
            placeholder="Notes"
            value={newItinerary.notes}
            onChange={(e) =>
              setNewItinerary({ ...newItinerary, notes: e.target.value })
            }
            className="flex-1 outline-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Add Itinerary
        </button>
      </form>
    </div>
  );
}

export default ItineraryList;
