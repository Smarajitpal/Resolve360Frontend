import { configureStore } from "@reduxjs/toolkit";
import ticketReducer from "../features/tickets/ticketSlice";
import teamReducer from "../features/teams/teamSlice";
import authReducer from "../features/auth/authSlice";

export default configureStore({
  reducer: {
    tickets: ticketReducer,
    teams: teamReducer,
    auth: authReducer,
  },
});
