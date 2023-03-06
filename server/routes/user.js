import express from 'express';
import * as UserController from '../controllers/UserController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router()

//AUTHENTICATION
router.post('/login', UserController.login)
router.post('/token', UserController.userRefreshToken)

//GET
router.get('/:id', verifyToken, UserController.getUser)
router.get('/:id/friends', verifyToken, UserController.getUserFriends)

//UPDATE
router.patch('/:id/:friendId', verifyToken, UserController.addRemoveFriend)


export default router