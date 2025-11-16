import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../features/auth/authSlice";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "agent",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(registerUser(formData)).unwrap();
      toast.success("✅ Registered successfully");
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      toast.error("❌ Registration failed User already exist.");
    }
  };

  return (
    <div className="container py-4">
      <ToastContainer />
      <h2>📝 Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          className="form-control mb-2"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          className="form-control mb-2"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          className="form-control mb-2"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <select
          name="role"
          className="form-select mb-2"
          onChange={handleChange}
        >
          <option value="agent">Agent</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
        <button className="btn btn-success">Register</button>
      </form>
    </div>
  );
};

export default Register;
