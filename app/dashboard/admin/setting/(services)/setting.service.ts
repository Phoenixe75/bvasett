import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { ISetting } from '../(models)/setting';
import { axiosApi } from '@/app/api/api';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const token = Cookies.get('authToken');

export const getAllSettings = async (page: number = 1, pageSize: number = 5): Promise<any> => {
    try {
        const token = Cookies.get('authToken');
        const response: AxiosResponse<any> = await axiosApi.get(`${baseUrl}/api/settings/site-settings/`, {
            headers: {
                Authorization: `Token ${token}`
            },
            params: {
                page: page,
                pageSize: pageSize
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching packages:', error);
        throw error;
    }
};

export const getActiveSettings = async (): Promise<ISetting> => {
    try {
        const response: AxiosResponse<ISetting> = await axiosApi.get(`${baseUrl}/api/settings/site-settings/active/`, {});
        return response.data;
    } catch (error) {
        console.error('Error fetching sliders:', error);
        throw error;
    }
};

export const createSetting = async (formData: FormData): Promise<ISetting> => {
    try {
        const response = await axios.post<ISetting>(`${baseUrl}/api/settings/site-settings/`, formData, {
            headers: {
                Authorization: `Token ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating slider:', error);
        throw error;
    }
};

export const getSettingDetails = async (id: number): Promise<any> => {
    const response = await axios.get<any>(`${baseUrl}/api/settings/site-settings/${id}`, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
};

export const updateSetting = async (id: number, formData: FormData): Promise<void> => {
    await axios.put(`${baseUrl}/api/settings/site-settings/${id}/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Token ${token}`
        }
    });
};

export const onDeleteSetting = async (id: number): Promise<any> => {
    const response = await axiosApi.delete<any>(`${baseUrl}/api/settings/site-settings/${id}/`, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
};
