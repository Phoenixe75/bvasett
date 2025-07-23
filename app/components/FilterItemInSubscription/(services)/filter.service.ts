import { AxiosResponse } from 'axios';
import { axiosApi } from '@/app/api/api';
import { IFilter } from '../(models)/filter';
import { IAdsResponse } from '@/app/dashboard/admin/ads/(models)/ads';
import Cookies from 'js-cookie';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const filterAds = async (formData: IFilter, page: number): Promise<any> => {
    try {
        let url = `${baseUrl}/api/ads/search/?page=${page}`;

        if (formData?.priceLte !== undefined && formData.priceLte !== null) url += `&total_price__lte=${formData.priceLte}`;
        if (formData?.priceGte !== undefined && formData.priceGte !== null) url += `&total_price__gte=${formData.priceGte}`;
        if (formData?.areaLte !== undefined && formData.areaLte !== null) url += `&area__lte=${formData.areaLte}`;
        if (formData?.areaGte !== undefined && formData.areaGte !== null) url += `&area__gte=${formData.areaGte}`;
        if (formData?.roomLte !== undefined && formData.roomLte !== null) url += `&rooms__lte=${formData.roomLte}`;
        if (formData?.roomGte !== undefined && formData.roomGte !== null) url += `&rooms__gte=${formData.roomGte}`;
        if (formData?.purpose !== undefined && formData.purpose !== null) url += `&purpose=${formData.purpose}`;

        if (formData?.prePaidGte !== undefined && formData.prePaidGte !== null) url += `&rent_pre_paid_amount__gte=${formData.prePaidGte}`;
        if (formData?.prePaidLte !== undefined && formData.prePaidLte !== null) url += `&rent_pre_paid_amount__lte=${formData.prePaidLte}`;
        if (formData?.rentGte !== undefined && formData.rentGte !== null) url += `&rent_price__lte=${formData.rentGte}`;
        if (formData?.rentLte !== undefined && formData.rentLte !== null) url += `&rent_price__gte=${formData.rentLte}`;
        if (formData?.neighbourhood && formData.neighbourhood.length > 0) {
            url += `&neighborhoods=${formData.neighbourhood.join(',')}`;
        }

        const response: AxiosResponse<IAdsResponse> = await axiosApi.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching ads:', error);
        throw error;
    }
};

export const getPackages = async (): Promise<any> => {
    try {
        const response: AxiosResponse<any> = await axiosApi.get(`${baseUrl}/api/packages/`, {});
        return response.data;
    } catch (error) {
        console.error('Error fetching ads:', error);
        throw error;
    }
};
export const getPrices = async (): Promise<any> => {
    try {
        const response: AxiosResponse<any> = await axiosApi.get(`${baseUrl}/api/settings/prices/`, {});
        return response.data;
    } catch (error) {
        console.error('Error fetching prices:', error);
        throw error;
    }
};

export const postFavorite = async (ad_id:string): Promise<any> => {
    const token = Cookies.get('authToken');
    const options = token ? {
        headers: {
            Authorization: `Token ${token}`
        }
    } : {}
    try {
        const response: AxiosResponse<any> = await axiosApi.post(`${baseUrl}/api/ads/${ad_id}/favorite`, {}, options);
        console.log({ response })
        return response.data;
    } catch (error) {
        console.error('Error fetching ads:', error);
        throw error;
    }
};
