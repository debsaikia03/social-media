import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({

    text: { // Text of the comment
        type: String,
        required: true
    },

    author: { // Author of the comment

        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },

    post: { // Post on which the comment is made

        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', // Reference to the Post model
        required: true
    }
},{timestamps: true}); // timestamps option to automatically add createdAt and updatedAt fields to the schema

export const Comment = mongoose.model('Comment', commentSchema); // Creating a Comment model from the commentSchema and exporting it to be used in other files