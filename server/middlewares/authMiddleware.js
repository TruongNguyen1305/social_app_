import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const verifyToken = async (req, res, next) => {
    let token
    if(req.header('Authorization') && req.header('Authorization').split(' ')[0] === 'Bearer') {
        token = req.header('Authorization').split(' ')[1]
        
        if(!token){
            res.status(403);
            return next(new Error('Access denied'));
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if(err) {
                res.status(403)
                return next(err)
            }
            req.user = await User.findById(decoded.id).select('-password')
            next()
        })
    }
    
    if(!token){
        res.status(403)
        next(new Error('Access denied'))
    }
}