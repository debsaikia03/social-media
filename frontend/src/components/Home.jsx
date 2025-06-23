import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import useGetAllPosts from '../hooks/useGetAllPosts'
import useGetSuggestedUsers from '../hooks/useGetSuggestedUsers'

//flex: Makes the element a flex container, enabling flexbox layout for its direct children. This allows you to control the alignment, direction, and spacing of child elements.
//flex-grow: Allows the element to grow and fill the available space in the flex container. It will take up any remaining space after other flex items have been sized.
export default function Home() {
  useGetAllPosts();
  useGetSuggestedUsers();
  return (
    <div className='flex'>
      <div className='flex-grow'>
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  )
}
