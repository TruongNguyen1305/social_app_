import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import axiosClient from "../axios/axiosClient.js";
import { isExpiredToken } from "../axios/axiosClient.js";
import { setToken, setFriends } from "state";

function Friend({friendId, name, subtitle, userPicturePath}) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {_id} = useSelector(state => state.user)
    const token = useSelector(state => state.token)
    const friends = useSelector(state => state.user.friends)

    const { palette } = useTheme()
    const primaryLight = palette.primary.light
    const primaryDark = palette.primary.dark
    const main = palette.neutral.main
    const medium = palette.neutral.medium

    const isFriend = friends.find((friend) => friend._id === friendId)

    const patchFriend = async () => {
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
                return axiosClient.patch(`/users/${_id}/${friendId}`,{}, {
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
            axiosClient.patch(`/users/${_id}/${friendId}`,{}, {
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
    return ( 
        <FlexBetween>
            <FlexBetween gap='1rem'>
                <UserImage image={userPicturePath} size ='55px'/>
                <Box
                    onClick={()=> {
                        navigate(`/profile/${friendId}`)
                        navigate(0)
                    }}
                >
                    <Typography
                        color={main}
                        variant='h5'
                        fontWeight='500'
                        sx={{
                            "&:hover": {
                                color: palette.primary.light,
                                cursor: 'pointer'
                            }
                        }}
                    >
                        {name}
                    </Typography>
                    <Typography color={medium} fontSize='0.75rem'>
                        {subtitle}
                    </Typography>
                </Box>
            </FlexBetween>
            {_id !== friendId && (
                <IconButton
                    onClick={()=>patchFriend()}
                    sx={{backgroundColor: primaryLight, p: '0.6rem'}}
                >
                    {isFriend ? (
                        <PersonRemoveOutlined sx={{color: primaryDark}}/>
                    ) : (
                        <PersonAddOutlined sx={{ color: primaryDark }} />
                    )}
                </IconButton>
            )}
            
        </FlexBetween> 
    );
}

export default Friend;