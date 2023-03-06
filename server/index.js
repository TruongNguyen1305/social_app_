import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import route from './routes/index.js'
import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'
import { verifyToken } from './middlewares/authMiddleware.js'

import User from './models/User.js'
import Post from './models/Post.js'
import Comment from './models/Comment.js'
import { users, posts , comments} from './data/index.js'


/**Config */
const __filename = fileURLToPath(import.meta.url) //return the path to the file
const __dirname = path.dirname(__filename) //return the directory's path of the file's path
dotenv.config()

const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy: 'cross-origin'}))
app.use(morgan('common'))
app.use(bodyParser.json({limit: '30mb', extended: true}))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

/**File storage */
const storage = multer.diskStorage({
    destination: function(req, filem, cb){
        cb(null, 'public/assets')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})

export const upload = multer({storage})

//Route with storage
app.post('/api/users', upload.single('picture'), UserController.registerUser)
app.post('/api/posts', verifyToken, upload.single('picture'), PostController.createPost)

//set up api for app
route(app)
//add middleware to handle errors
app.use(notFound)
app.use(errorHandler)

/**Mongoose config */
const PORT = process.env.PORT ||5000
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(()=>{
        app.listen(PORT, ()=>{
            console.log(`Listening on ${PORT}`);
        })

        // User.insertMany(users)
        // Comment.insertMany(comments)
        // Post.insertMany(posts)
    })
    .catch(err => {
        console.log(`Error: ${err}`)
    })