import { createSlice } from '@reduxjs/toolkit';
// Redux slice for authentication management
// This slice manages the authentication state of the application, specifically the user information.

const authSlice = createSlice({ // Create a slice of the Redux store

    name: "auth",
    initialState: {
        user: null,   // Initial state with user set to null
        suggestedUsers: [], // Initial state for suggested users, can be an empty array or populated later
        userProfile: null, // Initial state for user profile, can be null or populated later
        selectedUser: null, // Initial state for selected user, can be null or populated later
        bookmarks: [], // Initial state for bookmarks, can be an empty array or populated later
    },
    reducers: {
        //actions to update the state
        setAuthUser: (state, action) => {
            state.user = action.payload; // Set the user state to the payload
        },
        setSuggestedUsers: (state, action) => {
            state.suggestedUsers = action.payload; // Set the suggested users state to the payload
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload; // Set the user profile state to the payload
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload; // Set the selected user state to the payload
        },
        setBookmarks: (state, action) => {
            if (state.user) {
                state.user.bookmarks = action.payload;
            }
        },
    }
});

export const { setAuthUser, setSuggestedUsers, setUserProfile, setSelectedUser, setBookmarks, setIsFollowing } = authSlice.actions; // Export the action creator
export default authSlice.reducer; // Export the reducer to be used in the store