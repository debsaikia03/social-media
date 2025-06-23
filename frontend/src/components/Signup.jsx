import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Loader from './ui/Loader';
import { useSelector } from 'react-redux';

//flex: sets the display property of the element to flex; similar to display: flex
//items-center: similar to align-items: center
//justify-center: similar to justify-content: center
//w-screen: sets the width of the element to 100%, 100vw
//h-screen: sets the height of the element to 100%, 100vh

//my-4: sets the margin-top and margin-bottom of the element to 1rem; 1rem = 16px

//shadow-lg: adds shadown on the element
/*Tailwind provides multiple shadow utilities for different levels of depth:
shadow-sm: Small shadow.
shadow: Default shadow.
shadow-md: Medium shadow.
shadow-lg: Large shadow.
shadow-xl: Extra-large shadow.
shadow-2xl: Very large shadow.
shadow-none: Removes the shadow.
*/
//flex-col: sets the flex-direction of the element to column; similar to flex-direction: column
//gap-5: sets the gap between the children of the element to 1.25rem; 1.25rem = 20px
//border: adds default border:
/*border-width: 1px;
border-style: solid;
border-color: #e5e7eb;*/
//p-2: sets the padding of the element to 0.5rem; 0.5rem = 8px
//rounded-md: Applies medium border-radius to the element, giving it slightly rounded corners.
//w-full: sets the width of the element to 100%; 100% of the parent element's width
//focus:border-black: sets the border color of the element to black when it is focused
//focus:outline-none: removes the outline when the element is focused

//py-2 & px-4: adds vertical padding of 0.5rem and horizontal padding of 1rem


//useState is a hook that allows you to have state variables in functional components
export default function Signup() {

  const [input, setInput] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { user } = useSelector(store => store.auth); //get user from redux store

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

      const res = await axios.post('https://social-media-ttfc.onrender.com/api/v1/user/register', input, {

        headers: {
          'Content-Type': 'application/json' //specifies that the request body is in JSON format
        },
        withCredentials: true //Ensures that cookies (e.g., for authentication) are included in the request
      });
      if (res.data.success) {

        navigate('/');
        toast.success(res.data.message); // Display success message
        setInput({ //clears the input fields
          username: '',
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
          <p className='text-sm text-center'>Sign up to connect with your friends!</p>
        </div>
        <div>
          <label htmlFor="username" className='font-medium'>Username</label>
          <input
            type="text"
            name='username'
            value={input.username}
            onChange={changeEventHandler}
            placeholder='Enter your username'
            className='border p-2 rounded-md w-full my-2 focus:border-black focus:outline-none' required />
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
              Signup
            </button>
          )
        }
        <span className='text-center'>Already have an account? <Link to='/login' className='text-blue-600'>Login</Link></span>
      </form>

    </div>
  )
}