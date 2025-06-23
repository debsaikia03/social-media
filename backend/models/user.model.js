import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    username: { // Username of the user
        type: String,
        required: true,
        unique: true
    },

    email: { // Email of the user
        type: String,
        required: true,
        unique: true
    },

    password: { // Password of the user
        type: String,
        required: true
    },

    profilePicture: { // Profile picture of the user
        type: String,
        default: ''
    },

    bio: { // Bio of the user
        type: String,
        default: ''
    },

    gender:{ // Gender of the user
        type: String,
        enum: ['male','female','others']
    },

    followers: [{ // Array of users that are following the current user

        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model
    }],

    following: [{ // Array of users that the current user is following

        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    posts: [{ // Array of posts created by the user

        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post' // Reference to the Post model
    }],

    bookmarks: [{ // Array of posts bookmarked by the user

        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
},{timestamps: true}); // timestamps option to automatically add createdAt and updatedAt fields to the schema

export const User = mongoose.model('User', userSchema); // Creating a User model from the userSchema and exporting it to be used in other files

