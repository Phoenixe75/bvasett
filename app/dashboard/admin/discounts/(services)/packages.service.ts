import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { Discount } from '../(models)/discounts';
import { axiosApi } from '@/app/api/api';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getPackages = async (): Promise<any> => {
    try {
        const response: AxiosResponse<any> = await axiosApi.get(`${baseUrl}/api/packages/`, {});
        return response.data;
    } catch (error) {
        console.error('Error fetching ads:', error);
        throw error;
    }
};

export const getAllDiscounts = async (page: number = 1, pageSize: number = 5): Promise<any> => {
    try {
        const token = Cookies.get('authToken');
        const response: AxiosResponse<any> = await axiosApi.get(`${baseUrl}/api/discount/`, {
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

export const createDiscount = async (formData: Discount): Promise<Discount> => {
    try {
        const token = Cookies.get('authToken');
        const response = await axios.post<Discount>(`${baseUrl}/api/discount/`, formData, {
            headers: {
                Authorization: `Token ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating packages:', error);
        throw error;
    }
};

export const updateDiscount = async (id: number, formData: Discount): Promise<Discount> => {
    try {
        const token = Cookies.get('authToken');
        const response = await axios.put<Discount>(`${baseUrl}/api/discount/${id}/`, formData, {
            headers: {
                Authorization: `Token ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating packages:', error);
        throw error;
    }
};

export const getDiscountDetails = async (id: number): Promise<Discount> => {
    const token = Cookies.get('authToken');
    const response = await axios.get<Discount>(`${baseUrl}/api/discount/${id}/`, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
};

export const onDeleteDiscount = async (id: number): Promise<any> => {
    const token = Cookies.get('authToken');
    const response = await axiosApi.delete<any>(`${baseUrl}/api/discount/${id}/`, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
};
