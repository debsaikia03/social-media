import express from 'express';
import { register, login, logout, getProfile, editProfile, getSuggestedUsers, followOrUnfollowUser } from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated, getProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePhoto'), editProfile);//multer middleware to upload image
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/followorunfollow/:id').get(isAuthenticated, followOrUnfollowUser);

//GET: Used to retrieve data from the server, here it is used for retrieving user profile data, suggested users, and logging out.
//POST:  Used to send data to the server to create or update a resource, here it is used for creating a new user, logging in, editing a profile, and following/unfollowing a user.

export default router;