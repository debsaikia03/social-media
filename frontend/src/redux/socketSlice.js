import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socketio", // Name of the slice, used to identify it in the Redux store
  initialState: {
    socket: null, // Initial state for the socket connection
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload; // Set the socket connection to the payload
    },
  },
});

export const { setSocket } = socketSlice.actions; // Export the action creators
export default socketSlice.reducer; // Export the reducer to be used in the store