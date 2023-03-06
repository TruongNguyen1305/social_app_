import express from 'express'
import * as PostController from '../controllers/PostController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()
/**GET */
router.get('/', verifyToken, PostController.getNewFeed)
router.get('/:userId/posts', verifyToken, PostController.getUserPosts)

/**UPDATE */
router.patch('/:id/like', verifyToken, PostController.likeOrUnlikePost)

export default router