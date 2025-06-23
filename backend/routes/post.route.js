import express from 'express';
import { addNewPost, getAllPosts, getUserPosts, likePost, dislikePost, addComment, getCommentsOfPost, deletePost, bookmarkPost } from '../controllers/post.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.route('/addpost').post(isAuthenticated, upload.single('image'), addNewPost); // Route to add a new post
router.route('/all').get(isAuthenticated, getAllPosts); // Route to get all posts
router.route('/userpost/all').get(isAuthenticated, getUserPosts); // Route to get posts of the authenticated user
router.route('/:id/like').get(isAuthenticated, likePost); // Route to like a post
router.route('/:id/dislike').get(isAuthenticated, dislikePost); // Route to dislike a post
router.route('/:id/comment').post(isAuthenticated, addComment); // Route to add a comment to a post
router.route('/:id/comment/all').post(isAuthenticated, getCommentsOfPost); // Route to get comments of a post
router.route('/delete/:id').delete(isAuthenticated, deletePost); // Route to delete a post
router.route('/:id/bookmark').get(isAuthenticated, bookmarkPost); // Route to bookmark a post

export default router;