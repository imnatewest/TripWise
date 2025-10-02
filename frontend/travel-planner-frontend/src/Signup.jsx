import { useState } from "react";
import API from "./api";

function Signup({ onSignup }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/signup", { name, email, password });
      localStorage.setItem("token", res.data.token);
      onSignup(res.data.user);
    } catch (err) {
      console.error("Signup failed:", err);
      alert("Signup failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 mb-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;
