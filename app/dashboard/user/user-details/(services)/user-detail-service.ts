import axios from 'axios';
import Cookies from 'js-cookie';
import { IUsers } from '@/app/dashboard/admin/users/(models)/users';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const getUserDetails = async (userId: number): Promise<IUsers> => {
    const token = Cookies.get('authToken');
    const response = await axios.get<IUsers>(`${baseUrl}/api/users/${userId}/`, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
};

const updateUserDetails = async (userId: number, userData: IUsers): Promise<void> => {
    const token = Cookies.get('authToken');
    await axios.put(`${baseUrl}/api/users/${userId}/`, userData, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
};

export { getUserDetails, updateUserDetails };
