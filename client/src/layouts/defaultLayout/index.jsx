import Navbar from "layouts/components/navbar";
// import Footer from "layouts/components/footer";
import { Box } from "@mui/system";

function DefaultLayout({children}) {
    return ( 
        <Box>
            <Navbar />
            {children}
            {/* <Footer/> */}
        </Box>
    );
}

export default DefaultLayout;