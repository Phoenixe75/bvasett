import axios from 'axios';
import Cookies from 'js-cookie';
import { PropertiesResponse } from '../(models)/properties.types';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const token = Cookies.get('authToken');

export const getProperties = async (page: number = 1): Promise<PropertiesResponse> => {
    try {
        const response = await axios.get<PropertiesResponse>(`${baseUrl}/api/properties/?page=${page}`, {
            headers: {
                Authorization: `Token ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating createAd:', error);
        throw error;
    }
};
