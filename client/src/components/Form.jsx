import { useState } from "react";
import { 
    Box, 
    Button, 
    TextField, 
    useMediaQuery, 
    Typography, 
    useTheme 
} from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "./FlexBetween";
import axiosClient from "../axios/axiosClient.js";

const registerSchema = yup.object().shape({
    firstName: yup.string().required('required'),
    lastName: yup.string().required('required'),
    email: yup.string().email('invalid email').required('required'),
    password: yup.string().required('required'),
    location: yup.string().required('required'),
    occupation: yup.string().required('required'),
    picture: yup.string().required('required'),
})

const loginSchema = yup.object().shape({
    email: yup.string().email('invalid email').required('required'),
    password: yup.string().required('required'),
})

const initialValueRegister = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    location: '',
    occupation: '',
    picture: '',
}

const initialValueLogin = {
    email: '',
    password: '',
}

function Form() {
    const [pageType, setPageType] = useState('login')
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isNonMobile = useMediaQuery('(min-width: 600px)')
    const isLogin = pageType === 'login'
    const isRegister = !isLogin

    const register = async(values, onSubmitProps) => {
        console.log(values)
        const formData = new FormData()
        for(let value in values){
            formData.append(value, values[value])
        }
        formData.append('picturePath', values.picture.name)
        try {
            const { data } = await axiosClient.post('/users/', formData)
            setPageType('login')
        } catch (error) {
            alert('User already exists')
            console.log(error.response.data.message)
        }
        onSubmitProps.resetForm()
    }

    const login = async (values, onSubmitProps) => {
        console.log(values)
        const formData = new FormData()
        for (let value in values) {
            formData.append(value, values[value])
        }
        try {
            const { data } = await axiosClient.post('/users/login', formData, {
                headers: { "Content-Type": "application/json" }
            })
            dispatch(setLogin({
                user: data.user,
                token: {
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken
                }
            }))
            navigate('/')
        } catch (error) {
            alert('Invalid email or password')
            console.log(error.response.data.message)
        }
        onSubmitProps.resetForm()
    }

    const handleFormSubmit = async(values, onSubmitProps)=>{
        if (isLogin) await login(values, onSubmitProps)
        if (isRegister) await register(values, onSubmitProps)
    }
    return ( 
        <Formik
            onSubmit={handleFormSubmit}
            initialValues = {isLogin ? initialValueLogin : initialValueRegister}
            validationSchema = {isLogin ? loginSchema : registerSchema}
        >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                resetForm
            }) => (
                <form
                    onSubmit={handleSubmit}
                >
                    <Box
                        display='grid'
                        gap='30px'
                        gridTemplateColumns='repeat(4, minmax(0, 1fr))'
                        sx ={{
                            '& > div': {gridColumn: isNonMobile ? undefined : 'span 4'}
                        }}
                    >
                        {isRegister && (
                            <>
                                <TextField 
                                    label='First Name'
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value = {values.firstName}
                                    name='firstName'
                                    error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                                    helperText = {touched.firstName  && errors.firstName}
                                    sx={{gridColumn: 'span 2'}}
                                />
                                <TextField
                                    label='Last Name'
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.lastName}
                                    name='lastName'
                                    error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                                    helperText={touched.lastName && errors.lastName}
                                    sx={{ gridColumn: 'span 2' }}
                                />
                                <TextField
                                    label='Location'
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.location}
                                    name='location'
                                    error={Boolean(touched.location) && Boolean(errors.location)}
                                    helperText={touched.location && errors.location}
                                    sx={{ gridColumn: 'span 4' }}
                                />
                                <TextField
                                    label='Occupation'
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.occupation}
                                    name='occupation'
                                    error={Boolean(touched.occupation) && Boolean(errors.occupation)}
                                    helperText={touched.occupation && errors.occupation}
                                    sx={{ gridColumn: 'span 4' }}
                                />
                                <Box
                                    gridColumn='span 4'
                                    border= {`1px solid ${theme.palette.neutral.medium}`}
                                    borderRadius ='5px'
                                    p='1rem'
                                >
                                    <Dropzone
                                        acceptedFiles='.jpg, .jpeg, .png'
                                        multiple={false}
                                        onDrop={(acceptedFiles) => setFieldValue('picture', acceptedFiles[0])}
                                    >
                                        {({getRootProps, getInputProps}) => (
                                            <Box
                                                {...getRootProps()}
                                                border={`2px dashed ${theme.palette.primary.main}`}
                                                p='1rem'
                                                sx ={{'&:hover': { cursor: 'pointer'}}}
                                            >
                                                <input {...getInputProps()} />
                                                {!values.picture ? (
                                                    <p>Add pciture here</p>
                                                ) : (
                                                    <FlexBetween>
                                                        <Typography>
                                                            {values.picture.name}
                                                        </Typography>
                                                        <EditOutlinedIcon />
                                                    </FlexBetween>
                                                )}
                                            </Box>
                                        )}
                                    </Dropzone>
                                </Box>
                            </>
                        )}
                        <TextField
                            label='Email'
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            name='email'
                            error={Boolean(touched.email) && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                            sx={{ gridColumn: 'span 4' }}
                        />
                        <TextField
                            label='Password'
                            type='password'
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            name='password'
                            error={Boolean(touched.password) && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                            sx={{ gridColumn: 'span 4' }}
                        />
                    </Box>
                    {/* Button */}
                    <Box>
                        <Button
                            fullWidth
                            type="submit"
                            sx ={{
                                m: '2rem 0',
                                p: '1rem',
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.background.alt,
                                "&:hover": {color: theme.palette.primary.main}
                            }}
                        >
                            {isLogin ? "LOGIN" : "REGISTER"}
                        </Button>
                        <Typography
                            onClick ={()=>{
                                setPageType(isLogin ? "register" : "login")
                                resetForm()
                            }}
                            sx={{
                                textDecoration: 'underline',
                                color: theme.palette.primary.main,
                                "&:hover": {
                                    cursor: "pointer",
                                    color: theme.palette.primary.light
                                }
                            }}
                        >
                            {isLogin ? "Don't have a account? Sign up here." : "Already have an account? Login here."}
                        </Typography>
                    </Box>
                </form>
            )}
        </Formik> 
    );
}

export default Form;