import axios from 'axios';
import { localstorageRemoveEntire } from './localstorage';

// Create an instance of Axios
const AxiosInterceptors = axios.create();
// Add a response interceptor
AxiosInterceptors.interceptors.response.use(
    (response) => {
        // window.location.href='/property/'
        console.log('data from axios interceptors....', response?.data)
        if (response?.data?.authenticated === false) {
            localstorageRemoveEntire()
            window.location.href = '/marriage'
        }
        // Check if the response condition is met
        if (response.status === 200 && response.data.success) {
            
            // Modify the response data
            response.data.message = 'Response modified!';
        }

        return response;
    },
    (error) => {
        // Handle error cases
        return Promise.reject(error);
    }
);

export default AxiosInterceptors