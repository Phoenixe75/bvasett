import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { axiosApi } from '@/app/api/api';
import { IOrdersItemProps, IOrdersResponse } from '../(models)/payment';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const token = Cookies.get('authToken');

export const getAllOrders = async (page: number = 1, pageSize: number = 15): Promise<IOrdersResponse> => {
    try {
        const response: AxiosResponse<IOrdersResponse> = await axiosApi.get(`${baseUrl}/api/orders/`, {
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
        console.error('Error fetching orders:', error);
        throw error;
    }
};

export const getOrders = async (id: number): Promise<any> => {
    try {
        const response = await axios.get<any>(`${baseUrl}/api/orders/${id}/`, {
            headers: {
                Authorization: `Token ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

export const onDeleteOrder = async (id: number): Promise<any> => {
    const response = await axios.delete<any>(`${baseUrl}/api/orders/${id}/`, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
};

export const updateOrderItem = async (id: number, formData: { status: number }): Promise<any> => {
    try {
        const token = Cookies.get('authToken');
        if (!token) {
            throw new Error('توکن احراز هویت یافت نشد');
        }

        const response = await axios.patch<any>(`${baseUrl}/api/orders/order-items/${id}`, formData, {
            headers: {
                Authorization: `Token ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating order item:', error);
        throw error;
    }
};

export const updateOrder = async (id: number, formData: { order_status: number }): Promise<any> => {
    try {
        const token = Cookies.get('authToken');
        if (!token) {
            throw new Error('توکن احراز هویت یافت نشد');
        }

        const response = await axios.patch<any>(`${baseUrl}/api/orders/${id}/`, formData, {
            headers: {
                Authorization: `Token ${token}`
            }
        });
        return response;
    } catch (error) {
        console.error('Error updating order item:', error);
        throw error;
    }
};