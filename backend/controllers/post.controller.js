import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {

    try {

        const {caption} = req.body;
        const image = req.file;
        const authorId = req.id;

        if(!image){

            return res.status(400).json({message: "Image is required"});
        }

        //image upload using multer
        const optimizedImageBuffer = await sharp(image.buffer)
        .resize({width: 800, height: 800, fit: 'inside'})
        .toFormat("jpeg", {quality: 80})
        .toBuffer(); //buffer is used to store the image data

        //buffer to data uri
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`; //converting the buffer to base64 string

        const cloudResponse = await cloudinary.uploader.upload(fileUri); //uploading the image to cloudinary

        //creating a new post
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        });

        const user = await User.findById(authorId);
        if(user){

            user.posts.push(post._id);
            await user.save();
        }

        //post.populate() is used to get the author details of the post
        await post.populate({path: 'author', select: '-password'});
        //populate method is used to populate the author field of the post document with the details of the user who created the post, excluding the password field.

        return res.status(201).json({
            message: "New post added!",
            post,
            success: true
        });

    } catch (error) {

        console.error(`Error: ${error.message}`); 
    }

}

export const getAllPosts = async (req, res) => {

    try {

        const posts = await Post
        .find() //find() method is used to get all the posts in the database
        .sort({createdAt: -1}) // sort({createdAt: -1}) method is used to sort the posts in descending order of createdAt field.
        .populate({path: 'author', select: 'username profilePicture'})
        .populate({
            path: 'comments',
            sort: {createdAt: -1},
            populate: {

                path: 'author',
                select: 'username profilePicture'
            }
        });

        return res.status(200).json({
            posts,
            success: true
        });

    } catch (error) {

        console.error(`Error: ${error.message}`);   
    }
};

export const getUserPosts = async (req, res) => { 
    
    try {

        const authorId = req.id;
        const posts = await Post.find({author: authorId}) //will only show the posts created by the user
        .sort({createdAt: -1})
        .populate({path: 'author', select: 'username profilePicture'})
        .populate({
            path: 'comments',
            sort: {createdAt: -1},
            populate: {

                path: 'author',
                select: 'username profilePicture'
            }
        });
        
    } catch (error) {
        
        console.error(`Error: ${error.message}`);  
    }
};

export const likePost = async (req, res) => {

    try {

        const whoWillLike = req.id;

        const postId = req.params.id; //getting the post id of the post
        const post = await Post.findById(postId);
        if(!post){

            return res.status(404).json({

                message: "Post not found",
                success: false
            });
        }

        //like logic
        await post.updateOne({

            $addToSet: {likes: whoWillLike} //addToSet is used to add the user id to the likes array of the post document ONLY ONCE
        });

        await post.save();

        //implenting socket.io for real-time like notifications
        const user = await User.findById(whoWillLike).select('username profilePicture'); //getting the user who liked the post
        const postOwnerId = post.author.toString();
        if(postOwnerId !== whoWillLike) { //if the post owner is not the one who liked the post
            //emit the like notification to the post owner
            const notification = {
                type:'like',
                userId: whoWillLike,
                userDetails: user,
                postId,
                message: `${user.username} liked your post`
            }
            
            const postOwnerSocketId = getReceiverSocketId(postOwnerId); //function to get the post owner's socket id
            io.to(postOwnerSocketId).emit("notification", notification); //emitting the new notification to the post owner's socket
        }

        return res.status(200).json({

            message: "Post liked!",
            success: true
        });   
    } catch (error) {
        
        console.error(`Error: ${error.message}`);   
        
    }
};

export const dislikePost = async (req, res) => {

    try {

        const whoWillLike = req.id;

        const postId = req.params.id; //getting the post id of the post
        const post = await Post.findById(postId);
        if(!post){

            return res.status(404).json({

                message: "Post not found",
                success: false
            });
        }

        //like logic
        await post.updateOne({

            $pull: {likes: whoWillLike} //addToSet is used to add the user id to the likes array of the post document ONLY ONCE
        });

        await post.save();

        //implenting socket.io for real-time like notifications
        const user = await User.findById(whoWillLike).select('username profilePicture'); //getting the user who liked the post
        const postOwnerId = post.author.toString();
        if(postOwnerId !== whoWillLike) { //if the post owner is not the one who liked the post
            //emit the like notification to the post owner
            const notification = {
                type:'dislike',
                userId: whoWillLike,
                userDetails: user,
                postId,
                message: `${user.username} disliked your post`
            }
            
            const postOwnerSocketId = getReceiverSocketId(postOwnerId); //function to get the post owner's socket id
            io.to(postOwnerSocketId).emit("notification", notification); //emitting the new notification to the post owner's socket
        }

        return res.status(200).json({

            message: "Post disliked!",
            success: true
        });   
    } catch (error) {
        
        console.error(`Error: ${error.message}`);     
    }
};

export const addComment = async (req, res) => {

    try {

        const postId = req.params.id;
        const whoWillComment = req.id;

        const {text} = req.body; //getting the comment text from the request body

        const post = await Post.findById(postId);
        if(!text) return res.status(400).json({message: "Comment is required", success: false});

        const comment = await Comment.create({
            text,
            author: whoWillComment,
            post: postId,
        })
        
        await comment.populate({ //populating the comments of the post model
            path: 'author',
            select: 'username profilePicture'
        });

        post.comments.push(comment._id); //pushing the comment id to the comments array of the post document
        await post.save(); //saving the post document

        return res.status(201).json({
            message: "Comment added!",
            comment,
            success: true
        });

    } catch (error) {
        
        console.error(`Error: ${error.message}`);          
    }
};

export const getCommentsOfPost = async (req, res) => {

    try {

        const postId = req.params.id;
        const comments = await Comment
        .find({post: postId})
        .populate('author', 'username profilePicture');

        if(!comments){

            return res.status(404).json({
                message: "No comments.", 
                success: false
            });
        }

        return res.status(200).json({
            comments,
            success: true
        });
        
    } catch (error) {
        
        console.error(`Error: ${error.message}`);  
        
    }
};

export const deletePost = async (req, res) => {

    try {

        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({
            message: "Post not found!", 
            success: false
        });

        //check if the logged-in user is the owner of the post
        if(post.author.toString() !== authorId) return res.status(403).json({
            message: "You are not authorized to delete this post!", 
            success: false
        });

        //deleting the post
        await Post.findByIdAndDelete(postId);

        //remove the post from the user's posts array
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        //delete the associated comments of the deleted post
        await Comment.deleteMany({post: postId});

        return res.status(200).json({
            message: "Post and associated comments deleted!",
            success: true
        });

    } catch (error) {
        
        console.error(`Error: ${error.message}`);   
        
    }
};

export const bookmarkPost = async (req, res) => {

    try {
        
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({
            message: "Post not found!", 
            success: false
        });

        const user =  await User.findById(authorId);
        if(user.bookmarks.includes(post._id)){

            //already bookmarked -> remove from bookmarks
            await user.updateOne({

                $pull: {bookmarks: postId}
            });
            await user.save();

            return res.status(200).json({
                message: "Post removed from bookmarks!",
                success: true,
                bookmarks: user.bookmarks,
            });
        } else {

            //not bookmarked -> add to bookmarks
            await user.updateOne({

                $addToSet: {bookmarks: postId}
            });
            await user.save();

            return res.status(200).json({
                message: "Post bookmarked!",
                success: true,
                bookmarks: user.bookmarks, 
            });
        }

    } catch (error) {
        
        console.error(`Error: ${error.message}`);    
    }
};