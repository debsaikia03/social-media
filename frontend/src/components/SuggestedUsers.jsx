import React from 'react'
import profilePhoto from '../assets/profile-photo.webp';
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function SuggestedUsers() {
const suggestedUsers = useSelector(store => store.auth.suggestedUsers);
console.log("Redux suggestedUsers:", suggestedUsers);

 // Accessing the suggested users from the Redux store
    return (
        <div className='my-10'>
            <div className='flex  items-center justify-between gap-2'>
                <h1 className='font-semibold text-gray-600'>
                    Suggested for you
                </h1>
                <span className='font-medium cursor-pointer text-blue-400'>See All</span>
            </div>
            {
                suggestedUsers.map((user) => {
                    return (
                        <div key={user._id} className='flex items-center justify-between my-2' >
                            <div className='flex items-center gap-2'>
                                <Link to={`/profile/${user?._id}`}>
                                    <Avatar>
                                        <AvatarImage src={user?.profilePicture} alt="img" />
                                        <AvatarFallback><img src={profilePhoto} alt='fallback' /></AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <h1 className='font-semibold'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
                                    <span className='text-gray-600 text-sm'>{user?.bio || "Bio here..."}</span>
                                </div>
                            </div>
                            <span className='text-[#3BADF8] text-s font-normal cursor-pointer hover:text-[#78bbe8]'>Follow</span>
                        </div>
                    )
                })
            }
        </div>
    )
}
