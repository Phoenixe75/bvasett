import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { IPackages } from '../(models)/packages';
import { axiosApi } from '@/app/api/api';
import { WITHOUT_INQUIRY, WITH_INQUIRY } from '@/app/components/CardPackage/(models)/package';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
// const transformPayload = (data:any) => {
//     const newData = {...data}
//     console.log({newData})
//     newData[WITHOUT_INQUIRY] = data[WITHOUT_INQUIRY].toString();
//     newData[WITH_INQUIRY] = data[WITH_INQUIRY].toString();
//     return newData;
// }
export const getPackages = async (): Promise<any> => {
    try {
        const response: AxiosResponse<any> = await axiosApi.get(`${baseUrl}/api/packages/`, {});
        return response.data;
    } catch (error) {
        console.error('Error fetching ads:', error);
        throw error;
    }
};

export const getAllPackages = async (page: number = 1, pageSize: number = 5): Promise<any> => {
    try {
        const token = Cookies.get('authToken');
        const response: AxiosResponse<any> = await axiosApi.get(`${baseUrl}/api/settings/prices/`, {
            headers: {
                Authorization: `Token ${token}`
            },
            params: {
                page: page,
                pageSize: pageSize
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching packages:', error);
        throw error;
    }
};

export const createPackage = async (formData: IPackages): Promise<IPackages> => {
    try {
        const token = Cookies.get('authToken');
        const response = await axios.post<IPackages>(`${baseUrl}/api/settings/prices/`, formData, {
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

export const updatePackage = async (id: number, formData: IPackages): Promise<IPackages> => {

    try {
        const token = Cookies.get('authToken');
        const response = await axios.put<IPackages>(`${baseUrl}/api/settings/prices/${id}/`, formData, {
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

export const getPackageDetails = async (id: number): Promise<IPackages> => {
    const token = Cookies.get('authToken');
    const response = await axios.get<IPackages>(`${baseUrl}/api/settings/prices/${id}/`, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
};

export const onDeletePackage = async (id: number): Promise<any> => {
    const token = Cookies.get('authToken');
    const response = await axiosApi.delete<any>(`${baseUrl}/api/settings/prices/${id}/`, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
};
