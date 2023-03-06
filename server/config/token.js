import jwt from 'jsonwebtoken'

export const generateAccessToken = (userId) => jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 60
})

export const generateRefreshToken = (userId) => jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '2h'
})