import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://resolve360-backend.vercel.app/api/tickets";

export const getTickets = createAsyncThunk("tickets/getAll", async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
});

export const postTicket = createAsyncThunk(
  "tickets/create",
  async (ticketData) => {
    const response = await axios.post(BASE_URL, ticketData);
    return response.data;
  }
);

export const getTicketById = createAsyncThunk("tickets/getById", async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
});

export const updateTicket = createAsyncThunk(
  "tickets/update",
  async ({ id, data }) => {
    const response = await axios.patch(`${BASE_URL}/${id}`, data);
    return response.data;
  }
);

export const addReply = createAsyncThunk(
  "tickets/reply",
  async ({ id, message }) => {
    const response = await axios.post(`${BASE_URL}/${id}/reply`, message,{
      headers: { "Content-Type": "application/json" },);
    return response.data;
  }
);

export const escalateTicket = createAsyncThunk(
  "tickets/escalate",
  async (id) => {
    const response = await axios.post(`${BASE_URL}/${id}/escalate`);
    return response.data;
  }
);

// Slice
const ticketSlice = createSlice({
  name: "tickets",
  initialState: {
    tickets: [],
    status: "idle",
    error: null,
    ticket: null,
  },
  reducers: {
    clearTicket: (state) => {
      state.ticket = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTickets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTickets.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tickets = action.payload;
      })
      .addCase(getTickets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(postTicket.fulfilled, (state, action) => {
        state.tickets.push(action.payload);
      })
      .addCase(getTicketById.fulfilled, (state, action) => {
        state.ticket = action.payload;
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.ticket = action.payload;
      })
      .addCase(addReply.fulfilled, (state, action) => {
        state.ticket = action.payload;
      })
      .addCase(escalateTicket.fulfilled, (state, action) => {
        state.ticket = action.payload;
      });
  },
});

export const { clearTicket } = ticketSlice.actions;
export default ticketSlice.reducer;
