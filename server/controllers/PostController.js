import Post from '../models/Post.js'
import User from '../models/User.js'

//[POST] /api/posts/
export const createPost = async (req, res, next) => {
    try {
        const {userId, description, picturePath} = req.body
        // const user = await User.findById(userId)
        const newPost = new Post({
            user: userId, description, picturePath, likes: new Map()
        })

        await newPost.save()

        // const allRelatedPosts = await Post.find({
        //     user: {$in: [...user.friends, userId]}
        // })
        const allRelatedPosts = await Post.find({}).populate('user', '-email -password')
        res.status(201).json(allRelatedPosts)
    } catch (error) {
        res.status(409)
        next(error)
    }
}

//[GET] /api/posts/
export const getNewFeed = async (req, res, next) => {
    try {
        // const user = req.user
        // const allRelatedPosts = await Post.find({
        //     user: { $in: [...user.friends, user._id] }
        // })
        const allRelatedPosts = await Post.find({}).populate('user', '-email -password')
        res.status(200).json(allRelatedPosts)
    } catch (error) {
        res.status(404)
        next(error)
    }
}

//[GET] /api/posts/:userId/posts
export const getUserPosts = async (req, res, next) => {
    try {
        const userId  = req.params.userId
        const userPosts = await Post.find({
            user: userId
        }).populate('user', '-email -password')
        res.status(200).json(userPosts)
    } catch (error) {
        res.status(404)
        next(error)
    }
}

//[PATCH] /api/posts/:id/like
export const likeOrUnlikePost = async (req, res, next) => {
    try {
        const postId = req.params.id
        const {userId} = req.body
        const post = await Post.findById(postId)

        const isLiked = post.likes.get(userId)

        if(isLiked){
            post.likes.delete(userId)
        }else{
            post.likes.set(userId, true)
        }

        const updatedPost = await Post.findByIdAndUpdate(postId, {
            likes: post.likes
        }, {
            new: true
        }).populate('user', '-email -password')
        res.status(200).json(updatedPost)
    } catch (error) {
        res.status(404)
        next(error)
    }
}