import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTickets } from "../features/tickets/ticketSlice";
import { Link } from "react-router-dom";

const TicketPage = () => {
  const dispatch = useDispatch();
  const { tickets, status, error } = useSelector((state) => state.tickets);
  const [sortBy, setSortBy] = useState("createdAt");

  useEffect(() => {
    dispatch(getTickets());
  }, [dispatch]);

  const sortedTickets = [...tickets].sort((a, b) => {
    if (sortBy === "priority") {
      const order = { urgent: 4, high: 3, medium: 2, low: 1 };
      return order[b.priority] - order[a.priority];
    }
    return new Date(b[sortBy]) - new Date(a[sortBy]);
  });

  if (status === "loading") return <p>Loading tickets...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">📬 All Tickets</h2>

      <div className="mb-3">
        <label className="form-label">Sort by</label>
        <select
          className="form-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="createdAt">Newest</option>
          <option value="priority">Priority</option>
          <option value="status">Status</option>
        </select>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Subject</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Channel</th>
            <th>Team</th>
            <th>Created</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {sortedTickets.map((ticket) => (
            <tr key={ticket._id}>
              <td>{ticket.subject}</td>
              <td>{ticket.status}</td>
              <td>{ticket.priority}</td>
              <td>{ticket.channel}</td>
              <td>{ticket.teamId?.name || "—"}</td>
              <td>{new Date(ticket.createdAt).toLocaleString()}</td>
              <td>
                <Link
                  to={`/tickets/${ticket._id}`}
                  className="btn btn-sm btn-outline-primary"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketPage;
