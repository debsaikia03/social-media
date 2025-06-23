import { React, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Loader from './ui/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '../redux/authSlice.js'; // Import the action to set the authenticated user

export default function Login() {

  const [input, setInput] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector(store => store.auth); // Get user from redux store

  const changeEventHandler = (e) => {
    setInput({
      ...input, //spread operator: spreads the current state of the input object and allows you to add or update the value of the property that you want to change; here, it spreads the current state of the input object
      [e.target.name]: e.target.value //e.target.name: the name attribute of the input element that triggered the event; e.target.value: the value of the input element that triggered the event
    })
  }

  const signupHandler = async (e) => {
    e.preventDefault(); //prevents the default behavior of the form element, which is to submit the form data to the server and refresh the page -> the data will be saved in the state and the page will not be refreshed
    console.log(input);
    try {

      setLoading(true);

      const res = await axios.post('http://localhost:8000/api/v1/user/login', input, {

        headers: {
          'Content-Type': 'application/json' //specifies that the request body is in JSON format
        },
        withCredentials: true //Ensures that cookies (e.g., for authentication) are included in the request
      });
      if (res.data.success) {

        dispatch(setAuthUser(res.data.user)); // Dispatch the action to set the authenticated user in the Redux store
        navigate("/");
        toast.success(res.data.message); // Display success message
        setInput({ //clears the input fields
          email: '',
          password: ''
        });
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong!"); //displays a success message
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if(user){
      navigate('/'); // If user is already logged in, redirect to home page
    }
  },[]);

  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
        <div className='my-0'>
          <h1 className='text-center font-bold text-xl text-amber-300'>SocialHive</h1>
          <p className='text-sm text-center'>Login to see your friends' photos & videos!</p>
        </div>
        <div>
          <label htmlFor="email" className='font-medium'>Email</label>
          <input
            type="email"
            name='email'
            value={input.email}
            onChange={changeEventHandler}
            placeholder='Enter your email'
            className='border p-2 rounded-md w-full my-2 focus:border-black focus:outline-none' required />
        </div>
        <div>
          <label htmlFor="password" className='font-medium'>Password</label>
          <input
            type="password"
            name='password'
            value={input.password}
            onChange={changeEventHandler}
            placeholder='Enter your password'
            className='border p-2 rounded-md w-full my-2 focus:border-black focus:outline-none' required />
        </div>
        {
          loading ? (
            <button
              type='submit'
              className="bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer flex items-center justify-center gap-2"
              disabled
            >
              <Loader />
              Please wait
            </button>
          ) : (
            <button
              type='submit'
              className="bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
            >
              Login
            </button>
          )
        }
        <span className='text-center'>Don't have an account? <Link to='/signup' className='text-blue-600'>Signup</Link></span>
      </form>

    </div>
  )
}



