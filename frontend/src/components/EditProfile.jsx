import React, { useRef, useState } from 'react'
import profilePhoto from '../assets/profile-photo.webp';
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar'
import { useDispatch, useSelector } from 'react-redux';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/TextArea'
import axios from 'axios';
import Loader from './ui/Loader';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setAuthUser } from '../redux/authSlice';
import Cropper from 'react-easy-crop'
import getCroppedImg from '../lib/cropImage'
import { readFileAsDataURL } from '../lib/utils'

export default function EditProfile() {

    const [imagePreview, setImagePreview] = useState("");
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const imageRef = useRef();
    const { user } = useSelector(store => store.auth); // Accessing the user from the Redux store
    const [loading, setLoading] = useState(false); // Accessing loading state from the Redux store
    const [input, setInput] = useState({// Initializing input state with user data
        profilePhoto: user?.profilePicture,
        bio: user?.bio,
        gender: user?.gender
    });
    
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const fileChangeHandler = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setInput({
                ...input,
                profilePhoto: file
            });
            const dataUrl = await readFileAsDataURL(file);
            setImagePreview(dataUrl);
        }
    };

    const selectChangeHandler = (value) => {
        setInput({
            ...input,
            gender: value
        });
    }

    const editProfileHandler = async (e) => {
        const formData = new FormData();
        formData.append('bio', input.bio);
        formData.append('gender', input.gender);

        // If a new photo is selected and cropped
        if (imagePreview && croppedAreaPixels) {
            const croppedBlob = await getCroppedImg(imagePreview, croppedAreaPixels);
            formData.append('profilePhoto', croppedBlob, input.profilePhoto.name || 'cropped.jpg');
        } else if (input.profilePhoto && typeof input.profilePhoto !== "string") {
            // fallback: if no cropping, just send the file
            formData.append('profilePhoto', input.profilePhoto);
        }

        try {
            setLoading(true);
            const res = await axios.post('http://localhost:8000/api/v1/user/profile/edit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedUserData = {
                    ...user,
                    bio: res.data.user?.bio,
                    profilePicture: res.data.user?.profilePicture,
                    gender: res.data.user.gender
                };
                dispatch(setAuthUser(updatedUserData));
                navigate(`/profile/${user?._id}`);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className='flex max-w-2xl mx-auto pl-10'>
            <section className='flex flex-col gap-6 w-full my-8'>
                <h1 className='font-bold text-xl'>Edit Profile</h1>
                <div className='flex flex-col items-center justify-between bg-gray-100 rounded-xl p-4 gap-4'>
                    <div className='flex items-center gap-3'>
                        <Avatar className="w-36 h-36">
                            {imagePreview ? (
                                <div className="relative w-36 h-36 rounded-full overflow-hidden bg-gray-200">
                                    <Cropper
                                        image={imagePreview}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={1}
                                        onCropChange={setCrop}
                                        onZoomChange={setZoom}
                                        onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
                                        showGrid={false}
                                        style={{
                                            containerStyle: {
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: '9999px',
                                                overflow: 'hidden'
                                            }
                                        }}
                                    />
                                </div>
                            ) : (
                                <>
                                    <AvatarImage src={user?.profilePicture} alt="img" />
                                    <AvatarFallback>
                                        <img src={profilePhoto} alt='fallback' />
                                    </AvatarFallback>
                                </>
                            )}
                        </Avatar>
                    </div>
                    <div className="mt-2">
                        <h1 className='font-bold'>{user?.username}</h1>
                    </div>
                    <input type="file" onChange={fileChangeHandler} className='hidden' ref={imageRef} />
                    <button
                        className='bg-blue-600 text-white font-normal py-1 px-3 rounded-md hover:bg-blue-500 cursor-pointer mt-4'
                        onClick={() => imageRef?.current.click()}
                    >
                        Change Photo
                    </button>
                </div>
                <div>
                    <h1 className='font-bold text-xl mb-2'>Bio</h1>
                    <textarea
                        value={input.bio}
                        onChange={(e) => setInput({
                            ...input,
                            bio: e.target.value
                        })}
                        name='bio'
                        className="flex min-h-[80px] w-full rounded-md border bg-white focus-visible:ring-transparent focus:border-transparent px-3 py-2"
                    />
                </div>
                <div>
                    <h1 className='font-bold text-xl mb-2'>Gender</h1>
                    <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
                        <SelectTrigger className="w-[180px] !bg-white !text-black">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="!bg-white !text-black">
                            <SelectGroup>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    {loading ? (
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
                            onClick={editProfileHandler}
                            type='submit'
                            className="bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                        >
                            Submit
                        </button>
                    )}
                </div>
            </section>
        </div>
    )
}
