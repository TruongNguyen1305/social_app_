import {
    ManageAccountsOutlined,
    EditOutlined,
    LocationOnOutlined,
    WorkOutlineOutlined
} from '@mui/icons-material'
import { Box, Typography, Divider, useTheme } from '@mui/material'
import UserImage from './UserImage'
import FlexBetween from './FlexBetween'
import WidgetWrapper from './WidgetWrapper'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosClient from '../axios/axiosClient.js'
import { setToken } from 'state'
import { isExpiredToken } from '../axios/axiosClient.js'

function UserWidget({userId, picturePath}) {
    const [user, setUser] = useState(null)
    const {palette} = useTheme()
    const navigate = useNavigate()
    const token = useSelector(state=>state.token)
    const dispatch = useDispatch()
    const dark = palette.neutral.dark
    const medium = palette.neutral.medium
    const main = palette.neutral.main

    const getUser = async () =>{
        if (isExpiredToken(token.accessToken)){
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
            .then(({data}) => {
                setUser(data) 
            })
            .catch(err => {
                console.log(err)
                navigate('/login')
            })
        }
        else{
            axiosClient.get(`/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            })
            .then(({data}) => setUser(data))
        }
    }
        

        //     //         accessToken = data.accessToken
        //     //     } catch (err) {
        //     //         navigate('/login')
        //     //     }
        // try {
        //     // let accessToken = token.accessToken
        //     // if (isExpiredToken(accessToken)){
        //     //     try {
        //     //         const { data } = await axiosClient.post('/users/token', {
        //     //             refreshToken: token.refreshToken
        //     //         })
        //     //         dispatch(setToken({
        //     //             token: {
        //     //                 accessToken: data.accessToken,
        //     //                 refreshToken: token.refreshToken
        //     //             }
        //     //         }))

        //     //         accessToken = data.accessToken
        //     //     } catch (err) {
        //     //         navigate('/login')
        //     //     }
        //     // }
        //     const { data } = await axiosClient.get(`/users/${userId}`, {
        //         headers: {
        //             Authorization: `Bearer ${token.accessToken}`,
        //         }
        //     })
        //     setUser(data)
        // } catch (error) {
        //     try {
        //         const { data } = await axiosClient.post('/users/token', {
        //             refreshToken: token.refreshToken
        //         })
        //         dispatch(setToken({
        //             token: {
        //                 accessToken: data.accessToken,
        //                 refreshToken: token.refreshToken
        //             }
        //         }))
        //         const userData = await axiosClient.get(`/users/${userId}`, {
        //             headers: {
        //                 Authorization: `Bearer ${data.accessToken}`
        //             }
        //         })
        //         setUser(userData.data)
        //     } catch (err) {
        //         console.log(err.response.data.message)
        //         navigate('/login')
        //     }
        // }
    

    useEffect(()=>{
        getUser()
    }, []) // eslint-disable-next-line

    if(!user){
        return null
    }

    return ( <WidgetWrapper>
            <FlexBetween
                gap='0.5rem'
                pb='1.1rem'
                onClick={() => navigate(`/profile/${user._id}`)}
            >
                <FlexBetween gap ='1rem'>
                    <UserImage image={user.picturePath}/>
                    <Box>
                        <Typography
                            variant='h4'
                            color={dark}
                            fontWeight='500'
                            sx ={{
                                "&:hover": {
                                    color: palette.primary.light,
                                    cursor: "pointer"
                                }
                            }}             
                        >
                            {user.firstName} {user.lastName}
                        </Typography>
                        <Typography color={medium}>{user.friends.length} friends</Typography>
                    </Box>
                </FlexBetween>
                <ManageAccountsOutlined />
            </FlexBetween>

            <Divider />

            <Box p='1rem 0'>
                <Box display='flex' alignItems='center' gap='1rem' mb='0.5rem'>
                    <LocationOnOutlined fontSize='large' sx={{color: main}}/>
                    <Typography color={medium}>{user.location}</Typography>
                </Box>
                <Box display='flex' alignItems='center' gap='1rem'>
                    <WorkOutlineOutlined fontSize='large' sx={{ color: main }} />
                    <Typography color={medium}>{user.occupation}</Typography>
                </Box>
            </Box>

            <Divider />

            <Box p='1rem 0'>
                <FlexBetween mb='0.5rem'>
                    <Typography color={medium}>Who's viewed your profile</Typography>
                    <Typography color={main}>{user.viewedProfile}</Typography>
                </FlexBetween>
                <FlexBetween>
                    <Typography color={medium}>Impressions of your post</Typography>
                    <Typography color={main}>{user.impressions}</Typography>
                </FlexBetween>
            </Box>

            <Divider />

            <Box p='1rem 0'>
                <Typography fontSize='1rem' color={main} fontWeight='500' mb='1rem' >
                    Social Profiles
                </Typography>

                <FlexBetween gap='1rem' mb='0.5rem'>
                    <FlexBetween gap='1rem'>
                        <img src='../assets/twitter.png' alt='twitter'/>
                        <Box>
                            <Typography color={main} fontWeight='500'>
                                Twitter
                            </Typography>
                            <Typography color={medium}>Social network</Typography>
                        </Box>
                    </FlexBetween>
                    <EditOutlined sx={{color: main}}/>
                </FlexBetween>

                <FlexBetween gap='1rem'>
                    <FlexBetween gap='1rem'>
                        <img src='../assets/linkedin.png' alt='linkedin'/>
                        <Box>
                            <Typography color={main} fontWeight='500'>
                                Linkedin
                            </Typography>
                            <Typography color={medium}>Network platform</Typography>
                        </Box>
                    </FlexBetween>
                    <EditOutlined sx={{ color: main }} />
                </FlexBetween>
            </Box>
    </WidgetWrapper> );
}

export default UserWidget;