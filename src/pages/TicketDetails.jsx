import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getTicketById,
  updateTicket,
  addReply,
  escalateTicket,
} from "../features/tickets/ticketSlice";
import { toast, ToastContainer } from "react-toastify";
import { getTeams } from "../features/teams/teamSlice";

const TicketDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { ticket } = useSelector((state) => state.tickets);
  const { teams } = useSelector((state) => state.teams);

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [reply, setReply] = useState("");
  const [teamId, setTeamId] = useState("");

  useEffect(() => {
    dispatch(getTicketById(id));
    dispatch(getTeams());
  }, [dispatch, id]);

  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status);
      setPriority(ticket.priority);
    }
  }, [ticket]);

  const handleUpdate = () => {
    dispatch(updateTicket({ id, data: { status, priority, teamId } }))
      .unwrap()
      .then(() => toast.success("✅ Ticket updated"))
      .catch(() => toast.error("❌ Update failed"));
  };

  const handleReply = () => {
    if (!reply.trim()) return;
    dispatch(addReply({ id, message: { from: "agent", text: reply } }))
      .unwrap()
      .then(() => {
        toast.success("💬 Reply added");
        setReply("");
      })
      .catch(() => toast.error("❌ Failed to add reply"));
  };

  const handleEscalate = () => {
    dispatch(escalateTicket(id))
      .unwrap()
      .then(() => toast.success("🚨 Ticket escalated"))
      .catch(() => toast.error("❌ Escalation failed"));
  };

  if (!ticket) return <p>Loading ticket...</p>;

  return (
    <div className="container py-4">
      <ToastContainer />
      <h2>{ticket.subject}</h2>
      <p>
        <strong>From:</strong> {ticket?.customer?.name} (
        {ticket?.customer?.email})
      </p>
      <p>
        <strong>Channel:</strong> {ticket.channel}
      </p>
      <p>
        <strong>Priority:</strong> {ticket.priority}
      </p>
      <p>
        <strong>Team:</strong> {ticket.teamId?.name || "—"}{" "}
        {ticket.team?.members?.length > 0 && (
          <span className="text-muted">
            ({ticket.team.members.map((m) => m.name).join(", ")})
          </span>
        )}
      </p>

      <p>
        <strong>Status:</strong> {ticket.status}
      </p>
      <p>
        <strong>Tags:</strong> {ticket?.tags?.join(", ") || "—"}
      </p>
      <p>
        <strong>Escalated:</strong> {ticket.escalated ? "Yes 🚨" : "No"}
      </p>

      <div className="col-md-6">
        <label>Team</label>
        <select
          className="form-select"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
        >
          <option value="">Unassigned</option>
          {teams?.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className="row my-4">
        <div className="col-md-6">
          <label>Status</label>
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Open">Open</option>
            <option value="In progress">In Progress</option>
            <option value="Waiting">Waiting</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
        <div className="col-md-6">
          <label>Priority</label>
          <select
            className="form-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div className="mt-3">
          <button className="btn btn-primary" onClick={handleUpdate}>
            Update Ticket
          </button>
        </div>
        <div className="mt-2">
          <button className="btn btn-warning" onClick={handleEscalate}>
            🚨 Escalate Ticket
          </button>
        </div>
      </div>

      <hr />
      <h5>Messages</h5>
      <ul className="list-group mb-3">
        {ticket?.messages?.map((msg, i) => (
          <li key={i} className="list-group-item">
            <strong>{msg.from}:</strong> {msg.text}
            <br />
            <small className="text-muted">
              {new Date(msg.createdAt).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>

      <textarea
        className="form-control mb-2"
        placeholder="Write a reply..."
        value={reply}
        onChange={(e) => setReply(e.target.value)}
      />
      <button className="btn btn-success" onClick={handleReply}>
        Send Reply
      </button>
    </div>
  );
};

export default TicketDetails;
