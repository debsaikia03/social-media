import React, { use, useState } from 'react'
import profilePhoto from '../assets/profile-photo.webp';
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar'
import { useNavigate } from 'react-router-dom' //useNavigate is a hook that returns a function that lets you navigate programmatically, similar to how you would use the history object in class components.
//useNavigate is used to navigate to different routes in the application without using the Link component from react-router-dom.
import axios from 'axios'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux' // Importing useSelector to access the Redux store state
import { setAuthUser } from '../redux/authSlice.js'
//useSelector is a hook that allows you to extract data from the Redux store state, using a selector function. It takes a function as an argument that receives the entire Redux store state and returns the part of the state you want to access. In this case, it is used to get the user information from the auth slice of the Redux store.
import CreatePost from './CreatePost'
import { setPosts, setSelectedPost } from '../redux/postSlice.js';
import { Popover, PopoverTrigger, PopoverContent } from './ui/Popover.jsx';

//fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen:
/*
fixed: Positions the element fixed relative to the viewport. It stays in place even when scrolling.
top-0: Sets the top edge of the element to 0 (sticks to the top of the viewport).
z-10: Sets the z-index to 10, controlling the stacking order (higher means it appears above elements with lower z-index).
left-0: Sets the left edge of the element to 0 (sticks to the left side of the viewport).
px-4: Adds horizontal padding (padding-left and padding-right) of 1rem (16px) on both sides.
border-r: Adds a border to the right side of the element.
border-gray-300: Sets the border color to a light gray (gray-300 from Tailwind’s color palette).
w-[16%]: Sets the width of the element to 16% of its parent or the viewport (using Tailwind’s arbitrary value syntax).
h-screen: Sets the height of the element to 100vh (full height of the viewport). */

//flex flex-col: This class makes the container a flexbox and arranges its children in a column layout.

//flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3
/*
flex: Makes the element a flex container (enables flexbox layout).
items-center: Vertically centers the items along the cross axis (like align-items: center).
gap-3: Adds a gap of 0.75rem (12px) between child elements.
relative: Sets the position to relative (useful for absolutely positioned children).
hover:bg-gray-100: On hover, changes the background color to a light gray (gray-100).
cursor-pointer: Changes the cursor to a pointer (hand icon) on hover, indicating it's clickable.
rounded-lg: Applies large rounded corners to the element.
p-3: Adds padding of 0.75rem (12px) on all sides.
my-3: Adds vertical margin (margin-top and margin-bottom) of 0.75rem (12px). */


export default function LeftSidebar() {

  const navigate = useNavigate();
  const { user } = useSelector(store => store.auth); //get user from redux store
  const { likeNotification } = useSelector(store => store.realTimeNotification); //get like notification from redux store

  const dispatch = useDispatch(); //useDispatch is a hook that returns a reference to the dispatch function from the Redux store, which is used to dispatch actions to the store.
  const [open, setOpen] = useState(false); //state to manage the open/close state of the sidebar

  const logoutHandler = async () => {
    try {
      const res = await axios.get('https://social-media-ttfc.onrender.com/api/v1/user/logout', {
        withCredentials: true //to send cookies with the request
      });
      if (res.data.success) {
        dispatch(setAuthUser(null)); //set user to null in redux store
        dispatch(setSelectedPost(null)); //set posts to null in redux store
        dispatch(setPosts([])); //set posts to empty array in redux store

        navigate('/login'); //redirect to login page
        toast.success(res.data.message); //show success message
      }
    } catch (error) {
      toast.error(error.response.data.message); //show error message
    }
  }

  const createPostHandler = () => {
    setOpen(true); //set open state to true to open the create post modal
  }

  const sidebarHandler = (textType) => {

    if (textType === "Logout") logoutHandler(); //call logout handler if the text is Logout
    else if (textType === "Create") createPostHandler(); //call create post handler if the text is Create
    else if (textType === "Profile") navigate(`/profile/${user?._id}`); //navigate to profile page if the text is Profile
    else if (textType === "Messages") navigate('/chat'); //navigate to chat page if the text is Messages
    else if (textType === "Home") navigate('/'); //navigate to home page if the text is Home
  }

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon:
        <Avatar className='w-6 h-6'>
          <AvatarImage src={user?.profilePicture} alt="img" />
          <AvatarFallback><img src={profilePhoto} alt='fallback' /></AvatarFallback>
        </Avatar>
      , text: "Profile"
    },
    { icon: <LogOut />, text: "Logout" },
  ]

  return (
    <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
      <div className='flex flex-col'>
        <div className='m-2'>
          <h1 className='font-bold text-2xl text-amber-300'>SocialHive</h1>
        </div>
        <div>
          {
            //sidebarItems: an array of objects that contains the icon and text for each sidebar item
            //used map function to iterate over the sidebarItems array and return a div for each item
            sidebarItems.map((item, index) => {
              return (
                <div onClick={() => sidebarHandler(item.text)} key={index} className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
                  {item.icon}
                  <span>{item.text}</span>
                  {
                    item.text === "Notifications" && likeNotification.length > 0 && (
                      <Popover>
                        <PopoverTrigger asChild>                       
                            <button className='absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600 left-6 bottom-6'>
                              {likeNotification.length}
                            </button>                      
                        </PopoverTrigger>
                        <PopoverContent>
                          <div>
                            {
                              likeNotification.length === 0 ? (
                                <p>No new notification</p>
                              ) : (
                                likeNotification.map((notification) => {
                                  return (
                                    <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                      <Avatar>
                                        <AvatarImage src={notification.userDetails?.profilePicture} alt="img" />
                                        <AvatarFallback><img src={profilePhoto} alt='fallback' /></AvatarFallback>
                                      </Avatar>
                                      <p className='text-sm'> <span className='font-bold'>{notification.userDetails?.username || "Someone"}</span> like your post</p>
                                    </div>
                                  )
                                })
                              )
                            }
                          </div>
                        </PopoverContent>
                      </Popover>
                    )
                  }
                </div>
              )
            })
          }
        </div>
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </div>
  )
}
