import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import FriendListWidget from "components/FriendListWidget";
import MyPostWidget from "components/MyPostWidget";
import PostsWidget from "components/PostsWidget";
import UserWidget from "components/UserWidget";
import axiosClient from "../../axios/axiosClient.js";
import { isExpiredToken } from "../../axios/axiosClient.js";

import { setToken } from "state";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [user, setUser] =useState(null)
    const {userId} = useParams()
    const token = useSelector(state => state.token)
    const isNonMobileScreen = useMediaQuery('(min-width: 1000px)')

    const getUser = () =>{
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
                return axiosClient.get(`/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${response.data.accessToken}`
                    }
                })
            })
                .then(({ data }) => setUser(data))
                .catch(err => {
                    console.log(err)
                    navigate('/login')
                })
        }
        else {
            axiosClient.get(`/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            })
                .then(({ data }) => setUser(data))
        }
    }

    useEffect(()=> {
        getUser()
    }, []) //eslint-disable-line react-hooks/exhaustive-deps

    if(!user) return null

    return (
        <Box
            width='100%'
            p='2rem 6%'
            display={isNonMobileScreen ? 'flex' : 'block'}
            gap='2rem'
            justifyContent='center'
        >
            <Box flexBasis={isNonMobileScreen ? "26%" : undefined}>
                <UserWidget userId={userId} picturePath={user.picturePath} />
                <FriendListWidget userId={userId}/>
            </Box>
            <Box
                flexBasis={isNonMobileScreen ? "42%" : undefined}
                mt={isNonMobileScreen ? undefined : '2rem'}
            >
                <MyPostWidget picturePath={user.picturePath} />
                <PostsWidget userId={userId} isProfile/>
            </Box>
        </Box>
    );
}

export default ProfilePage;