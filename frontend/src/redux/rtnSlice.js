import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: "realTimeNotification", // Name of the slice, used to identify it in the
  initialState: {
    likeNotification: [],
  },
  reducers: {
    setLikeNotification: (state, action) => {
      if(action.payload.type === 'like') {// Check if the notification is a like notification
        state.likeNotification.push(action.payload);
      } else if(action.payload.type === 'dislike') { // Check if the notification is an unlike notification
        state.likeNotification = state.likeNotification.filter(item => item.userId !== action.payload.userId);
      }
    },
  },
});

export const { setLikeNotification } = rtnSlice.actions; // Export the action creators
export default rtnSlice.reducer; // Export the reducer to be used in the store