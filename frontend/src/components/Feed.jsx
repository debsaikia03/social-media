import React from 'react'
import Posts from './Posts'

//flex-1 my-8 flex flex-col items-center pl-[20%]
/*
flex-1: Makes the element grow to fill the available space in a flex container (flex-grow: 1).
my-8: Adds vertical margin (margin-top and margin-bottom) of 2rem (32px) on both sides.
flex: Makes the element a flex container (enables flexbox layout).
flex-col: Arranges child elements in a column (vertical) direction.
items-center: Centers child elements horizontally along the cross axis (like align-items: center).
pl-[20%]: Adds left padding of 20% of the parent/container width (using Tailwind’s arbitrary value syntax). */

export default function Feed() {
  return (
    <div className='flex-1 my-8 flex flex-col items-center pl-[20%]'>
      <Posts/>
    </div>
  )
}
