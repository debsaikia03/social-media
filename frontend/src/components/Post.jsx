import React, { useState } from 'react'
import profilePhoto from '../assets/profile-photo.webp';
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar'
import * as Dialog from '@radix-ui/react-dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send, X } from 'lucide-react'
import { Button } from './ui/Button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6"
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { setPosts, setSelectedPost } from '../redux/postSlice';
import { setBookmarks, setUserProfile, setAuthUser } from '../redux/authSlice';

/*
Dialog Functionality
Dialog.Root:
This is the root provider for the dialog state (open/close).

Dialog.Trigger asChild:
The MoreHorizontal icon(...) is wrapped with Dialog.Trigger asChild, making it the clickable element that opens the dialog.

Dialog.Portal:
Ensures the dialog and its overlay are rendered at the root of the DOM, above all other content.

Dialog.Overlay:
This is a full-screen, semi-transparent black background (bg-black/40) that appears when the dialog is open, graying out the rest of the UI.

Dialog.Content:
The modal window itself.

Positioning:
fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 centers the dialog in the viewport.
Styling:
White background, rounded corners, shadow, padding, and a fixed width (w-48).
The content is vertically stacked and centered.
Button:
Inside the dialog, there’s a single "Unfollow" button styled in red */


export default function Post({ post }) {

    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const { user } = useSelector((store) => store.auth); // Accessing the user from the Redux store
    const { posts } = useSelector((store) => store.post); // Accessing posts from the Redux store
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false); // Initialize like state based on whether the user has liked the post
    const [postLike, setPostLike] = useState(post.likes.length); // Initialize post likes count
    const [comment, setComment] = useState(post.comments);
    // Example if you have user.bookmarks array

    const { userProfile } = useSelector((store) => store.auth);

    const bookmarked = user?.bookmarks?.includes(post?._id);
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    }

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like'; // Determine action based on current like state
            const res = await axios.get(`https://social-media-ttfc.onrender.com/api/v1/post/${post._id}/${action}`, {
                withCredentials: true,
            });
            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1; // Update likes count based on action
                setPostLike(updatedLikes); // Update local state for likes count
                setLiked(!liked);

                //update post 
                const updatedPost = posts.map(p =>
                    p._id === post._id ? {
                        ...p,
                        likes: liked ? p.likes.filter(id => id !== user.id) : [...p.likes, user._id] // Update likes array based on action //filter out the user ID if disliked, or add it if liked
                    } : p
                );
                dispatch(setPosts(updatedPost)); // Dispatch the updated posts to the Redux store
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const commentHandler = async (e) => {
        try {
            const res = await axios.post(`https://social-media-ttfc.onrender.com/api/v1/post/${post?._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            console.log(res.data);
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment]; // Append the new comment to the existing comments
                setComment(updatedCommentData); // Update local state with the new comment
                const updatedPostData = posts.map(p =>
                    p._id === post._id ? {
                        ...p,
                        comments: updatedCommentData // Update the comments array in the post
                    } : p
                );

                dispatch(setPosts(updatedPostData)); // Dispatch the updated posts to the Redux store

                toast.success("Comment added successfully");
                setText(""); // Clear the input field after adding the comment
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    }

    const deletePostHandler = async () => {

        try {
            const res = await axios.delete(`https://social-media-ttfc.onrender.com/api/v1/post/delete/${post?._id}`, {
                withCredentials: true,
            });
            if (res.data.success) {
                const updatedPosts = posts.filter((postItem) => postItem?._id !== post?._id);// Filter out the deleted post from the posts array
                dispatch(setPosts(updatedPosts)); // Update the Redux store with the new posts array
                toast.success("Post deleted successfully");
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    }

    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`https://social-media-ttfc.onrender.com/api/v1/post/${post?._id}/bookmark`, {
                withCredentials: true,
            });
            if (res.data.success) {
                if (res.data.bookmarks) {
                    dispatch(setBookmarks(res.data.bookmarks)); // update bookmarks in Redux

                    // Also update the logged-in user's bookmarks in Redux
                    dispatch(setAuthUser({ ...user, bookmarks: res.data.bookmarks }));
                }
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleFollowToggle = async () => {
        if (!post.author || !user) return;
        try {
            const res = await axios.get(
                `https://social-media-ttfc.onrender.com/api/v1/user/followorunfollow/${post.author._id}`,
                { withCredentials: true }
            );
            if (res.data.success) {
                toast.success(res.data.message);
                let updatedFollowers = [...(post.author.followers || [])];
                let updatedFollowing = [...(user.following || [])];
                const isFollowing = updatedFollowers.includes(user._id);

                if (isFollowing) {
                    updatedFollowers = updatedFollowers.filter(id => id !== user._id);
                    updatedFollowing = updatedFollowing.filter(id => id !== post.author._id);
                } else {
                    updatedFollowers.push(user._id);
                    updatedFollowing.push(post.author._id);
                }

                // Update posts
                const updatedPosts = posts.map(p =>
                    p._id === post._id
                        ? { ...p, author: { ...p.author, followers: updatedFollowers } }
                        : p
                );
                dispatch(setPosts(updatedPosts));

                // Update userProfile in Redux if the post author is the profile being viewed
                if (userProfile && userProfile._id === post.author._id) {
                    dispatch(setUserProfile({ ...userProfile, followers: updatedFollowers }));
                }

                // Update logged-in user's following in Redux
                dispatch(setAuthUser({ ...user, following: updatedFollowing }));
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something went wrong!');
        }
    };

    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={post.author?.profilePicture} alt="img" />
                        <AvatarFallback><img src={profilePhoto} alt='fallback' /></AvatarFallback>
                    </Avatar>
                    <h1>{post.author.username}</h1>
                </div>
                <Dialog.Root>
                    <Dialog.Trigger asChild>
                        <MoreHorizontal className='cursor-pointer' />
                    </Dialog.Trigger>
                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
                        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-4 w-48 flex flex-col items-center text-sm text-center z-50 gap-y-2">
                            {user && user._id !== post.author._id && (
                                (post.author.followers || []).includes(user._id) ? (
                                    <button
                                        className="bg-gray-300 text-black font-normal py-1 px-3 rounded-md hover:bg-gray-400 cursor-pointer"
                                        onClick={handleFollowToggle}
                                    >
                                        Unfollow
                                    </button>
                                ) : (
                                    <button
                                        className="bg-[#0095F6] text-white font-normal py-1 px-3 rounded-md hover:bg-blue-500 cursor-pointer"
                                        onClick={handleFollowToggle}
                                    >
                                        Follow
                                    </button>
                                )
                            )}
                            <Button
                                variant='ghost'
                                className='cursor-pointer w-fit'
                                onClick={bookmarkHandler}
                            >
                                {bookmarked ? 'Add to favorites' : 'Remove from favorites'}
                            </Button>
                            {
                                user && user?._id === post.author?._id && <Button onClick={deletePostHandler} variant='ghost' className='cursor-pointer w-fit text-[#ED4956] font-bold'>Delete</Button>
                            }
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
            </div>
            <img className='rounded-sm my-2 w-full aspect-square object-cover' src={post.image} alt="post_img" />

            <div className='flex items-center justify-between my-2'>
                <div className='flex items-center gap-3'>
                    {
                        liked ? <FaHeart onClick={likeOrDislikeHandler} size={'24'} className='cursor-pointer text-red-600' /> :
                            <FaRegHeart onClick={likeOrDislikeHandler} size={'24px'} className='cursor-pointer hover:text-gray-600' />
                    }
                    <MessageCircle onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpen(true)
                    }} className='cursor-pointer hover:text-gray-600' />
                    <Send className='cursor-pointer hover:text-gray-600' />
                </div>
                {bookmarked ? (
                    <FaRegBookmark
                        onClick={bookmarkHandler}
                        size={24}
                        className="cursor-pointer text-black hover:text-gray-600"
                    />
                ) : (
                    <FaBookmark
                        onClick={bookmarkHandler}
                        size={24}
                        className="cursor-pointer hover:text-gray-600"
                    />
                )}
            </div>

            <span className='font-medium block mb-2'>{postLike} likes</span>
            <p>
                <span className='font-medium mr-2'>{post.author?.username}</span>
                {post.caption}
            </p>

            {post.comments && post.comments.length > 0 && (
                <div className="mt-1 text-sm text-gray-700">
                    <span className="font-semibold">
                        {post.comments[post.comments.length - 1]?.author?.username || "unknown"}
                    </span>{" "}
                    <span>
                        {post.comments[post.comments.length - 1]?.text}
                    </span>
                </div>
            )}
            {
                comment.length > 0 &&
                <span onClick={() => {
                    dispatch(setSelectedPost(post));
                    setOpen(true)
                }} className='cursor-pointer text-sm text-gray-400'>View all {comment.length} comments</span>
            }

            <CommentDialog open={open} setOpen={setOpen} />

            <div className='flex items-center justify-between'>
                <input type="text" placeholder='Add a comment...' className='outline-none text-sm w-full' onChange={changeEventHandler} value={text} />
                {
                    text && <span onClick={commentHandler} className='text-[#3BADF8] cursor-pointer'>Send</span>
                }
            </div>
        </div>
    )
}