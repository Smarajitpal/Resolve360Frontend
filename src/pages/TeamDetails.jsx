import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTeamById, addMemberToTeam } from "../features/teams/teamSlice";
import { getTickets } from "../features/tickets/ticketSlice";
import { getAllUsers } from "../features/auth/authSlice";
import { toast, ToastContainer } from "react-toastify";

const TeamDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.auth);
  const { tickets } = useSelector((state) => state.tickets);
  const { selectedTeam } = useSelector((state) => state.teams);

  const [userId, setUserId] = useState("");

  useEffect(() => {
    dispatch(getTeamById(id));
    dispatch(getTickets());
    dispatch(getAllUsers());
  }, [dispatch, id]);

  const assignedTickets = tickets?.filter((ticket) => ticket.teamId?._id === id);

  const handleAddMember = async () => {
    if (!userId.trim()) return toast.error("Enter a user ID");
    try {
      const alreadyMember = selectedTeam.members.some((m) => m._id === userId);
      if (alreadyMember) return toast.info("User is already a team member");

      await dispatch(addMemberToTeam({ teamId: id, userId })).unwrap();
      toast.success("✅ Member added");
      setUserId("");
    } catch {
      toast.error("❌ Failed to add member");
    }
  };

  return (
    <div className="container py-4">
      <ToastContainer />
      <h2>{selectedTeam?.name}</h2>
      <p>{selectedTeam?.description || "No description provided."}</p>
      <p>
        <strong>Lead:</strong> {selectedTeam?.lead?.name || "—"}
      </p>

      <h5 className="mt-4">👥 Members</h5>
      <ul className="list-group mb-3">
        {selectedTeam?.members.map((member) => (
          <li key={member._id} className="list-group-item">
            {member.name} ({member.email})
          </li>
        ))}
      </ul>

      <div className="mb-4">
        <select
          className="form-select mb-2"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        >
          <option value="">Select a user to add</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>

        <button className="btn btn-outline-success" onClick={handleAddMember}>
          ➕ Add Member
        </button>
      </div>

      <h5>🎫 Assigned Tickets</h5>
      <ul className="list-group">
        {assignedTickets.map((ticket) => (
          <li key={ticket._id} className="list-group-item">
            <strong>{ticket.subject}</strong> — {ticket.status} (
            {ticket.priority})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamDetails;
