import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { IUsersResponse } from '../(models)/users';
import { axiosApi } from '@/app/api/api';
import { ICity } from '../(models)/city';
import { IChangePasswordProps, ISetPasswordProps } from '@/app/dashboard/user/my-password/(models)/password';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const token = Cookies.get('authToken');

export const getUsers = async (page: number = 1): Promise<IUsersResponse> => {
    try {
        const response: AxiosResponse<IUsersResponse> = await axiosApi.get('/api/users/', {
            headers: {
                Authorization: `Token ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const getUser = async (userId: number): Promise<any> => {
    const response = await axios.get<any>(`${baseUrl}/api/users/${userId}/`, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
};

export const getCity = async (cityId: any): Promise<ICity> => {
    const token = Cookies.get('authToken');
    const response = await axios.get<ICity>(`${baseUrl}/api/address/states/${cityId}/cities/`, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
};

export const setPasswordUser = async (data: ISetPasswordProps): Promise<any> => {
    try {
        const response = await axios.patch<any>(
            `${baseUrl}/api/users/${data.id}/`,
            { new_password: data.newPassword },
            {
                headers: {
                    Authorization: `Token ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating password:', error);
        throw error; // Rethrow the error to be handled in the calling function
    }
};

export const changePassword = async (data: IChangePasswordProps): Promise<any> => {
    try {
        const response = await axios.patch<any>(
            `${baseUrl}/api/users/${data.id}/`,
            {
                old_password: data.oldPassword,
                new_password: data.newPassword
            },
            {
                headers: {
                    Authorization: `Token ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating password:', error);
        throw error; // Rethrow the error to be handled in the calling function
    }
};
