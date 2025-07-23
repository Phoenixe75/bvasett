import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { OrderItem, OrderResponse } from '../(models)/myPayments.models';
import { IFilter } from '@/app/components/FilterItem/(models)/filter';
import { IAdsResponse } from '@/app/dashboard/admin/ads/(models)/ads';
import { axiosApi } from '@/app/api/api';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const token = Cookies.get('authToken');

export const getSubscriptionsList = async (page: number = 1): Promise<OrderResponse> => {
    try {
        const response = await axios.get<OrderResponse>(`${baseUrl}/api/subscription/?page=${page}`, {
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

export const getSubscription = async (id:number): Promise<OrderItem> => {
  try {
      const response = await axios.get<OrderItem>(`${baseUrl}/api/subscription/${id}`, {
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

export const getSubscriptionAds = async (id:number, formData: IFilter, page: number): Promise<IAdsResponse> => {
    try {
        let url = `${baseUrl}/api/subscription/${id}/ads/?page=${page}`;

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