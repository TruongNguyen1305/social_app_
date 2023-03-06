import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: 'light',
    user: {
        _id: '6400cc8db48058e4b41ea354',
        firstName: "Steve",
        lastName: "Ralph",
        email: "thataaa@gmail.com",
        password: "$!FEAS@!O)_IDJda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
        picturePath: "p3.jpeg",
        friends: [],
        location: "New York, CA",
        occupation: "Degenerate",
        viewedProfile: 12351,
        impressions: 55555,
        createdAt: 1595589072,
        updatedAt: 1595589072,
        __v: 0,
    },
    token: null,
    posts: []
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light'
        },
        setLogin: (state, action) => { 
            console.log(action)
            state.user = action.payload.user
            state.token = action.payload.token
        },
        setLogout: (state) => {
            state.user = null
            state.token = null
        },
        setFriends: (state, action) => {
            if(state.user){
                state.user.friends = action.payload.friends
            }else{
                console.log('User friends not exists')
            }
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts
        },
        setPost: (state, action) => {
            const updatedPosts = state.posts.map(post => {
                if (post._id === action.payload.post._id) return action.payload.post
                return post
            })
            state.posts = updatedPosts
        },
        setToken: (state, action) => {
            state.token = action.payload.token
        },
    }
})

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost, setToken } = authSlice.actions
export default authSlice.reducer