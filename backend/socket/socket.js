import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
import dotenv from 'dotenv'; // Importing dotenv for accessing environment variables

dotenv.config({}); // Invoking the config method of dotenv to load environment variables from a .env file

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.URL, // Update with your frontend URL
        methods: ['GET', 'POST'],
    },
});

const userSocketMap = {}; //this map stores socket id corresponding to user id; userId -> socketId

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];//function to get the receiver's socket id from the userSocketMap

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId; //get userId from query params
    if (userId) {
        userSocketMap[userId] = socket.id; //store the socket id in the map
        console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap)); //emit online users to all clients

    socket.on('disconnect', () => {
        if (userId) {
            delete userSocketMap[userId]; //remove the socket id from the map when user disconnects
            console.log(`User ${userId} disconnected`);
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap)); //emit updated online users to all clients
    });
});

export  {app, server, io}; //export app, server and io for use in other files