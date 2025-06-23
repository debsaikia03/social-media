import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config({}); // Invoking the config method of dotenv to load environment variables from a .env file

cloudinary.config({

    cloud_name: process.env.CLOUD_NAME, // Getting the cloud name from the environment variables
    api_key: process.env.API_KEY, // Getting the API key from the environment variables
    api_secret: process.env.API_SECRET // Getting the API secret from the environment variables
});

export default cloudinary; // Exporting the cloudinary object to be used in other files