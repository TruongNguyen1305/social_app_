import { 
    ChatBubbleOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined,
    DeleteOutlined
} from "@mui/icons-material";
import { 
    Box,
    Divider, 
    IconButton, 
    Typography, 
    useTheme,
    InputBase,
    Button
} 
from "@mui/material";
import Friend from "./Friend";
import WidgetWrapper from "./WidgetWrapper";
import FlexBetween from "./FlexBetween";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, setToken } from "state";
import axiosClient from "../axios/axiosClient.js";
import { isExpiredToken } from "../axios/axiosClient.js";
import UserImage from "./UserImage";
import { useNavigate } from "react-router-dom";

function PostWidget({post}) {
    const navigate = useNavigate()
    const [isComments, setIsComments] = useState(false)
    const [comments, setComments] = useState(null)
    const [cmt, setCmt] = useState("")
    const dispatch = useDispatch()
    const token = useSelector(state => state.token)
    const user = useSelector(state => state.user)
    const loggedUserId = useSelector(state=>state.user._id)
    const isLiked = loggedUserId in post.likes
    const likeCount = Object.keys(post.likes).length

    const { palette } = useTheme()
    const main = palette.neutral.main
    const primary = palette.primary.main

    const handleComment = () => {
        if (isExpiredToken(token.accessToken)) {
            axiosClient.post('/users/token', {
                refreshToken: token.refreshToken
            }).then(response => {
                dispatch(setToken({
                    token: {
                        accessToken: response.data.accessToken,
                        refreshToken: token.refreshToken
                    }
                }))
                return axiosClient.post(`/comments/${post._id}`,{
                    content: cmt
                }, {
                    headers: {
                        Authorization: `Bearer ${response.data.accessToken}`
                    }
                })
            })
                .then(({ data }) => {
                    setComments(data)
                    setCmt("")
                })
                .catch(err => {
                    console.log(err)
                    navigate('/login')
                })
        }
        else {
            axiosClient.post(`/comments/${post._id}`,{
                content: cmt
            }, {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            })
                .then(({ data }) => {
                    setComments(data)
                    setCmt("")
                })
        }
    }

    const deleteComment = (id) => {
        if (isExpiredToken(token.accessToken)) {
            axiosClient.post('/users/token', {
                refreshToken: token.refreshToken
            }).then(response => {
                dispatch(setToken({
                    token: {
                        accessToken: response.data.accessToken,
                        refreshToken: token.refreshToken
                    }
                }))
                return axiosClient.delete(`/comments/${post._id}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${response.data.accessToken}`
                    }
                })
            })
                .then(({ data }) => {
                    setComments(data)
                })
                .catch(err => {
                    console.log(err)
                    navigate('/login')
                })
        }
        else {
            axiosClient.delete(`/comments/${post._id}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            })
                .then(({ data }) => {
                    setComments(data)
                })
        }
    }

    const fetchCommentsOfPost = () =>{
        if(isComments) {
            setIsComments(!isComments)
            return
        }
        console.log('cc')
        if (isExpiredToken(token.accessToken)) {
            axiosClient.post('/users/token', {
                refreshToken: token.refreshToken
            }).then(response => {
                dispatch(setToken({
                    token: {
                        accessToken: response.data.accessToken,
                        refreshToken: token.refreshToken
                    }
                }))
                return axiosClient.get(`/comments/${post._id}`, {
                    headers: {
                        Authorization: `Bearer ${response.data.accessToken}`
                    }
                })
            })
                .then(({ data }) => {
                    setComments(data)
                    setIsComments(!isComments)
                })
                .catch(err => {
                    console.log(err)
                    navigate('/login')
                })
        }
        else {
            axiosClient.get(`/comments/${post._id}`, {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            })
                .then(({ data }) => {
                    setComments(data)
                    setIsComments(!isComments)
                })
        }
    }

    const patchLike = () =>{
        if (isExpiredToken(token.accessToken)) {
            axiosClient.post('/users/token', {
                refreshToken: token.refreshToken
            }).then(response => {
                dispatch(setToken({
                    token: {
                        accessToken: response.data.accessToken,
                        refreshToken: token.refreshToken
                    }
                }))
                return axiosClient.patch(`/posts/${post._id}/like`, {
                    userId: loggedUserId
                }, {
                    headers: {
                        Authorization: `Bearer ${response.data.accessToken}`
                    }
                })
            })
                .then(({ data }) => {
                   dispatch(setPost({
                       post: data
                   }))
                })
                .catch(err => {
                    console.log(err)
                    navigate('/login')
                })
        }
        else {
            axiosClient.patch(`/posts/${post._id}/like`,{
                userId: loggedUserId
            }, {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            })
                .then(({ data }) => {
                    dispatch(setPost({
                        post: data
                    }))
                })
        }
    }
    return ( 
        <WidgetWrapper m = '2rem 0'>
            <Friend 
                friendId={post.user._id}
                name={`${post.user.firstName} ${post.user.lastName}`}
                subtitle={post.user.location}
                userPicturePath={post.user.picturePath}
            />
            <Typography color={main} sx={{mt:'1rem'}}>
                {post.description}
            </Typography>
            {post.picturePath && (
                <img 
                    width='100%'
                    height='auto'
                    alt='post'
                    style={{borderRadius: '0.75rem', marginTop: '0.75rem'}}
                    src={`http://localhost:3001/assets/${post.picturePath}`}
                />
            )}
            <FlexBetween mt='0.25rem'>
                <FlexBetween gap='1rem'>
                    <FlexBetween gap='0.3rem'>
                        <IconButton onClick={patchLike}>
                            {isLiked ? (
                                <FavoriteOutlined sx={{color: primary}}/>
                            ) : (
                                <FavoriteBorderOutlined />
                            )}
                        </IconButton>
                        <Typography>{likeCount}</Typography>
                    </FlexBetween>
                    <FlexBetween gap='0.3rem'>
                        <IconButton onClick={fetchCommentsOfPost}>
                            <ChatBubbleOutlined />
                        </IconButton>
                        <Typography>{post.comments.length}</Typography>
                    </FlexBetween>
                </FlexBetween>
                <IconButton>
                    <ShareOutlined />
                </IconButton>
            </FlexBetween>
            {isComments && (
                <Box mt='0.5rem'>
                    {comments.map(comment => {
                        return(
                            <Box key={comment._id}> 
                                <Divider />
                                <FlexBetween  gap='2rem'>
                                    <FlexBetween gap='0.5rem'>
                                        <UserImage image={comment.user.picturePath} size='30px' />
                                        <Typography>{`${comment.user.firstName} ${comment.user.lastName}`}</Typography>
                                    </FlexBetween>
                                    <FlexBetween flexBasis='70%' gap='1rem'>
                                        <Typography sx={{color: main, m: '0.5rem 0', pl: '1rem'}}>{comment.content}</Typography>
                                        {comment.user._id === loggedUserId && (
                                            <IconButton
                                                onClick={() => {
                                                    deleteComment(comment._id)
                                                }}
                                            >
                                                <DeleteOutlined />
                                            </IconButton>
                                        )}
                                    </FlexBetween>
                                </FlexBetween>
                                
                            </Box>
                        )
                    })}
                    <Divider />
                    <FlexBetween mt='1rem'>
                        <FlexBetween flexBasis='80%' gap='1.5rem'>
                            <UserImage image={user.picturePath} size='30px' />
                            <InputBase
                                placeholder='Post your comment here'
                                onChange={(e) => {
                                    setCmt(e.target.value)
                                }}
                                value={cmt}
                                sx={{
                                    width: '100%',
                                    height: '3rem',
                                    backgroundColor: palette.neutral.light,
                                    borderRadius: '2rem',
                                    padding: '1rem 2rem'
                                }}
                            />
                        </FlexBetween>
                        <Button
                            disabled={!cmt}
                            onClick={handleComment}
                            sx={{
                                color: palette.background.alt,
                                backgroundColor: palette.primary.main,
                                borderRadius: '3rem'
                            }}
                        >
                            Post
                        </Button>
                    </FlexBetween>
                </Box>
            )}
        </WidgetWrapper> 
    );
}

export default PostWidget;