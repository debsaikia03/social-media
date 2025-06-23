import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

export const register = async (req, res) => {

    try {

        const { username, email, password } = req.body; // Destructuring the username, email, and password from the request body

        if (!username || !email || !password) { // Checking if any of the fields are missing
            return res.status(400).json({ // Returning an error response if any of the fields are missing
                message: "All fields are required.",
                success: false
            });
        }

        const user = await User.findOne({ email }); // Finding a user with the provided email if it already exists

        if (user) { //if user exists

            return res.status(400).json({ // Returning an error response if a user with the provided email already exists
                message: "User already exists, try different email.",
                success: false
            });
        };

        const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password using bcrypt
        await User.create({ // Creating a new user with the provided username, email, and password
            username,
            email,
            password: hashedPassword
        });

        return res.status(201).json({ // Returning a success response if the registration is successful
            message: "Account created successfully!",
            success: true
        });
    } catch (error) {

        console.error(`Error: ${error.message}`); // Logging an error message if the registration fails
    }
};

export const login = async (req, res) => {

    try {

        const { email, password } = req.body; // Destructuring the email and password from the request body

        if (!email || !password) { // Checking if any of the fields are missing
            return res.status(400).json({ // Returning an error response if any of the fields are missing
                message: "All fields are required!",
                success: false
            });
        }

        let user = await User.findOne({ email }); // Finding a user with the provided email if it exists

        if (!user) { //if user does not exist

            return res.status(404).json({ // Returning an error response if a user with the provided email does not exist
                message: "User not found, try again!",
                success: false
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password); // Comparing the provided password with the hashed password in the database

        if (!isPasswordMatch) { //if password does not match

            return res.status(401).json({ // Returning an error response if the password does not match
                message: "Incorrect email or password, try again",
                success: false
            });
        }

        //token: stores user's credentials and is used to authenticate the user automatically without the need to log in again, but has an expiration time
        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" }); // Creating a token with the user's id and a secret key

        //populate the user -> posts with the ids of the posts
        // posts: [id1, id2, id3]
        const populatedPosts = await Promise.all(
            user.posts.map(async (postId) => {

                const post = await Post.findById(postId);
                if (post.author.equals(user._id)) {
                    return post;
                } return null;
            })
        )
        //user details are sent to frontend by creating an object with only the required details
        user = {

            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts
        }



        //cookie will store the token and will be sent to the client's browser
        return res
            .cookie("token", token, {

                httpOnly: true,
                sameSite: 'strict',
                maxAge: 1 * 24 * 60 * 60 * 1000
            })
            .status(200).json({ // Returning a success response with the token in a cookie
                message: `Welcome back, ${user.username}!`,
                success: true,
                user // Sending the user details along with the success response
            });

    } catch (error) {

        console.error(`Error: ${error.message}`); // Logging an error message if the login fails


    }
};

export const logout = async (req, res) => {

    try {

        // Clearing the token in the cookie and returning a success response
        return res
            .cookie("token", "", { maxAge: 0 })
            .status(200).json({
                message: "Logged out successfully.",
                success: true
            });
    } catch (error) {

        console.error(`Error: ${error.message}`); // Logging an error message if the logout fails
    }
};

export const getProfile = async (req, res) => {

    try {

        const userId = req.params.id; // Getting the user id from the request parameters
        let user = await User.findById(userId)
            .populate({ path: 'posts', createdAt: -1 })
            .populate('bookmarks');

        return res.status(200).json({ // Returning a success response with the user details
            user,
            success: true
        });
    } catch (error) {

        console.error(`Error: ${error.message}`); // Logging an error message if the profile retrieval fails
    }
};

export const editProfile = async (req, res) => {

    try {// we will build a middleware to get the user id from the token and pass it to the req object //middleware -> isAuthenticated.js

        const userId = req.id; // Getting the user id from the request object
        const { bio, gender } = req.body; // Destructuring
        const profilePicture = req.file; // Getting the profile picture from the request file

        let cloudResponse; // Declaring a variable to store the cloudinary response

        if (profilePicture) {
            //convert the image to a block of code
            // we have make URI of the image to upload it to cloudinary  
            //utils -> datauri.js 
            //datauri: converts the image to a URI

            const fileUri = getDataUri(profilePicture); // Converting the image to a data URI
            cloudResponse = await cloudinary.uploader.upload(fileUri); // Uploading the image to cloudinary            
        }

        const user = await User.findById(userId).select('-password'); // Finding a user with the provided user id
        if (!user) {

            return res.status(404).json({ // Returning an error response if the user is not found
                message: "User not found, try again!",
                success: false
            });
        }

        if (bio) user.bio = bio; // Updating the bio if it is provided
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url; // Updating the profile picture if it is provided

        await user.save(); // Saving the updated user details

        return res.status(200).json({ // Returning a success response with the updated user details
            message: "Profile updated successfully.",
            success: true,
            user
        });

    } catch (error) {

        console.error(`Error: ${error.message}`); // Logging an error message if the profile editing fails 
    }
};

export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                message: 'Currently do not have any users',
            })
        };
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.log(error);
    }
};

export const followOrUnfollowUser = async (req, res) => {

    try {

        const wantsToFollowId = req.id; // Getting the user id who wants to follow or unfollow //no params needed since already logged in
        const whomToFollowId = req.params.id; // Getting the user id who is to be followed or unfollowed //params needed to get the id of the user

        if (wantsToFollowId === whomToFollowId) {

            return res.status(400).json({ // Returning an error response if the user tries to follow or unfollow themselves
                message: "You cannot follow or unfollow yourself!",
                success: false
            });
        }

        const user = await User.findById(wantsToFollowId); // Finding the user who wants to follow or unfollow
        const targetUser = await User.findById(whomToFollowId); // Finding the user who is to be followed or unfollowed

        if (!user || !targetUser) {  // Returning an error response if the user or the target user is not found

            return res.status(404).json({
                message: "User or target user not found.",
                success: false
            });
        }

        //Check if user want to follow or unfollow another user
        const isFollowing = user.following.includes(whomToFollowId); // Checking if the user is already following the target user
        if (isFollowing) {
            //unfollow logic
            //remove the target user from the following array of the user

            await Promise.all([

                User.updateOne({ _id: wantsToFollowId }, { $pull: { following: whomToFollowId } }), // Adding the target user to the following array of the user

                User.updateOne({ _id: whomToFollowId }, { $pull: { followers: wantsToFollowId } }) // Adding the user to the followers array of the target user
            ])

            return res.status(200).json({ // Returning a success response if the user unfollows the target user
                message: "User unfollowed successfully.",
                success: true
            });

        } else {
            //follow logic
            //add the target user to the following array of the user

            //if we handle two or more async functions/documents (in this case, user & targetUser), we can use Promise.all() to handle them at the same time
            await Promise.all([

                User.updateOne({ _id: wantsToFollowId }, { $push: { following: whomToFollowId } }), // Adding the target user to the following array of the user

                User.updateOne({ _id: whomToFollowId }, { $push: { followers: wantsToFollowId } }) // Adding the user to the followers array of the target user
            ])

            return res.status(200).json({ // Returning a success response if the user follows the target user

                message: "User followed successfully.",
                success: true
            });
        }

    } catch (error) {

        console.error(`Error: ${error.message}`); // Logging an error message if the follow or unfollow fails

    }

}
