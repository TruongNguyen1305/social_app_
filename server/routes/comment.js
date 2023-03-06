import express from 'express'
import * as CommentController from '../controllers/CommentController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()
/**GET */
router.get('/:postId', verifyToken, CommentController.getCommentsOfPost)

/**POST */
router.post('/:postId', verifyToken, CommentController.postComment)

/**DELETE */
router.delete('/:postId/:commentId', verifyToken, CommentController.deleteComment)

/**UPDATE */
router.patch('/:postId/:commentId', verifyToken, CommentController.changeComment)

export default router