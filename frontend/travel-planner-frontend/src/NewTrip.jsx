import { useState } from "react";
import API from "./api";
import { parseISO, format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MapPin, DollarSign, Calendar, PlusCircle } from "lucide-react";

function NewTrip({ onTripCreated }) {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await API.post("/trips", {
        destination,
        budget,
        start_date: startDate,
        end_date: endDate,
      });
      onTripCreated(res.data);
      setDestination("");
      setBudget("");
      setStartDate("");
      setEndDate("");
    } catch (err) {
      console.error("Trip creation failed:", err);
      setError("Failed to create trip.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow mb-6 space-y-4"
    >
      <h2 className="text-xl font-bold mb-2">Add a New Trip</h2>

      {error && <p className="text-red-600 mb-3 text-center">{error}</p>}

      {/* Destination */}
      <div className="flex items-center border rounded p-2">
        <MapPin className="w-5 h-5 text-blue-600 mr-2" />
        <input
          type="text"
          placeholder="Destination"
          className="flex-1 outline-none"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />
      </div>

      {/* Budget */}
      <div className="flex items-center border rounded p-2">
        <DollarSign className="w-5 h-5 text-green-600 mr-2" />
        <input
          type="number"
          placeholder="Budget"
          className="flex-1 outline-none"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          required
        />
      </div>

      {/* Start Date */}
      <div className="flex items-center border rounded p-2">
        <Calendar className="w-5 h-5 text-gray-600 mr-2" />
        <DatePicker
          selected={startDate ? parseISO(startDate) : null}
          onChange={(date) => setStartDate(format(date, "yyyy-MM-dd"))}
          dateFormat="MMM d, yyyy"
          placeholderText="Start Date"
          className="flex-1 outline-none"
        />
      </div>

      {/* End Date */}
      <div className="flex items-center border rounded p-2">
        <Calendar className="w-5 h-5 text-gray-600 mr-2" />
        <DatePicker
          selected={endDate ? parseISO(endDate) : null}
          onChange={(date) => setEndDate(format(date, "yyyy-MM-dd"))}
          dateFormat="MMM d, yyyy"
          placeholderText="End Date"
          className="flex-1 outline-none"
        />
      </div>

      {/* Submit */}
      <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex items-center justify-center">
        <PlusCircle className="w-5 h-5 mr-2" />
        Create Trip
      </button>
    </form>
  );
}

export default NewTrip;
