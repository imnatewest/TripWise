import { useState } from "react";
import API from "./api";
import { parseISO, format } from "date-fns";

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

    if (new Date(endDate) < new Date(startDate)) {
      setError("End date cannot be before start date.");
      return;
    }

    // Validate budget
    if (isNaN(budget) || Number(budget) < 0) {
      setError("Budget must be a valid number and cannot be negative.");
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
      className="bg-white p-4 rounded shadow mb-6 space-y-2"
    >
      <h2 className="text-xl font-bold">Add a New Trip</h2>

      {error && <p className="text-red-600 mb-3 text-center">{error}</p>}

      <input
        type="text"
        placeholder="Destination"
        className="w-full border p-2 rounded"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Budget"
        className="w-full border p-2 rounded"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        required
      />
      <input
        type="date"
        className="w-full border p-2 rounded"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
      />
      <input
        type="date"
        className="w-full border p-2 rounded"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        required
      />
      <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        Create Trip
      </button>
    </form>
  );
}

export default NewTrip;
