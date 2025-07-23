import axios from 'axios';
import { SubscribePlanPayload, SubscribePlanResponse, SubscriptionPlanItem } from '../(models)/subscription.model';
import { axiosApi } from '@/app/api/api';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getSubscriptionPlans = async (): Promise<SubscriptionPlanItem[]> => {
    try {
        const response = await axios.get<SubscriptionPlanItem[]>(`${baseUrl}/api/subscription/plan/active/`);
        return response.data;
    } catch (error) {
        console.error('Error order buy:', error);
        throw error;
    }
};


export const subscribePlan = async (formData:SubscribePlanPayload): Promise<SubscribePlanResponse> => {
  try {
      const response = await axiosApi.post<SubscribePlanResponse>(`${baseUrl}/api/subscription/subscribe`,formData);
      return response.data;
  } catch (error) {
      console.error('Error order buy:', error);
      throw error;
  }
};