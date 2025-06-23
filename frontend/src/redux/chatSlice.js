import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat", // Name of the slice, used to identify it in the Redux store
  initialState: {
    onlineUsers: [],
    messages:[] 
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
});

export const { setOnlineUsers, setMessages } = chatSlice.actions; // Export the action creators
export default chatSlice.reducer; // Export the reducer to be used in the store