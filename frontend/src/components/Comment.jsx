import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar'
import profilePhoto from '../assets/profile-photo.webp';

export default function Comment({ comment }) {
    return (
        <div className='my-3'>
            <div className='flex gap-1 items-center'>
                <Avatar>
                    <AvatarImage src={comment?.author?.profilePicture} alt="img" />
                    <AvatarFallback>
                        <img src={profilePhoto} alt='fallback' />
                    </AvatarFallback>
                </Avatar>
                <h1 className='font-bold text-sm'>{comment?.author?.username} <span className='font-normal pl-1'>{comment?.text}</span></h1>
            </div>
        </div>
    )
}
