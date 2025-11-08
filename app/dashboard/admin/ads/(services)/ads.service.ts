import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import {
  IAdsBase,
  IAdsResponse,
  ICity,
  IDistricts,
  INeighborhoods,
  INeighborhoodWithBlocks,
  IState
} from '../(models)/ads';
import { axiosApi } from '@/app/api/api';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const token = Cookies.get('authToken');

export const getAllAdsMain = async (page: number = 1, pageSize: number = 9): Promise<IAdsResponse> => {
    try {
        const response: AxiosResponse<IAdsResponse> = await axiosApi.get(`${baseUrl}/api/ads/search/`, {
            params: {
                page: page,
                pageSize: pageSize
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching ads:', error);
        throw error;
    }
};

export const getAllAds = async (page: number = 1): Promise<IAdsResponse> => {
    try {
        const response: AxiosResponse<IAdsResponse> = await axiosApi.get(`${baseUrl}/api/ads/?page=${page}`, {
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

export const createAds = async (formData: any): Promise<any> => {
    try {
        const response = await axios.post<any>(`${baseUrl}/api/ads/`, formData, {
            headers: {
                Authorization: `Token ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating ad:', error);
        throw error;
    }
};

export const updateAds = async (id: number, formData: any): Promise<any> => {
    try {
        const response = await axios.put<any>(`${baseUrl}/api/ads/${id}/`, formData, {
            headers: {
                Authorization: `Token ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating ad:', error);
        throw error;
    }
};

export const getAdsDetails = async (id: number): Promise<IAdsBase> => {
    const response = await axios.get<IAdsBase>(`${baseUrl}/api/ads/${id}/`, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
};

export const getStates = async (): Promise<IState[]> => {
    try {
        const response = await axios.get(`${baseUrl}/api/address/states/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching states:', error);
        throw error;
    }
};

export const getCitiesByState = async (stateId: number): Promise<ICity[]> => {
    try {
        const response = await axios.get(`${baseUrl}/api/address/states/${stateId}/cities/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cities:', error);
        throw error;
    }
};

export const getDistricts = async (): Promise<IDistricts[]> => {
    try {
        const response = await axios.get(`${baseUrl}/api/address/districts/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching districts:', error);
        throw error;
    }
};

export const getNeighborhoodsByDistrict = async (districtId: number): Promise<INeighborhoods[]> => {
    try {
        const response = await axios.get(`${baseUrl}/api/address/districts/${districtId}/neighborhoods/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cities:', error);
        throw error;
    }
};

export const onDeleteAds = async (id: number): Promise<IAdsBase> => {
    const response = await axios.delete<IAdsBase>(`${baseUrl}/api/ads/${id}/`, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
};

export const getState = async (id: number): Promise<IState[]> => {
    try {
        const response = await axios.get(`${baseUrl}/api/address/states/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching states:', error);
        throw error;
    }
};

export const getDistrict = async (id: number): Promise<IDistricts[]> => {
    try {
        const response = await axios.get(`${baseUrl}/api/address/districts/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching states:', error);
        throw error;
    }
};

export const getNeighborhoods = async (): Promise<INeighborhoods[]> => {
    try {
        const response = await axios.get(`${baseUrl}/api/address/neighborhoods/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cities:', error);
        throw error;
    }
};

export const searchNeighborhoods = async (): Promise<INeighborhoodWithBlocks[]> => {
    try {
        const response = await axios.get(`${baseUrl}/api/address/neighborhoods/search/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cities:', error);
        throw error;
    }
};
