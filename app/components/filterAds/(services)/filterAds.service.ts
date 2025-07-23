import { AxiosResponse } from 'axios';
import { axiosApi } from '@/app/api/api';
import { IAdsResponse } from '@/app/dashboard/admin/ads/(models)/ads';
import { IFilterAds } from '../(models)/filterAds';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const filterAdsAdmin = async (formData: IFilterAds, page: number): Promise<any> => {
    try {
        let url = `/api/ads/search/?page=${page}`;

        if (formData?.title !== undefined && formData.title !== null) url += `&title__icontains=${formData.title}`;
        if (formData?.slug !== undefined && formData.slug !== null) url += `&id__icontains=${formData.slug}`;

        const response: AxiosResponse<IAdsResponse> = await axiosApi.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching ads:', error);
        throw error;
    }
};
