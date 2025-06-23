import React from 'react'
import profilePhoto from '../assets/profile-photo.webp';
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';

export default function RightSidebar() {

  const { user } = useSelector(store => store.auth); // Accessing the user from the Redux store

  return (
    <div className='w-fit my-10 pr-32'>
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

      <SuggestedUsers/>
    </div>
  )
}
