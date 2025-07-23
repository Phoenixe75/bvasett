import axios, { AxiosResponse } from 'axios';
import { IQuestions, IReplayPageQuestion } from '../(models)/questions';
import Cookies from 'js-cookie';
import { axiosApi } from '@/app/api/api';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getAllQuestions = async (page: number = 1, pageSize: number = 5): Promise<any> => {
    try {
        const token = Cookies.get('authToken');
        const response: AxiosResponse<any> = await axiosApi.get(`${baseUrl}/api/questions/`, {
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
        console.error('Error fetching questions:', error);
        throw error;
    }
};

export const getQuestion = async (id: number): Promise<any> => {
    try {
        const token = Cookies.get('authToken');
        const response: AxiosResponse<any> = await axiosApi.get(`${baseUrl}/api/questions/${id}/`, {
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

export const updateQuestion = async (id: number, formData: IQuestions): Promise<any> => {
    try {
        const token = Cookies.get('authToken');
        const response: AxiosResponse<any> = await axiosApi.put(`${baseUrl}/api/questions/${id}/`, formData, {
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

export const onDeleteQuestion = async (id: number): Promise<any> => {
    const token = Cookies.get('authToken');
    const response = await axiosApi.delete<any>(`${baseUrl}/api/questions/${id}/`, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
};

export const replayQuestion = async (id: number, formData: IReplayPageQuestion): Promise<any> => {
    try {
        const token = Cookies.get('authToken');
        const response: AxiosResponse<any> = await axiosApi.patch(`${baseUrl}/api/questions/${id}/`, formData, {
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
