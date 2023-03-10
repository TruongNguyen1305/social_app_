import { Typography, useTheme } from "@mui/material";
import FlexBetween from "./FlexBetween";
import WidgetWrapper from "./WidgetWrapper";

function AdvertWidget() {
    const {palette} = useTheme()
    const dark =palette.neutral.dark
    const main = palette.neutral.main
    const medium = palette.neutral.medium
    return ( 
        <WidgetWrapper>
            <FlexBetween>
                <Typography color={dark} variant='h5' fontWeight='500'>
                    Sponsored
                </Typography>
                <Typography color={medium}>Create Ad</Typography>
            </FlexBetween>
            <img 
                width='100%'
                height='auto'
                alt='advert'
                src="http://localhost:3001/assets/info4.jpeg"
                style ={{
                    borderRadius: '0.75rem',
                    margin: '0.75rem 0'
                }}
            />
            <FlexBetween>
                <Typography color={main}>
                    Link
                </Typography>
                <Typography color={medium}>github.com/TruongNguyen1305</Typography>
            </FlexBetween>
            <Typography color={medium}>Test any there</Typography>
        </WidgetWrapper> 
    );
}

export default AdvertWidget;