import axios, { AxiosResponse } from 'axios';
import { IReplayPageTicket, ITickets, ITicketsResponse } from '../(models)/tickets';
import Cookies from 'js-cookie';
import { axiosApi } from '@/app/api/api';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getAllTickets = async (page: number = 1): Promise<ITicketsResponse> => {
    try {
        const token = Cookies.get('authToken');
        const response: AxiosResponse<ITicketsResponse> = await axiosApi.get(`${baseUrl}/api/tickets/?page=${page}`, {
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

export const getTicket = async (id: number): Promise<any> => {
    try {
        const token = Cookies.get('authToken');
        const response: AxiosResponse<any> = await axiosApi.get(`${baseUrl}/api/tickets/${id}/`, {
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

export const updateTickets = async (id: number, formData: ITickets): Promise<any> => {
    try {
        const token = Cookies.get('authToken');
        const response: AxiosResponse<any> = await axiosApi.put(`${baseUrl}/api/tickets/${id}/`, formData, {
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

export const onDeleteTicket = async (id: number): Promise<any> => {
    const token = Cookies.get('authToken');
    const response = await axiosApi.delete<any>(`${baseUrl}/api/tickets/${id}/`, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
};

export const replayTicket = async (id: number, formData: IReplayPageTicket): Promise<any> => {
    try {
        const token = Cookies.get('authToken');
        const response: AxiosResponse<any> = await axiosApi.patch(`${baseUrl}/api/tickets/${id}/`, formData, {
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

export const createTicket = async (formData: any): Promise<any> => {
    try {
        const token = Cookies.get('authToken');
        const response = await axios.post<any>(`${baseUrl}/api/tickets/`, formData, {
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
