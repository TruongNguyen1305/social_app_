import mongoose from "mongoose";
const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    description: String,
    picturePath: String, 
    likes: {
        type: Map,
        of: Boolean,
        default: new Map()
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, {
    timestamps: true
})

const Post = mongoose.model('Post', PostSchema)
export default Post