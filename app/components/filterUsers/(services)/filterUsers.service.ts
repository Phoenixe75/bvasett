import { AxiosResponse } from 'axios';
import { axiosApi } from '@/app/api/api';
import { IAdsResponse } from '@/app/dashboard/admin/ads/(models)/ads';
import { IFilterUsers } from '../(models)/filterUsers';
import Cookies from 'js-cookie';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const token = Cookies.get('authToken');

export const filterUsers = async (formData: IFilterUsers, page: number): Promise<any> => {
    try {
        let url = `${baseUrl}/api/users/search/?page=${page}`;

        if (formData?.mobile !== undefined && formData.mobile !== null) url += `&mobile__icontains=${formData.mobile}`;
        if (formData?.national_id !== undefined && formData.national_id !== null) url += `&national_id__icontains=${formData.national_id}`;
        if (formData?.first_name !== undefined && formData.first_name !== null) url += `&first_name__icontains=${formData.first_name}`;
        if (formData?.last_name !== undefined && formData.last_name !== null) url += `&last_name__icontains=${formData.last_name}`;

        const response: AxiosResponse<IAdsResponse> = await axiosApi.get(url, {
            headers: {
                Authorization: `Token ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching ads:', error);
        throw error;
    }
};
