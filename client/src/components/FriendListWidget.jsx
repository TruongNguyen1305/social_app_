import { Typography, Box, useTheme } from "@mui/material";
import Friend from "./Friend";
import WidgetWrapper from "./WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends, setToken } from "state";
import axiosClient from "../axios/axiosClient.js";
import { isExpiredToken } from "../axios/axiosClient.js";
import { useNavigate } from "react-router-dom";

function FriendListWidget({userId}) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {palette} = useTheme()
    const token = useSelector(state => state.token)
    const friends = useSelector(state => state.user.friends)

    const getFriends =  () => {
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
                return axiosClient.get(`/users/${userId}/friends`, {
                    headers: {
                        Authorization: `Bearer ${response.data.accessToken}`
                    }
                })
            })
                .then(({ data }) => {
                    dispatch(setFriends({
                        friends: data
                    }))
                })
                .catch(err => {
                    console.log(err)
                    navigate('/login')
                })
        }
        else {
            axiosClient.get(`/users/${userId}/friends`, {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            })
                .then(({ data }) => {
                    dispatch(setFriends({
                        friends: data
                    }))
                })
        } 
    }

    useEffect(()=>{
        getFriends()
    }, []) //eslint-disable-line react-hooks/exhaustive-deps

    return ( 
        <WidgetWrapper mt='2rem'>
            <Typography
                color={palette.neutral.dark}
                variant='h5'
                fontWeight='500'
                sx={{mb: '1.5rem'}}
            >
                Friend List
            </Typography>
            <Box
                display='flex'
                flexDirection='column'
                gap='1.5rem'
            >
                {friends.map((friend)=>(
                    <Friend 
                        key={friend._id} 
                        friendId = {friend._id}
                        name={`${friend.firstName} ${friend.lastName}`}
                        subtitle={friend.occupation}
                        userPicturePath={friend.picturePath}
                    />
                ))}
            </Box>
        </WidgetWrapper> 
    );
}

export default FriendListWidget;