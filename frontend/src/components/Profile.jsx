import React, { useState } from 'react'
import profilePhoto from '../assets/profile-photo.webp';
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar'
import useGetUserProfile from '../hooks/useGetUserProfile'
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, MessageCircle } from 'lucide-react';
import { setUserProfile } from '../redux/authSlice';
import { toast } from 'react-toastify';
import axios from 'axios';


export default function Profile() {
  const params = useParams(); // useParams is a hook from react-router-dom that returns an object of key/value pairs of URL parameters. In this case, it will contain the user ID from the URL.
  const userId = params.id; // Extracting the user ID from the URL parameters
  useGetUserProfile(userId); // Fetching the user profile using the custom hook

  const [activeTab, setActiveTab] = useState('posts'); // State to manage the active tab (posts or saved)

  const handleTabChange = (tab) => {
    setActiveTab(tab); // Function to change the active tab
  }

  const dispatch = useDispatch(); // Using useDispatch to dispatch actions to the Redux store
  const { userProfile, user } = useSelector(store => store.auth); // Accessing the user profile from the Redux store

  const isLoggedInProfile = user?._id === userProfile?._id; // Check if the logged-in user is viewing their own profile
  const isFollowing = userProfile?.followers?.includes(user?._id);

  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks; // Posts to be displayed, defaulting to an empty array if undefined

  const handleFollowToggle = async () => {
    if (!userProfile || !user) return;
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/user/followorunfollow/${userProfile?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        let updatedFollowers = [...(userProfile.followers || [])];
        if (isFollowing) {
          updatedFollowers = updatedFollowers.filter(id => id !== user._id);
        } else {
          updatedFollowers.push(user._id);
        }
        dispatch(setUserProfile({ ...userProfile, followers: updatedFollowers }));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <div className="flex-1 ml-[16%] min-h-screen">
      <div className='flex max-w-5xl justify-between mx-auto pl-10 w-full'>
        <div className='flex flex-col gap-20 p-8 '>
          <div className='grid grid-cols-2'>
            <section className='flex items-center justify-center'>
              <Avatar className='w-40 h-40'>
                <AvatarImage src={userProfile?.profilePicture} alt="img" />
                <AvatarFallback><img src={profilePhoto} alt='fallback' /></AvatarFallback>
              </Avatar>
            </section>
            <section>
              <div className='flex flex-col gap-5'>
                <div className='flex items-center gap-5'>
                  <span className='font-semibold'>{userProfile?.username}</span>
                  {userProfile?.gender === 'male' && (
                    <span className="text-s text-gray-500 font-medium">he/him</span>
                  )}
                  {userProfile?.gender === 'female' && (
                    <span className="text-s text-gray-500 font-medium">she/her</span>
                  )}
                  {
                    isLoggedInProfile ? (

                      <Link to={"/account/edit"}>
                        <button className="bg-gray-300 text-black font-normal py-1 px-3 rounded-md hover:bg-gray-400 cursor-pointer">
                          Edit Profile
                        </button>
                      </Link>
                    ) : (
                      isFollowing ? (
                        <>
                          <button
                            className="bg-gray-300 text-black font-normal py-1 px-3 rounded-md hover:bg-gray-400 cursor-pointer"
                            onClick={handleFollowToggle}
                          >
                            Unfollow
                          </button>
                          <button className="bg-gray-300 text-black font-normal py-1 px-3 rounded-md hover:bg-gray-400 cursor-pointer">
                            <Link to ={`/chat`}>Message</Link>
                          </button>
                        </>
                      ) : (
                        <button
                          className="bg-[#0095F6] text-white font-normal py-1 px-3 rounded-md hover:bg-blue-500 cursor-pointer"
                          onClick={handleFollowToggle}
                        >
                          Follow
                        </button>
                      )
                    )
                  }
                </div>
                <div className='flex items-center gap-4'>
                  <p><span className='font-semibold'> {userProfile?.posts.length} </span>posts</p>
                  <p><span className='font-semibold'> {userProfile?.followers.length} </span>followers</p>
                  <p><span className='font-semibold'> {userProfile?.following.length} </span>following</p>
                </div>
                <div className='flex flex-col gap-1'>
                  <span className='font-semibold'>{userProfile?.bio || "bio here..."}</span>
                </div>
              </div>
            </section>
          </div>
          <div className='border-t border-t-gray-200'>
            <div className='flex items-center justify-center gap-x-50 text-sm '>
              <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ''}`} onClick={() => handleTabChange('posts')}>
                POSTS
              </span>
              <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ''}`} onClick={() => handleTabChange('saved')}>
                SAVED
              </span>
            </div>
            <div className='grid grid-cols-3 gap-1'>
              {
                displayedPost?.map((post) => {
                  return (
                    <div key={post?._id} className='relative group cursor-pointer overflow-hidden'>
                      <img src={post.image} alt="post_img" className='rounded-sm  my-2 w-full aspect-square object-cover' />
                      <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 my-2 rounded-sm  group-hover:opacity-60 transition-opacity duration-300' >
                        <div className='flex items-center text-white space-x-4'>
                          <button className='flex items-center gap-2 hover:text-gray-300'>
                            <Heart />
                            <span>{post?.likes.length}</span>
                          </button>
                          <button className='flex items-center gap-2 hover:text-gray-300'>
                            <MessageCircle />
                            <span>{post?.comments.length}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
