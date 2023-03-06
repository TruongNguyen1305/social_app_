import userRouter from "./user.js";
import postRouter from './post.js'
import commentRouter from './comment.js'

function route(app) {
    app.use('/api/users', userRouter)
    app.use('/api/posts', postRouter)
    app.use('/api/comments', commentRouter)
}

export default route;