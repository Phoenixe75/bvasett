import axios, { AxiosResponse } from 'axios';
import { ICheckUser, IVerifyOtp, IAuthenticatePassword, AuthenticateResponse } from '../(main)/auth/login/(models)/login';
import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const token = Cookies.get('authToken');
const getToken = () => {
    return token
}
const options = token ? {
        Authorization: `Token ${getToken()}`
} : {}
export const axiosApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        ...options
    }
});

// Add a request interceptor
axiosApi.interceptors.request.use(
    (config) => {
      // Only runs on the client side
      if (typeof window !== 'undefined') {
        const token = Cookies.get('authToken'); // replace with your token cookie name
        if (token) {
          config.headers.Authorization = `Token ${token}`;
        }
      }
  
      return config;
    },
    (error) => Promise.reject(error)
  );
axiosApi.interceptors.response.use(
    response => {
      // If the response is successful, just return it
      return response;
    },
    error => {
        // Check if the error response is a 401
        if (error.response && error.response.status === 401) {
        // Check if the requested URL is 'api/users/me/'
        if (error.config.url !== '/api/users/me/') {
          // Clear the cookie
          Cookies.remove('authToken'); // Replace with your cookie name
          window.location.reload();
          logoutUser()
        }
        
      }
  
      // Return the error to the calling code
      return Promise.reject(error);
    }
  );
export const authenticateStage1 = (data: ICheckUser): Promise<AxiosResponse<AuthenticateResponse>> => {
    return axiosApi.post<AuthenticateResponse>('/api/auth/authenticate/stage1', data);
};

export const authenticateStage2 = (data: IVerifyOtp): Promise<AxiosResponse<AuthenticateResponse>> => {
    return axiosApi.post<AuthenticateResponse>('/api/auth/authenticate/stage2/otp', data);
};

export const authenticateWithPassword = (data: IAuthenticatePassword): Promise<AxiosResponse<AuthenticateResponse>> => {
    return axiosApi.post<AuthenticateResponse>('/api/auth/authenticate/stage2/password', data);
};

export const logoutUser = async (): Promise<AxiosResponse<any>> => {
    const token = Cookies.get('authToken');
    return await axiosApi.post<any>(
        '/api/auth/logout',
        {},
        {
            headers: {
                Authorization: `Token ${token}`
            }
        }
    );
};
