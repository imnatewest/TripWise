import { useState, useEffect } from "react";
import API from "./api";
import Login from "./Login";
import Signup from "./Signup";
import NewTrip from "./NewTrip";
import Modal from "./Modal";
import EditTripForm from "./EditTripForm";
import ItineraryList from "./ItineraryList";
import { format, parseISO } from "date-fns";
import { Pencil, Trash2, Calendar, DollarSign } from "lucide-react";

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
      <Signup onSignup={setUser} onSwitchToLogin={() => setShowSignup(false)} />
    ) : (
      <Login onLogin={setUser} onSwitchToSignup={() => setShowSignup(true)} />
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
        <ul className="space-y-6">
          {trips.map((trip) => (
            <li
              key={trip.id}
              className="p-5 bg-white rounded-lg shadow flex flex-col space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-blue-600">
                    {trip.destination}
                  </h2>
                  <p className="flex items-center text-gray-700">
                    <Calendar className="w-4 h-4 mr-1" />
                    {trip.start_date
                      ? format(parseISO(trip.start_date), "MMM d, yyyy")
                      : ""}{" "}
                    →{" "}
                    {trip.end_date
                      ? format(parseISO(trip.end_date), "MMM d, yyyy")
                      : ""}
                  </p>
                  <p className="flex items-center text-gray-500">
                    <DollarSign className="w-4 h-4 mr-1" /> ${trip.budget}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingTrip(trip)}
                    className="flex items-center bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await API.delete(`/trips/${trip.id}`);
                        setTrips((prev) =>
                          prev.filter((t) => t.id !== trip.id)
                        );
                      } catch (err) {
                        console.error("Delete failed:", err);
                        alert("Error deleting trip");
                      }
                    }}
                    className="flex items-center bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </button>
                </div>
              </div>

              {/* Itineraries neatly nested */}
              <div className="pl-4 border-l-2 border-gray-300">
                <ItineraryList tripId={trip.id} />
              </div>
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
