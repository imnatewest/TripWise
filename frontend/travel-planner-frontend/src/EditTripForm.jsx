import { useState } from "react";
import API from "./api";
import DatePicker from "react-datepicker";
import { parseISO, format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

function EditTripForm({ trip, onSave }) {
  const [destination, setDestination] = useState(trip.destination);
  const [budget, setBudget] = useState(trip.budget);
  const [startDate, setStartDate] = useState(trip.start_date);
  const [endDate, setEndDate] = useState(trip.end_date);
  const [error, setError] = useState("");

  const validate = () => {
    if (!destination.trim()) return "Destination is required.";
    if (budget <= 0) return "Budget must be greater than 0.";
    if (!startDate || !endDate) return "Both dates are required.";
    if (new Date(endDate) < new Date(startDate))
      return "End date must be after start date.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await API.put(`/trips/${trip.id}`, {
        destination,
        budget: parseFloat(budget),
        start_date: startDate,
        end_date: endDate,
      });
      onSave(res.data);
    } catch (err) {
      console.error("Update failed:", err);
      setError("Error saving trip. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <h2 className="text-xl font-bold mb-2">Edit Trip</h2>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <input
        type="text"
        className="border p-2 rounded w-full"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <input
        type="number"
        className="border p-2 rounded w-full"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
      />
      <DatePicker
        selected={startDate ? parseISO(startDate) : null}
        onChange={(date) => setStartDate(date ? format(date, "yyyy-MM-dd") : "")}
        dateFormat="MMM d, yyyy"
        placeholderText="Start date"    
        className="w-full p-2 border rounded placeholder-gray-400"
      />
      <DatePicker
        selected={endDate ? parseISO(endDate) : null}
        onChange={(date) => setEndDate(date ? format(date, "yyyy-MM-dd") : "")}
        dateFormat="MMM d, yyyy"
        placeholderText="End date"      
        className="w-full p-2 border rounded placeholder-gray-400"
      />
      <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 w-full">
        Save Changes
      </button>
    </form>
  );
}

export default EditTripForm;
