import { useEffect, useState } from "react";
import API from "./api";

function App() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    API.get("/trips")
      .then((res) => setTrips(res.data))
      .catch((err) => console.error("API Error:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">AI Travel Planner</h1>

      {trips.length > 0 ? (
        <ul className="space-y-4">
          {trips.map((trip) => (
            <li key={trip.id} className="p-4 bg-white rounded shadow">
              <h2 className="text-2xl font-semibold">{trip.destination}</h2>
              <p>Budget: ${trip.budget}</p>
              <p>
                {trip.start_date} → {trip.end_date}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No trips found.</p>
      )}
    </div>
  );
}

export default App;
