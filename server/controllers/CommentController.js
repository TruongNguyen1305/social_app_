import Comment from '../models/Comment.js'
import Post from '../models/Post.js'
import User from '../models/User.js'

//[GET] /api/comments/:postId
export const getCommentsOfPost = async (req, res, next) => {
    const {postId} = req.params
    try {
        let post = await Post.findById(postId).populate('comments')
        if(!post){ //Post has been deleted
            res.status(404)
            return next(new Error('Post not found'))
        }
        post = await User.populate(post, {
            path: 'comments.user',
            select: 'firstName lastName picturePath'
        })
        res.status(200).json(post.comments)
    } catch (error) {
        next(error)
    }
    
}

//[POST] /api/comments/:postId
export const postComment = async (req, res, next) => {
    const { postId } = req.params
    const { content } = req.body
    try {
        const post = await Post.findById(postId)
        if (!post) { //Post has been deleted
            res.status(404)
            return next(new Error('Post not found'))
        }

        let newComment = new Comment({
            user: req.user._id,
            content
        })

        newComment = await newComment.save()
        let updatedPost = await Post.findByIdAndUpdate(postId, {
            $push: { comments: newComment._id}
        }, {
            new:true
        }).populate('comments')

        updatedPost = await User.populate(updatedPost, {
            path: 'comments.user',
            select: 'firstName lastName picturePath'
        })
        res.status(201).json(updatedPost.comments)
    } catch (error) {
        next(error)
    }
}

//[DELETE] /api/comments/:postId/:commentId
export const deleteComment = async (req, res, next) => {
    const {postId, commentId} = req.params
    try {
        const post = await Post.findById(postId)
        if (!post) { //Post has been deleted
            res.status(404)
            return next(new Error('Post not found'))
        }

        await Comment.deleteOne({ _id: commentId })
        let updatedPost = await Post.findByIdAndUpdate(postId, {
            $pull: { comments: commentId }
        }, {
            new:true
        }).populate('comments')

        updatedPost = await User.populate(updatedPost, {
            path: 'comments.user',
            select: 'firstName lastName picturePath'
        })
        res.status(200).json(updatedPost.comments)
    } catch (error) {
        next(error)
    }
}

//[PATCH] /api/comments/:postId/:commentId
export const changeComment = async (req, res, next) => {
    const { postId, commentId } = req.params
    const {content} = req.body
    try {
        const post = await Post.findById(postId)
        if (!post) { //Post has been deleted
            res.status(404)
            return next(new Error('Post not found'))
        }
        await Comment.updateOne({ _id: commentId }, {
            content
        })

        let updatedPost = await Post.findById(postId).populate('comments')

        updatedPost = await User.populate(updatedPost, {
            path: 'comments.user',
            select: 'firstName lastName picturePath'
        })
        res.status(200).json(updatedPost.comments)
    } catch (error) {
        next(error)
    }
}