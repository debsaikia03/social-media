import mongoose from "mongoose";

const connectDB = async () => {

    try{

        mongoose.connect(process.env.MONGO_URI); // Connecting to MongoDB using the MONGO_URI environment variable
        console.log('MongoDB connected successfully'); // Logging a success message if the connection is successful
    } catch (error){

        console.error(`Error: ${error.message}`); // Logging an error message if the connection fails
    }
}

export default connectDB; // Exporting the connectDB function to be used in other files