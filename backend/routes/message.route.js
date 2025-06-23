import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { getMessage, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.route('/send/:id').post(isAuthenticated, sendMessage); // Route for sending a message to a user
router.route('/all/:id').get(isAuthenticated, getMessage); // Route for getting all messages between the user and another user


export default router; // Exporting the router to be used in other files