import { useState } from "react";
import API from "./api";
import DatePicker from "react-datepicker";
import { parseISO, format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { MapPin, DollarSign, Calendar, Save } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h2 className="text-xl font-bold mb-2">Edit Trip</h2>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* Destination */}
      <div className="flex items-center border rounded p-2">
        <MapPin className="w-5 h-5 text-blue-600 mr-2" />
        <input
          type="text"
          className="flex-1 outline-none"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>

      {/* Budget */}
      <div className="flex items-center border rounded p-2">
        <DollarSign className="w-5 h-5 text-green-600 mr-2" />
        <input
          type="number"
          className="flex-1 outline-none"
          placeholder="Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
      </div>

      {/* Start Date */}
      <div className="flex items-center border rounded p-2">
        <Calendar className="w-5 h-5 text-gray-600 mr-2" />
        <DatePicker
          selected={startDate ? parseISO(startDate) : null}
          onChange={(date) =>
            setStartDate(date ? format(date, "yyyy-MM-dd") : "")
          }
          dateFormat="MMM d, yyyy"
          placeholderText="Start date"
          className="flex-1 outline-none"
        />
      </div>

      {/* End Date */}
      <div className="flex items-center border rounded p-2">
        <Calendar className="w-5 h-5 text-gray-600 mr-2" />
        <DatePicker
          selected={endDate ? parseISO(endDate) : null}
          onChange={(date) => setEndDate(date ? format(date, "yyyy-MM-dd") : "")}
          dateFormat="MMM d, yyyy"
          placeholderText="End date"
          className="flex-1 outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 flex items-center justify-center"
      >
        <Save className="w-5 h-5 mr-2" />
        Save Changes
      </button>
    </form>
  );
}

export default EditTripForm;
