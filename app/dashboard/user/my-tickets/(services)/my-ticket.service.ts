import { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { axiosApi } from '@/app/api/api';
import { ITickets } from '@/app/dashboard/admin/users-tickets/(models)/tickets';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const createMyTicket = async (formData: ITickets): Promise<any> => {
    try {
        const token = Cookies.get('authToken');
        const response: AxiosResponse<any> = await axiosApi.post(`${baseUrl}/api/tickets/`, formData, {
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
