import { useState, useEffect } from "react";
import API from "./api";
import Login from "./Login";
import Signup from "./Signup";
import NewTrip from "./NewTrip";
import Modal from "./Modal";
import EditTripForm from "./EditTripForm";
import ItineraryList from "./ItineraryList";
import { format, formatDistanceToNow, differenceInDays, parseISO } from "date-fns";

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [trips, setTrips] = useState([]);
  const [editingTrip, setEditingTrip] = useState(null);

  useEffect(() => {
    if (user) {
      API.get("/trips")
        .then((res) => setTrips(res.data))
        .catch((err) => console.error("API Error:", err));
    }
  }, [user]);

  const handleTripCreated = (newTrip) => {
    setTrips((prev) => [...prev, newTrip]);
  };

  const handleTripUpdated = (updatedTrip) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t))
    );
    setEditingTrip(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setTrips([]);
  };

  if (!user) {
    return showSignup ? (
      <div>
        <Signup onSignup={setUser} />
        <p className="text-center mt-4">
          Already have an account?{" "}
          <button
            className="text-blue-600 underline"
            onClick={() => setShowSignup(false)}
          >
            Log in
          </button>
        </p>
      </div>
    ) : (
      <div>
        <Login onLogin={setUser} />
        <p className="text-center mt-4">
          Don’t have an account?{" "}
          <button
            className="text-green-600 underline"
            onClick={() => setShowSignup(true)}
          >
            Sign up
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-blue-600">
          Welcome, {user.name}!
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <NewTrip onTripCreated={handleTripCreated} />

      {trips.length > 0 ? (
        <ul className="space-y-4">
          {trips.map((trip) => (
            <li
              key={trip.id}
              className="p-4 bg-white rounded shadow flex flex-col gap-3"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold">{trip.destination}</h2>
                  <p>Budget: ${trip.budget}</p>
                  <p>
                    {format(parseISO(trip.start_date), "MMM d, yyyy")} → {format(parseISO(trip.end_date), "MMM d, yyyy")}
                    <span className="text-gray-500 text-sm ml-2">
                      ({differenceInDays(parseISO(trip.end_date), parseISO(trip.start_date)) + 1} days,
                      starts {formatDistanceToNow(parseISO(trip.start_date), { addSuffix: true })})
                    </span>
                  </p>



                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingTrip(trip)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await API.delete(`/trips/${trip.id}`);
                        setTrips((prev) => prev.filter((t) => t.id !== trip.id));
                      } catch (err) {
                        console.error("Delete failed:", err);
                        alert("Error deleting trip");
                      }
                    }}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* NEW: Itineraries under each trip */}
              <ItineraryList tripId={trip.id} />
            </li>
      ))}

        </ul>
      ) : (
        <p>No trips found.</p>
      )}

      {/* Edit Trip Modal */}
      <Modal isOpen={!!editingTrip} onClose={() => setEditingTrip(null)}>
        {editingTrip && (
          <EditTripForm trip={editingTrip} onSave={handleTripUpdated} />
        )}
      </Modal>
    </div>
  );
}

export default App;
