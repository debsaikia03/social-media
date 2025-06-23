import React, { useRef, useState, useCallback } from 'react'
import profilePhoto from '../assets/profile-photo.webp';
import { Dialog, DialogContent, DialogHeader } from './ui/Dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar'
import { Textarea } from './ui/TextArea'
import { Button } from './ui/Button'
import Loader from './ui/Loader'
import { readFileAsDataURL } from '../lib/utils';
import { toast } from 'react-toastify';
import axios from 'axios';
import { setPosts } from '../redux/postSlice';
import { useDispatch, useSelector } from 'react-redux';
import Cropper from 'react-easy-crop'
import getCroppedImg from '../lib/cropImage'


export default function CreatePost({ open, setOpen }) {

  const imageRef = useRef(); //useRef is used to access the file input element
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState("");
  const { user } = useSelector(store => store.auth); //useSelector is used to access the user from the Redux store
  const { posts } = useSelector(store => store.post); //useSelector is used to access the posts from the Redux store
  const dispatch = useDispatch();//useDispatch is used to dispatch actions to the Redux store

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);


  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  }

  const createPostHandler = async (e) => {
    if (e) e.preventDefault();
    const formData = new FormData();
    formData.append('caption', caption);

    // Crop the image before sending
    if (imagePreview && croppedAreaPixels) {
      const croppedBlob = await getCroppedImg(imagePreview, croppedAreaPixels);
      formData.append('image', croppedBlob, file.name || 'cropped.jpg');
    }

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/v1/post/addpost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      if (res && res.data && res.data.success) {
        dispatch(setPosts([res.data.post, ...posts])); //[1] -> [1,2] -> elements are added to the posts array
        //spread operator is used to create a new array with the existing posts and the new post
        setOpen(false);
        toast.success(res.data.message);

        // Reset form state after successful post
        setFile("");
        setCaption("");
        setImagePreview("");
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Dialog open={open}>
        <DialogContent
          onInteractOutside={() => setOpen(false)}
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-3xl !bg-white rounded-lg shadow-lg flex flex-col z-50 p-6"
        >
          <DialogHeader className='text-center font-semibold'>Create New Post</DialogHeader>
          <div className='flex gap-3 items-center'>
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="img" />
              <AvatarFallback>
                <img src={profilePhoto} alt='fallback' />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className='font-semibold text-s'>{user?.username}</h1>
            </div>
          </div>
          <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="!bg-white focus-visible:ring-transparent border" placeholder="Write a caption..." />
          {
            imagePreview && (
              <div className="w-full max-w-s aspect-square bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 relative  " >
                <Cropper
                  image={imagePreview}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  showGrid={true}
                  style={{
                    containerStyle: {
                      width: '100%',
                      height: '100%',
                    },
                  }}
                />
              </div>
            )
          }
          <input ref={imageRef} type="file" className='hidden' onChange={fileChangeHandler} />
          <div className='flex items-center justify-center gap-x-4'>
            <Button onClick={() => imageRef.current.click()} className='w-full mx-auto !bg-[#0095F6] !text-white hover:!bg-[#258bcf]'>
              Select from computer
            </Button>
            {imagePreview && (
              loading ? (
                <Button className='w-full mx-auto !bg-[#0095F6] !text-white disabled'>
                  <span className="flex items-center gap-2">
                    <Loader />
                    Please wait
                  </span>
                </Button>
              ) : (
                <Button onClick={createPostHandler} type='submit' className='w-full mx-auto !bg-[#0095F6] !text-white hover:!bg-[#258bcf]'>Post</Button>
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}