import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getReceiverSocketId } from "../socket/socket.js";

//for chatting between users
export const sendMessage = async (req, res) => {

    try {

        const senderId = req.id;
        const receiverId = req.params.id;

        const { textMessage:message } = req.body;

        let conversation = await Conversation.findOne({

            participants: { $all: [senderId, receiverId] } //checking if the conversation already exists
        });

        //establish the conversation if it doesn't exist
        if(!conversation){

            conversation = await Conversation.create({

                participants: [senderId, receiverId]
            });
        };

        const newMessage = await Message.create({

            senderId,
            receiverId,
            message
        });
        if(newMessage) conversation.messages.push(newMessage._id); //pushing the message id to the messages array of the conversation document

        //promise is used to wait for the completion of both the save operations 
        await Promise.all([conversation.save(), newMessage.save()]); //saving the conversation and message documents

        //implement socket io for real time data transfer
        //1:1

        const receiverSocketId = getReceiverSocketId(receiverId); //function to get the receiver's socket id
        if(receiverSocketId) {

            req.io.to(receiverSocketId).emit("newMessage",newMessage); //emitting the new message to the receiver's socket
        }

        return res.status(201).json({

            message: "Message sent!",
            newMessage,
            success: true
        }); 
        
    } catch (error) {
        
        console.error(`Error: ${error.message}`);       
    }
};

export const getMessage = async (req, res) => {

    try {

        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({

            participants: { $all: [senderId, receiverId] } //checking if the conversation already exists
        }).populate("messages"); //populating the messages field to get the messages array
        if(!conversation) return res.status(200).json({success: false, messages: []});

        return res.status(200).json({

            success: true,
            messages: conversation?.messages //returning the messages array of the conversation document , ? is used to avoid error if conversation is null
        });
        
    } catch (error) {
        
        console.error(`Error: ${error.message}`);
        
    }
}