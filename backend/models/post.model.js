import mongoose from "mongoose";
import { Comment } from "./comment.model.js"; // Importing the Comment model to reference it in the Post schema
import { User } from "./user.model.js"; // Importing the User model to reference it in the Post schema

const postSchema = new mongoose.Schema({

    caption: { // Caption of the post
        type: String,
        default: ''
    },

    image: { // Image of the post
        type: String,
        required: true
    },

    author: { // Author of the post
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },

    likes: [{ // Array of users that liked the post

        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    comments: [{ // Array of comments on the post

        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment' // Reference to the Comment model
    }]
},{timestamps: true}); // timestamps option to automatically add createdAt and updatedAt fields to the schema

export const Post = mongoose.model('Post', postSchema); // Creating a Post model from the postSchema and exporting it to be used in other files 