import express, { urlencoded } from 'express'; // Importing express and urlencoded middleware from express
import cors from 'cors'; // Importing cors middleware for handling Cross-Origin Resource Sharing
import cookieParser from 'cookie-parser'; // Importing cookie-parser middleware for parsing cookies
import dotenv from 'dotenv'; // Importing dotenv for accessing environment variables
import connectDB from './utils/db.js';// Importing the connectDB function from the db.js file
import userRoute from './routes/user.route.js'; // Importing the userRoute from the user.route.js file
import postRoute from './routes/post.route.js'; // Importing the postRoute from the post.route.js file
import messageRoute from './routes/message.route.js'; // Importing the messageRoute from the message.route.js file
import { app, server, io} from './socket/socket.js';
import path from 'path'; // Importing path module for handling file paths

dotenv.config({}); // Invoking the config method of dotenv to load environment variables from a .env file



const PORT = process.env.PORT || 3000; // Defining the port number on which the server will listen

const __dirname = path.resolve(); // Getting the absolute path of the current directory
console.log(__dirname)

app.get("/", (_, res) => {// Defining a route to send a response when the server is running

    return res.status(200).json({ 

        message: "Message from backend: Server is running",
        success: true 
    }) // Sending a JSON response with a message to frontend
});

//middlewares
app.use(express.json()); // Middleware to parse incoming JSON requests
app.use(cookieParser()); // Middleware to parse cookies
app.use(urlencoded({ extended: true })); // Middleware to parse URL-encoded data with the querystring library

const corsOptions = {
    origin: 'http://localhost:5173', // Allowing requests from this origin
    credentials: true, // Allowing credentials (cookies, authorization headers, etc.) to be sent in requests
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowing these HTTP methods
};
app.use(cors(corsOptions)); // Applying CORS middleware with the specified options //CORS middleware is used to enable Cross-Origin Resource Sharing which means that the server allows requests from a different origin (domain) than its own.

app.use((req, res, next) => {
  req.io = io;
  next();
});

//api will come here
app.use('/api/v1/user', userRoute);// Defining the base URL for the user routes
app.use('/api/v1/post', postRoute); 
app.use('/api/v1/message', messageRoute);

app.use(express.static(path.join(__dirname, "/frontend/dist"))); // Serving static files from the frontend/dist directory
app.get('*',(req, res) => { // Catch-all route to serve the index.html file for any other routes
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html")); // Sending the index.html file as a response
});

server.listen(PORT, () => {
  connectDB(); // Connecting to MongoDB
  console.log(`Server listening on port ${PORT}`); // Starting the server and logging the port number
});