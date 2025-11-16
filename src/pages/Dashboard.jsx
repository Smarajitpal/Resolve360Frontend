import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getTickets, postTicket } from "../features/tickets/ticketSlice";
import { getTeams } from "../features/teams/teamSlice";
import { logout } from "../features/auth/authSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { tickets } = useSelector((state) => state.tickets);
  const { teams } = useSelector((state) => state.teams);
  const { user, token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    channel: "email",
    customer: { name: "", email: "", handle: "" },
    subject: "",
    priority: "low",
    tags: [],
  });

  useEffect(() => {
    dispatch(getTickets());
    dispatch(getTeams());
  }, [dispatch]);

  const total = tickets?.length;
  const open = tickets?.filter((t) => t.status === "open").length;
  const escalated = tickets?.filter((t) => t.escalated).length;

  const tagOptions = [
    { value: "billing", label: "Billing" },
    { value: "complaint", label: "Complaint" },
    { value: "feature-request", label: "Feature Request" },
    { value: "technical", label: "Technical" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["name", "email", "handle"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        customer: { ...prev.customer, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTagChange = (selected) => {
    setFormData((prev) => ({
      ...prev,
      tags: selected.map((tag) => tag.value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(postTicket(formData)).unwrap();
      toast.success("🎉 Ticket raised successfully!");
      setFormData({
        channel: "email",
        customer: { name: "", email: "", handle: "" },
        subject: "",
        priority: "low",
        tags: [],
      });
    } catch (err) {
      toast.error("❌ Failed to raise ticket");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.info("👋 Logged out");
  };

  return (
    <div className="container py-4">
      <ToastContainer />
      <nav className="navbar navbar-light bg-light mb-4 px-3 rounded shadow-sm">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <span className="navbar-brand h1 mb-0">🚀 Resolve360</span>
          {token ? (
            <div className="d-flex align-items-center">
              <span className="me-3">👤 {user?.name || "Logged In"}</span>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline-primary btn-sm">
              🔐 Login
            </Link>
          )}
        </div>
      </nav>
      <h5 className="text-muted mb-3">📊 Ticketing Dashboard</h5>

      <div className="row mb-5">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Ticket Overview</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Total Tickets: {total}</li>
                <li className="list-group-item">Open Tickets: {open}</li>
                <li className="list-group-item">
                  Escalated Tickets: {escalated}
                </li>
              </ul>
              <Link to="/tickets" className="btn btn-primary mt-3">
                🔍 View Ticket Details
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Teams</h5>
              <ul className="list-group list-group-flush">
                {teams?.length > 0 ? (
                  teams.map((team) => (
                    <li key={team._id} className="list-group-item">
                      <strong>{team.name}</strong> — {team.members.length}{" "}
                      members
                    </li>
                  ))
                ) : (
                  <h3>No Teams available</h3>
                )}
              </ul>
              <Link to="/teams" className="btn btn-outline-secondary mt-3">
                🧑‍🤝‍🧑 View All Teams
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">🎫 Raise a Ticket</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Channel</label>
              <select
                name="channel"
                className="form-select"
                value={formData.channel}
                onChange={handleChange}
              >
                <option value="email">Email</option>
                <option value="twitter">Twitter</option>
                <option value="chat">Chat</option>
                <option value="community">Community</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Customer Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.customer.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Customer Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.customer.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Customer Handle</label>
              <input
                type="text"
                name="handle"
                className="form-control"
                value={formData.customer.handle}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Subject</label>
              <input
                type="text"
                name="subject"
                className="form-control"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Priority</label>
              <select
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Tags</label>
              <Select
                isMulti
                options={tagOptions}
                onChange={handleTagChange}
                value={tagOptions.filter((tag) =>
                  formData.tags.includes(tag.value)
                )}
              />
            </div>

            <button type="submit" className="btn btn-success">
              Raise Ticket
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
