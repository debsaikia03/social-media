import './App.css'
import Home from './components/Home';
import Login from './components/Login'
import MainLayout from './components/MainLayout';
import Profile from './components/Profile';
import Signup from './components/Signup';
import EditProfile from './components/EditProfile';
import ChatPage from './components/ChatPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers } from './redux/chatSlice';
import { setLikeNotification } from './redux/rtnSlice';
import ProtectedRoutes from './components/ProtectedRoutes';


//react-dom: switch from one page to another
//createBrowserRouter: creates a browser router
//BrowserRouter: a router that uses the HTML5 history API (pushState, replaceState, and the popstate event) to keep your UI in sync with the URL

const browserRouter = createBrowserRouter([ //array of route objects
  //Nested routes in React Router allow you to define routes within other routes, creating a parent-child relationship between them. This is useful for building layouts where certain components (like headers, sidebars, or footers) are shared across multiple pages, while other components (like the main content) change based on the route.
  {
    path: "/",
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes> ,
    children: [
      {
        path: "/",
        element:  <ProtectedRoutes><Home /></ProtectedRoutes> 
      },
      {
        path: '/profile/:id', //:id is a route parameter that can be accessed in the Profile component
        element: <Profile />
      },
      {
        path: '/account/edit',
        element:  <ProtectedRoutes><EditProfile /></ProtectedRoutes>
      },
      {
        path: '/chat',
        element: <ProtectedRoutes><ChatPage /></ProtectedRoutes>
      },
    ]
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/login',
    element: <Login />
  }
]);

function App() {

  const { user } = useSelector(store => store.auth); //get user from redux store
  const { socket } = useSelector(store => store.socketio); //get socket from redux store
  const dispatch = useDispatch(); //useDispatch is a hook that returns a reference to the dispatch function from the Redux store, which is used to dispatch actions to the store.

  useEffect(() => {
    if (user) {
      const socketio = io('https://social-media-ttfc.onrender.com', {
        query: {
          userId: user._id //send user id to the server
        },
        transports: ['websocket'] //use websocket transport
      });

      dispatch(setSocket(socketio)); //set socketio in redux store

      //listening all the evevnts

      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers)); //set online users in redux store
      });

      socketio.on('notification',(notification)=>{
        dispatch(setLikeNotification(notification)); //set like notification in redux store
      });

      return () => {
        socketio.close(); //close the socket connection when the component unmounts
        dispatch(setSocket(null)); //set socket to null in redux store
      }
    } else if(socket) {
      socket.close(); //close the socket connection when the component unmounts
      dispatch(setSocket(null)); //set socket to null in redux store
    }
  }, [user, dispatch]);

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App
