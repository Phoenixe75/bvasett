import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { axiosApi } from '@/app/api/api';
import { SubmitAdFormData } from '../(models)/submitAdTypes';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const token = Cookies.get('authToken');

export const editPropertyAd = async (formData: Record<any,any>,id:string): Promise<SubmitAdFormData> => {
    try {
        const response = await axios.put<SubmitAdFormData>(`${baseUrl}/api/properties/${id}/`, formData, {
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
export const uploadImage = async (formData: FormData, onProgresPercentage: (percentage: number) => void): Promise<any> => {
    try {
        const response = await axios.post(`${baseUrl}/api/properties/images/upload`, formData, {
            headers: {
                Authorization: `Token ${token}`,
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    if (onProgresPercentage) {
                        onProgresPercentage(progress);
                    }
                }
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating createAd:', error);
        throw error;
    }
};
