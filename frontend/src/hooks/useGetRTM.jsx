import axios from "axios"
import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setMessages } from "../redux/chatSlice";


const useGetRTM = () => {
    const dispatch = useDispatch();
    const {socket} = useSelector(store => store.socketio); //get socket from redux store
    const {messages} = useSelector(store => store.chat); //get messages from redux store

    useEffect(() => {
       socket?.on('newMessage', (newMessage) => {
            dispatch(setMessages([...messages, newMessage])); //update the messages in the redux store with the new message received from the socket
       })       

       return ()=> {
              socket?.off('newMessage'); //clean up the event listener when the component unmounts
       }
    }, [messages, setMessages]);
};

export default useGetRTM;