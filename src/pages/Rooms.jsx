// src/pages/Rooms.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import HandleLoading from "../utils/HandleLoading";
import { getRoomsByProperty, addRoomToProperty } from "../api/room";

const Rooms = () => {
  const { property_id } = useParams(); // from route /rooms/:property_id
  const { user, accessToken } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [adding, setAdding] = useState(false);

  // Fetch rooms
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const data = await getRoomsByProperty(property_id);
      setRooms(data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, [property_id]);

  // Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle add room
  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!accessToken) return alert("Only property owners can add rooms");
    setAdding(true);
    try {
      await addRoomToProperty(property_id, formData, accessToken);
      setFormData({ name: "", description: "", price: "" });
      fetchRooms();
    } catch (err) {
      console.error("Error adding room:", err);
      alert(err.error || "Failed to add room");
    }
    setAdding(false);
  };

  return (
    <HandleLoading loading={loading}>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Rooms</h1>

        {/* Rooms List */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <div key={room.id} className="border rounded-xl p-4 shadow hover:shadow-lg transition">
                <h2 className="text-xl font-semibold">{room.name}</h2>
                <p className="text-gray-600">{room.description}</p>
                <p className="font-medium mt-2">Price: ${room.price}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No rooms available.</p>
          )}
        </div>

        {/* Add Room Form (only if logged in) */}
        {user && (
          <div className="border rounded-xl p-6 shadow-md bg-white">
            <h2 className="text-2xl font-semibold mb-4">Add New Room</h2>
            <form onSubmit={handleAddRoom} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Room Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              <button
                type="submit"
                disabled={adding}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                {adding ? "Adding..." : "Add Room"}
              </button>
            </form>
          </div>
        )}
      </div>
    </HandleLoading>
  );
};

export default Rooms;
