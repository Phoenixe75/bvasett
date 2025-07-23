import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { axiosApi } from '@/app/api/api';
import { IArticles } from '../(models)/article';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const token = Cookies.get('authToken');

export const getArticles = async (): Promise<IArticles[]> => {
    try {
        const response: AxiosResponse<any> = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/`, {});
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const getArticle = async (id: number): Promise<any> => {
    const response = await axios.get<any>(`${baseUrl}/api/articles/${id}/`);
    return response.data;
};

export const createArticle = async (formData: any): Promise<any> => {
    try {
        const response = await axios.post<any>(`${baseUrl}/api/articles/`, formData, {
            headers: {
                Authorization: `Token ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating ad:', error);
        throw error;
    }
};

export const updateArticle = async (id: number, formData: any): Promise<any> => {
    try {
        const response = await axios.put<any>(`${baseUrl}/api/articles/${id}/`, formData, {
            headers: {
                Authorization: `Token ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating ad:', error);
        throw error;
    }
};

export const onDeleteArticle = async (id: number): Promise<any> => {
    const response = await axios.delete<any>(`${baseUrl}/api/articles/${id}/`, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
};
