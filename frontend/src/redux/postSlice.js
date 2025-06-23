import { createSlice } from '@reduxjs/toolkit';
//slice is a function that takes an object with the following properties:
// name: The name of the slice, used to identify it in the Redux store.
// initialState: The initial state of the slice, which is an object that contains the properties of the slice.
// reducers: An object that contains the reducer functions for the slice, which are used to update the state of the slice.

//reducer function is a pure function that takes the current state and an action as arguments and returns a new state. It is used to update the state of the slice based on the action dispatched to the store.

const postSlice = createSlice({
  name: 'post',
  initialState: {
    posts: [],
    selectedPost: null,
  },
  reducers: {
    //actions
    //setPosts is a reducer function that takes the current state and an action as arguments and returns a new state with the posts property updated to the payload of the action.
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    //setSelectedPost is a reducer function that takes the current state and an action as arguments and returns a new state with the selectedPost property updated to the payload of the action.
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    }
  },
});

export const { setPosts, setSelectedPost } = postSlice.actions;
export default postSlice.reducer;