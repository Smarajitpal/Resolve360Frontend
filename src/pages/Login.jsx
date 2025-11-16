import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(formData)).unwrap();
      toast.success("✅ Logged in");
      navigate("/");
    } catch (err) {
      if (err === "User not found") {
        toast.error("📧 Email does not exist. Please Register");
      } else if (err === "Invalid credentials") {
        toast.error("🔑 Incorrect password");
      } else {
        toast.error("❌ Login failed");
      }
    }
  };

  return (
    <div className="container py-4">
      <ToastContainer />
      <h2>🔐 Login</h2>
      <form onSubmit={handleSubmit}>
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
        <button className="btn btn-primary">Login</button>
      </form>
      <div className="mt-3">
        <p>
          Don't have an account?{" "}
          <Link to="/register" className="text-decoration-none">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
