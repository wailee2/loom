// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
    user_type: "tenant", // default
  });
  const [error, setError] = useState(null); // store detailed errors
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage("");

    if (form.password !== form.password2) {
      setError({ password2: ["Passwords do not match"] });
      setLoading(false);
      return;
    }

    const result = await register(form);

    if (result.success) {
      console.log("Registration successful:", result.message);
      setMessage(result.message);
      setTimeout(() => navigate("/login"), 2000);
    } else {
      console.error("Registration failed:", result.error);
      
      try {
        // Try to parse JSON string into an object for display
        const parsedError = JSON.parse(result.error);
        setError(parsedError);
      } catch {
        setError({ non_field_errors: [result.error] });
      }
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Register</h1>

      {/* Display general success message */}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* Display backend validation errors */}
      {error &&
        Object.keys(error).map((key) => (
          <div key={key} style={{ color: "red" }}>
            {key}: {error[key].join(", ")}
          </div>
        ))}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password2"
          placeholder="Confirm Password"
          value={form.password2}
          onChange={handleChange}
          required
        />
        <select name="user_type" value={form.user_type} onChange={handleChange}>
          <option value="tenant">Tenant</option>
          <option value="landlord">Landlord</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
