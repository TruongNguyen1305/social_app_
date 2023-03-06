import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, setToken } from "state";
import PostWidget from "./PostWidget";
import axiosClient from "../axios/axiosClient.js";
import { isExpiredToken } from "../axios/axiosClient.js";
import { useNavigate } from "react-router-dom";

function PostsWidget({userId, isProfile = false}) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const posts = useSelector(state => state.posts)
    const token = useSelector(state => state.token)

    const getPosts = () =>{
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
                return axiosClient.get(`/posts`, {
                    headers: {
                        Authorization: `Bearer ${response.data.accessToken}`
                    }
                })
            })
                .then(({ data }) => {
                    dispatch(setPosts({
                        posts: data
                    }))
                })
                .catch(err => {
                    console.log(err)
                    navigate('/login')
                })
        }
        else {
            axiosClient.get(`/posts`, {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            })
                .then(({ data }) => {
                    dispatch(setPosts({
                        posts: data
                    }))
                })
        }
    }
    const getUserPosts = () => {
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
                return axiosClient.get(`/posts/${userId}/posts`, {
                    headers: {
                        Authorization: `Bearer ${response.data.accessToken}`
                    }
                })
            })
                .then(({ data }) => {
                    dispatch(setPosts({
                        posts: data
                    }))
                })
                .catch(err => {
                    console.log(err)
                    navigate('/login')
                })
        }
        else {
            axiosClient.get(`/posts/${userId}/posts`, {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            })
                .then(({ data }) => {
                    dispatch(setPosts({
                        posts: data
                    }))
                })
        }
    }

    useEffect(()=>{
        if(isProfile){
            getUserPosts()
        }
        else{
            getPosts()
        }
    }, []) //eslint-disable-line react-hooks/exhaustive-deps
    return ( <>
        {posts.map((post, idx) => <PostWidget key={idx} post={post} />)}
    </>);
}

export default PostsWidget;