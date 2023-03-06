import mongoose from "mongoose";
const CommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    content: {type: String, required: true}
}, {
    timestamps: true
})

const Comment = mongoose.model('Comment', CommentSchema)
export default Comment