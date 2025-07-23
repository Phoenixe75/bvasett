import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { OrderItem, OrderResponse, PlansItem, PostSubscriptionPlan } from '../(models)/planManager.models';
import { IFilter } from '@/app/components/FilterItem/(models)/filter';
import { IAdsResponse } from '@/app/dashboard/admin/ads/(models)/ads';
import { axiosApi } from '@/app/api/api';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const token = Cookies.get('authToken');

export const getSubscriptionsPlanList = async (): Promise<PlansItem[]> => {
    try {
        const response = await axios.get<PlansItem[]>(`${baseUrl}/api/subscription/plan/`, {
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


export const createPackage = async (formData: PostSubscriptionPlan): Promise<PostSubscriptionPlan> => {
    try {
        const token = Cookies.get('authToken');
        const response = await axios.post<PostSubscriptionPlan>(`${baseUrl}/api/subscription/plan/`, formData, {
            headers: {
                Authorization: `Token ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating packages:', error);
        throw error;
    }
};

export const updatePackage = async (id: number, formData: PostSubscriptionPlan): Promise<PostSubscriptionPlan> => {

    try {
        const token = Cookies.get('authToken');
        const response = await axios.put<PostSubscriptionPlan>(`${baseUrl}/api/subscription/plan/${id}/`, formData, {
            headers: {
                Authorization: `Token ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating packages:', error);
        throw error;
    }
};

export const getPackageDetails = async (id: number): Promise<PostSubscriptionPlan> => {
    const token = Cookies.get('authToken');
    const response = await axios.get<PostSubscriptionPlan>(`${baseUrl}/api/subscription/plan/${id}/`, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
};

export const onDeletePackage = async (id: number): Promise<any> => {
    const token = Cookies.get('authToken');
    const response = await axiosApi.delete<any>(`${baseUrl}/api/subscription/plan/${id}/`, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
};
