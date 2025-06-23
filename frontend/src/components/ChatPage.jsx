import React, { useEffect, useState } from 'react'
import profilePhoto from '../assets/profile-photo.webp';
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar';
import { MessageCircleCode } from 'lucide-react';
import { setSelectedUser } from '../redux/authSlice';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '../redux/chatSlice';


export default function ChatPage() {

  const [textMessage, setTextMessage] = useState('');
  const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth); //get user and suggestedUsers from redux store
  const { onlineUsers, messages } = useSelector(store => store.chat); //get onlineUsers from redux store
  const dispatch = useDispatch(); //useDispatch is a hook that returns a reference to the dispatch function from the Redux store, which is used to dispatch actions to the store

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(`https://social-media-ttfc.onrender.com/api/v1/message/send/${receiverId}`,{textMessage},{
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true //to send cookies with the request
      });
      if(res.data.success){
        dispatch(setMessages([...messages, res.data.newMessage])); //update the messages in the redux store
        setTextMessage(''); //clear the input field after sending the message
      }
    } catch (error) {
      console.log(error)
    }
  } 

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null)); //clear the selected user when the component unmounts
    }
  }, []);

  return (
    <div className='flex ml-[16%] h-screen'>
      <section className='w-full md:w-1/4 my-1'>
        <h1 className='font-bold mb-4 p-2 text-xl'>{user?.username}</h1>
        <hr className='mb-2 border-gray-300' />
        <div className='overflow-y-auto h-[80vh]'>
          {
            suggestedUsers.map((suggestedUser) => {
              const isOnline = onlineUsers.includes(suggestedUser?._id); //check if the suggested user is online
              return (
                <div onClick={() => dispatch(setSelectedUser(suggestedUser))} className='flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer'>
                  <Avatar className='w-14 h-14'>
                    <AvatarImage src={suggestedUser?.profilePicture} alt='img' />
                    <AvatarFallback><img src={profilePhoto} alt='fallback' /></AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col'>
                    <span className='font-medium'>{suggestedUser?.username}</span>
                    <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>{isOnline ? 'online' : 'offline'}</span>
                  </div>
                </div>
              )
            })
          }
        </div>
      </section>
      {
        selectedUser ? (
          <section className='flex-1 border-l border-l-gray-300 flex flex-col h-full'>
            <div className='flex items-center gap-3 py-2.5 px-3 border-b border-b-gray-300 sticky top-0 bg-white z-10'>
              <Avatar>
                <AvatarImage src={selectedUser?.profilePicture} alt='img' />
                <AvatarFallback><img src={profilePhoto} alt='fallback' /></AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <span >{selectedUser?.username}</span>
              </div>
            </div>
            <Messages selectedUser = {selectedUser}/>
            <div className='flex items-center p-4 border-t border-t-gray-300'>
             <input value={textMessage} onChange={(e) => setTextMessage(e.target.value)} type="text" className='flex-1 mr-2 p-2 border rounded-md focus-visible:ring-transperent' placeholder='Send a message...' />
              <button
              onClick={() => sendMessageHandler(selectedUser?._id)}
              type='submit'
              className="bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer">
              Send
            </button>
            </div>
          </section>
        ) : (
          
          <div className='flex-1 border-l border-l-gray-300 flex flex-col items-center justify-center mx-auto'>
                <MessageCircleCode className='w-32 h-32 my-4'/>
                <h1 className='font-medium text-xl'>Send a message to start a chat.</h1>
          </div>
          
        )
        
      }
    </div>
  )
}
