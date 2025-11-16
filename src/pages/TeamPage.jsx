import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTeams, createTeam } from "../features/teams/teamSlice";
import { getAllUsers } from "../features/auth/authSlice";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const TeamPage = () => {
  const dispatch = useDispatch();
  const { teams, status, error } = useSelector((state) => state.teams);
  const { users } = useSelector((state) => state.auth);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    lead: "",
  });

  useEffect(() => {
    dispatch(getTeams());
    dispatch(getAllUsers());
  }, [dispatch]);

  const leadCount = teams?.filter((team) => team.lead).length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      await dispatch(createTeam(formData)).unwrap();
      toast.success("✅ Team created");
      setFormData({ name: "", description: "", lead: "" });
      setShowModal(false);
    } catch {
      toast.error("❌ Failed to create team");
    }
  };
  if (status === "loading") return <p>Loading teams...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <div className="container py-4">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🧑‍🤝‍🧑 All Teams</h2>
        <button className="btn btn-success" onClick={() => setShowModal(true)}>
          ➕ Add Team
        </button>
      </div>

      <p>
        <strong>Total Teams:</strong> {teams?.length}
      </p>
      <p>
        <strong>Teams with Leads:</strong> {leadCount}
      </p>

      {teams?.length === 0 ? (
        <p>No teams found.</p>
      ) : (
        <div className="row">
          {teams?.map((team) => (
            <div key={team._id} className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{team.name}</h5>
                  <p className="card-text">
                    {team.description || "No description"}
                  </p>
                  <p>
                    <strong>Lead:</strong> {team.lead?.name || "—"}
                  </p>
                  <p>
                    <strong>Members:</strong>{" "}
                    {team.members.map((m) => m.name).join(", ") || "—"}
                  </p>
                  <Link
                    to={`/teams/${team._id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">➕ Create New Team</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Team Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Team Lead</label>
                    <select
                      name="lead"
                      className="form-select"
                      value={formData.lead}
                      onChange={handleChange}
                    >
                      <option value="">Select Lead</option>
                      {users?.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">
                    Create
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPage;
