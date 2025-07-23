import { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { axiosApi } from '@/app/api/api';
import { IPanel } from '../(models)/item-panel';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getOverview = async (): Promise<IPanel> => {
    try {
        const token = Cookies.get('authToken');
        const response: AxiosResponse<IPanel> = await axiosApi.get(`${baseUrl}/api/dashboard/records-overview`, {
            headers: {
                Authorization: `Token ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching packages:', error);
        throw error;
    }
};
