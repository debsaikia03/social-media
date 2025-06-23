import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({

    senderId: { // ID of the sender of the message
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
    },

    receiverId: { // ID of the receiver of the message
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    message: { // Text of the message
        type: String,
        required: true
    }
}); 

export const Message = mongoose.model('Message', messageSchema); // Creating a Message model from the messageSchema and exporting it to be used in other files