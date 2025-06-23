import React from 'react'
import LeftSidebar from './LeftSidebar'
import { Outlet } from 'react-router-dom'
//Outlet: a placeholder where the child route content will be rendered

export default function MainLayout() {
  return (
    <div>
      <LeftSidebar/>
      <div>
        <Outlet/> 
      </div>
    </div>
  )
}
