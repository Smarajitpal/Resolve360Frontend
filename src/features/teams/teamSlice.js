import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://resolve360-backend.vercel.app/api/teams";

export const getTeams = createAsyncThunk("teams/getAll", async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
});

export const createTeam = createAsyncThunk("teams/create", async (teamData) => {
  const res = await axios.post(BASE_URL, teamData);
  console.log(res.data);
  return res.data;
});

export const addMemberToTeam = createAsyncThunk(
  "teams/addMember",
  async ({ teamId, userId }) => {
    const res = await axios.post(`${BASE_URL}/${teamId}/members`, {
      userId,
    });
    return res.data;
  }
);
export const getTeamById = createAsyncThunk("teams/getById", async (teamId) => {
  const res = await axios.get(`${BASE_URL}/${teamId}`);
  return res.data;
});

const teamSlice = createSlice({
  name: "teams",
  initialState: {
    teams: [],
    selectedTeam: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTeams.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTeams.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teams = action.payload;
      })
      .addCase(getTeams.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.teams.push(action.payload);
      })
      .addCase(addMemberToTeam.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.teams.findIndex((t) => t._id === updated._id);
        if (index !== -1) state.teams[index] = updated;
      })
      .addCase(getTeamById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTeamById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedTeam = action.payload;
      })
      .addCase(getTeamById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default teamSlice.reducer;
