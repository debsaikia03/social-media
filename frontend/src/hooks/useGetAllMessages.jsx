import axios from "axios"
import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setMessages } from "../redux/chatSlice";


const useGetAllMessages = () => {
    const dispatch = useDispatch();
    const {selectedUser} = useSelector(store => store.auth);

    useEffect(() => {
        // Clear messages when selectedUser changes
        dispatch(setMessages([]));

        const fetchAllMessages = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/message/all/${selectedUser?._id}`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    dispatch(setMessages(res.data.messages));
                }
            } catch (error) {
                console.log(error);
            }
        }
        if (selectedUser?._id) {
            fetchAllMessages();
        }
    }, [selectedUser, dispatch]);
};

export default useGetAllMessages;