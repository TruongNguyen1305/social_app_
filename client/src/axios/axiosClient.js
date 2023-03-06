import axios from "axios";
import jwt from 'jwt-decode'

export const isExpiredToken = (token) => {
    let isExpired = false;
    let decodedToken = jwt(token);
    let dateNow = new Date();

    if (decodedToken.exp * 1000 < dateNow.getTime())
        isExpired = true;
    return isExpired
}

const axiosClient = axios.create({
    baseURL: 'http://localhost:3001/api/',
    timeout: 3000,
    headers: { 'X-Custom-Header': 'foobar' }
})



export default axiosClient
