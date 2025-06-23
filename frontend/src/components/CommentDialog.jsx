import React, { useEffect, useState } from 'react'
import profilePhoto from '../assets/profile-photo.webp';
import { Dialog, DialogContent, DialogOverlay, DialogTrigger } from '@radix-ui/react-dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/Button'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setPosts } from '../redux/postSlice';

export default function CommentDialog({ open, setOpen }) {

    const [text, setText] = useState("");
    const {selectedPost, posts} = useSelector((store) => store.post); // Accessing the selected post from the Redux store
    const [comment, setComment] = useState([]);
    const dispatch = useDispatch();

    //useEffect to set comments when selectedPost changes
    // This effect runs when the selectedPost changes, ensuring that the comments are updated accordingly.
    useEffect(() => {
        if (selectedPost) {
            setComment(selectedPost.comments); // Set comments when selectedPost changes
        }
    },[selectedPost]);

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    }

    const sendMessageHandler = async (e) => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment]; // Append the new comment to the existing comments
                setComment(updatedCommentData); // Update local state with the new comment
                const updatedPostData = posts.map(p =>
                    p._id === selectedPost._id ? {
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

    return (
        <Dialog open={open}>
            <DialogOverlay className="fixed inset-0 bg-black/40 z-50" />
            <DialogContent
                onInteractOutside={() => setOpen(false)}
                className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-5xl p-0 bg-white rounded-lg shadow-lg flex flex-col z-50'>
                <div className='flex flex-1'>
                    <div className='w-1/2'>
                        <img className='w-full h-full aspect-square object-cover rounded-l-lg' src={selectedPost?.image} alt="post_img" />
                    </div>
                    <div className='w-1/2 flex flex-col justify-between'>
                        <div className='flex items-center justify-between p-4'>
                            <div className='flex items-center gap-3'>
                                <Link>
                                    <Avatar>
                                        <AvatarImage src={selectedPost?.author?.profilePicture} alt="img" />
                                        <AvatarFallback>
                                            <img src={profilePhoto} alt='fallback' />
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <Link className='font-semibold text-s'>{selectedPost?.author?.username}</Link>
                                </div>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <MoreHorizontal className="cursor-pointer" />
                                </DialogTrigger>
                                <DialogOverlay className="fixed inset-0 bg-black/40 z-50" />
                                <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-4 w-48 flex flex-col items-center text-sm text-center z-50 gap-y-2">
                                    <div className="w-full text-red-500 font-bold cursor-pointer">Unfollow</div>
                                    <div className="w-full cursor-pointer">Add to favorites</div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <hr className="border-gray-300" />
                        <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                            {
                                comment.map((comment)=> <Comment key={comment._id} comment={comment}/>)
                            }
                        </div>
                        <div className='p-4'>
                            <div className='flex items-center gap-2'>
                                <input type='text' value={text} onChange={changeEventHandler} placeholder='Add a comment...' className='w-full outline-none border text-sm border-gray-300 rounded-lg p-2 focus:border-blue-500' />
                                <Button variant='outline' disabled={!text.trim()} onClick={sendMessageHandler}>Send</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}