//redux: it is used to manage the state of the application. the store is the central place where the state is stored and managed. it allows components to access and update the state in a predictable way.
//reducer: it is a function that takes the current state and an action as arguments and returns a new state. it is used to update the state in the store.
// The reducer is responsible for handling actions and updating the state accordingly.

import { combineReducers, configureStore } from '@reduxjs/toolkit'; // Import the configureStore function from Redux Toolkit
// This function is used to create a Redux store with the specified reducer and middleware.
import authSlice from './authSlice.js'; // Import the authSlice reducer from the authSlice file
import postSlice from './postSlice.js'; // Import the postSlice reducer from the postSlice file
import socketSlice from './socketSlice.js'; // Import the socketSlice reducer from the socketSlice file
import chatSlice from './chatSlice.js'; // Import the chatSlice reducer from the chatSlice file
import rtnSlice from './rtnSlice.js'; // Import the rtnSlice reducer from the rtnSlice file

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

// Combine all reducers into a single reducer function
const rootReducer = combineReducers({
  auth: authSlice,
  post: postSlice,
  socketio: socketSlice,
  chat: chatSlice,
  realTimeNotification: rtnSlice
  // Add more reducers here as needed
});

//reducer is a function that takes the current state and an action as arguments and returns a new state. It is used to update the state in the store.
// The combineReducers function is used to combine multiple reducers into a single reducer function.

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store; // Export the configured store for use in the application
// This store can be used in the application to manage the authentication state, allowing components to access and update the user information.