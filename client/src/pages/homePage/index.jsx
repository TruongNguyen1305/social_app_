import { useMediaQuery, Box } from "@mui/material";
import UserWidget from "components/UserWidget";
import { useSelector } from "react-redux";
import MyPostWidget from "components/MyPostWidget";
import PostsWidget from "components/PostsWidget";
import AdvertWidget from "components/AdvertWidget";
import FriendListWidget from "components/FriendListWidget";

function HomePage() {
    const isNonMobileScreen = useMediaQuery('(min-width: 1000px)')
    const user = useSelector(state => state.user)
    return  <Box
        width='100%'
        p='2rem 6%'
        display={isNonMobileScreen ? 'flex' : 'block'}
        gap='0.5rem'
        justifyContent='space-between'
    >
        <Box flexBasis={isNonMobileScreen ? "26%" : undefined}>
            <UserWidget userId={user._id} picturePath={user.picturePath}/>
        </Box>
        <Box 
            flexBasis={isNonMobileScreen ? "42%" : undefined}
            mt={isNonMobileScreen ? undefined : '2rem'}
        >
            <MyPostWidget picturePath={user.picturePath}/>
            <PostsWidget userId={user._id}/>
        </Box>

        {isNonMobileScreen && (
            <Box flexBasis='26%'>
                <AdvertWidget />
                <FriendListWidget userId={user._id}/>
            </Box>
        )}
    </Box> 
}

export default HomePage;