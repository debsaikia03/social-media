import axios from "axios"
import React, { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setPosts } from "../redux/postSlice.js";

const useGetAllPosts = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const res = await axios.get('https://social-media-ttfc.onrender.com/api/v1/post/all', {
                    withCredentials: true
                });
                if (res.data.success) {
                    dispatch(setPosts(res.data.posts));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllPosts();
    }, []);
};

export default useGetAllPosts;