import React, { useEffect, useRef } from 'react'
import profilePhoto from '../assets/profile-photo.webp';
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetAllMessages from '../hooks/useGetAllMessages';
import useGetRTM from '../hooks/useGetRTM';

export default function Messages({ selectedUser }) {
    useGetRTM(); //custom hook to handle real-time messaging updates
    useGetAllMessages(); //custom hook to fetch all messages for the selected user
    const {messages} = useSelector(store=>store.chat); //get messages from redux store
    const { user } = useSelector(store => store.auth); //get user from redux store

    // Ref for the bottom of the messages list
    const bottomRef = useRef(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);
    
    return (
        <div className='overflow-y-auto flex-1 p-4'>
            <div className='flex justify-center'>
                <div className='flex flex-col items-center'>
                    <Avatar className='w-24 h-24 mb-2'>
                        <AvatarImage src={selectedUser?.profilePicture} alt='img' />
                        <AvatarFallback><img src={profilePhoto} alt='fallback' /></AvatarFallback>
                    </Avatar>
                    <span className='my-2'>{selectedUser?.username}</span>
                    <Link to={`/profile/${selectedUser?._id}`}>
                        <button
                            className="bg-gray-200 text-black font-medium py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer">
                            View Profile
                        </button></Link>
                </div>
            </div>
            <div className='flex flex-col gap-3'>
             {
                messages && messages.map((msg) => {
                   return (
                    <div key={msg._id} className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-2 rounded-lg max-w-xs break-words ${msg.senderId === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                            {msg.message}
                        </div>
                    </div>
                   )
                })
             }
            <div ref={bottomRef} /> {/* Reference for scrolling to bottom */}
            </div>
        </div>
    )
}
