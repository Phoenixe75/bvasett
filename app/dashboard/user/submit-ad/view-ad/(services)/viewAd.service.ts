import axios from 'axios';
import Cookies from 'js-cookie';
import { Property } from '../(models)/viewAd.types';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const token = Cookies.get('authToken');

export const getProperty = async (id: string): Promise<Property> => {
    try {
        const response = await axios.get<Property>(`${baseUrl}/api/properties/${id}/`, {
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
