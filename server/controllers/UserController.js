import {generateAccessToken, generateRefreshToken} from '../config/token.js'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
//[POST] /api/auth
export const registerUser = async (req, res, next) => {
    try {
        const { 
            firstName, 
            lastName, 
            email, 
            password, 
            picturePath, 
            friends, 
            location, 
            occupation 
        } = req.body

        console.log(picturePath)

        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        })
        const savedUser = await newUser.save().populate('friends', '-email -password')
        delete savedUser.password
        res.status(201).json(savedUser)
    } catch (error) {
        next(error)
    }
}

//[POST] /api/users/login
export const login = async (req, res, next) => {
    try {
        const {email, password} = req.body
        // console.log(email, password)
        const user = await User.findOne({ email }).populate('friends', '-email -password')
        if(!user || ! await user.matchPassword(password)){
            res.status(400)
            return next(new Error('Invalid information'))
        }

        const accessToken = generateAccessToken(user._id)
        const refreshToken = generateRefreshToken(user._id)

        delete user.password
        res.status(200).json({ user, accessToken, refreshToken })

    } catch (error) {
        next(error)
    }
}

//[POST] /api/users/token
export const userRefreshToken = async (req, res, next) => {
    const {refreshToken} = req.body
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded)=>{
        if(err){
            res.status(403)
            next(err)
        }
        else{
            const newAccessToken = generateAccessToken(decoded.id)
            res.status(201).json({ accessToken: newAccessToken })
        }
    })
}

//[GET] /api/users/:id
export const getUser = async (req, res, next) =>{
    try {
        const id = req.params.id
        const user = await User.findById(id)
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}


//[GET] /api/users/:id/friends
export const getUserFriends = async (req, res, next) => {
    try {
        const {id} = req.params
        const user = await User.findById(id).populate('friends', '-email -password')
        res.status(200).json(user.friends)
    } catch (error) {
        next(error)
    }
}


//[PATCH] /api/users/:id/:friendId
export const addRemoveFriend= async(req, res, next) =>{
    try {
        const {id, friendId} = req.params
        const user = await User.findById(id)
        let users
        if(user.friends.includes(friendId)){
            users = await Promise.all([
                User.findByIdAndUpdate(id,{
                    $pull: {friends: friendId}
                }, {
                    new: true
                }),
                User.findByIdAndUpdate(friendId, {
                    $pull: { friends: id }
                }, {
                    new: true
                })
            ])
        }
        else{
            users = await Promise.all([
                User.findByIdAndUpdate(id, {
                    $push: { friends: friendId }
                }, {
                    new: true
                }).select('-password'),
                User.findByIdAndUpdate(friendId, {
                    $push: { friends: id }
                }, {
                    new: true
                })
            ])
        }
        res.status(201).json((await users[0].populate('friends', '-email -password')).friends)
    } catch (error) {
        next(error)
    }
}

