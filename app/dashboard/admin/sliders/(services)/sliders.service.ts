import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { axiosApi } from '@/app/api/api';
import { ISlider, ISliders } from '../(models)/sliders';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const token = Cookies.get('authToken');

export const getAllSliders = async (page: number = 1, pageSize: number = 5): Promise<ISliders[]> => {
    try {
        const response: AxiosResponse<ISliders[]> = await axiosApi.get(`${baseUrl}/api/settings/sliders/`, {
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
        console.error('Error fetching sliders:', error);
        throw error;
    }
};

export const getActiveSlider = async (): Promise<ISliders[]> => {
    try {
        const response: AxiosResponse<ISliders[]> = await axiosApi.get(`${baseUrl}/api/settings/sliders/active/`, {});
        return response.data;
    } catch (error) {
        console.error('Error fetching sliders:', error);
        throw error;
    }
};

export const createSlider = async (formData: FormData): Promise<ISlider> => {
    try {
        const response = await axios.post<ISlider>(`${baseUrl}/api/settings/sliders/`, formData, {
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

export const getSliderDetails = async (id: number): Promise<ISlider> => {
    const response = await axios.get<ISlider>(`${baseUrl}/api/settings/sliders/${id}/`, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
};

export const updateSlider = async (id: number, formData: FormData): Promise<any> => {
    try {
        const response = await axios.put<any>(`${baseUrl}/api/settings/sliders/${id}/`, formData, {
            headers: {
                Authorization: `Token ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating slider:', error);
        throw error;
    }
};

export const onDeleteSlider = async (id: number): Promise<any> => {
    const response = await axiosApi.delete<any>(`${baseUrl}/api/settings/sliders/${id}/`, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
};
