import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoutes({children}) {
    const {user} = useSelector(store => store.auth); // Get user from redux store
    const navigate = useNavigate(); // useNavigate is a hook from react-router-dom that returns a function that lets you navigate programmatically

    useEffect(() => {
        if(!user) {
            navigate('/login'); // If user is not logged in, redirect to login page
        }
    })
  return (
    <>
    {children}
    </>
  )
}

