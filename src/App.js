import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import TicketPage from "./pages/TicketPage.jsx";
import TicketDetails from "./pages/TicketDetails.jsx";
import TeamPage from "./pages/TeamPage.jsx";
import TeamDetails from "./pages/TeamDetails";
import Login from "./pages/Login";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <TicketPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/:id"
          element={
            <ProtectedRoute>
              <TicketDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <TeamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams/:id"
          element={
            <ProtectedRoute>
              <TeamDetails />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
