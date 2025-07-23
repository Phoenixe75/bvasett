import { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { axiosApi } from '@/app/api/api';
import { IQuestions } from '@/app/dashboard/admin/users-questions/(models)/questions';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const createQuestion = async (formData: IQuestions): Promise<any> => {
    try {
        const token = Cookies.get('authToken');
        const response: AxiosResponse<any> = await axiosApi.post(`${baseUrl}/api/questions/`, formData, {
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
