import axios from 'axios';
import Cookies from 'js-cookie';
import { IOrderBuyRequest, IOrderBuyResponse, ItemBasedOrderBuyRequest, RequestPaymentPayload } from '../(models)/orderBuy';
import { axiosApi } from '@/app/api/api';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const token = Cookies.get('authToken');

export const orderBuy = async (formData: IOrderBuyRequest | ItemBasedOrderBuyRequest ): Promise<any> => {
    const token = Cookies.get('authToken');
    try {
        const response = await axios.post<IOrderBuyResponse>(`${baseUrl}/api/orders/buy/`, formData, {
            headers: {
                Authorization: `Token ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error order buy:', error);
        throw error;
    }
};

export const paymentService = async (guid: string): Promise<any> => {
    try {
        const token = Cookies.get('authToken');
        const response = await axios.put<any>(
            `${baseUrl}/api/payments/pay/${guid}`,
            {},
            {
                headers: {
                    Authorization: `Token ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error order payment:', error);
        throw error;
    }
};

export const paymentRequestService = async (formData: RequestPaymentPayload): Promise<any> => {
    try {
        const response = await axiosApi.put<any>(
            `${baseUrl}/api/payments/request/`,
            formData,
        );
        return response.data;
    } catch (error) {
        console.error('Error order payment:', error);
        throw error;
    }
};
