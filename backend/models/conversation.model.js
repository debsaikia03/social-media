import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({

    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }]

});

export const Conversation = mongoose.model('Conversation', conversationSchema); // Creating a Conversation model from the conversationSchema and exporting it to be used in other files

