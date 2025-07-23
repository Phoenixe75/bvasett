import axios from 'axios';
import Cookies from 'js-cookie';
import { OrderItem, OrderResponse } from '../(models)/myPayments.models';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const token = Cookies.get('authToken');

export const getOrders = async (page: number = 1): Promise<OrderResponse> => {
    try {
        const response = await axios.get<OrderResponse>(`${baseUrl}/api/orders/?page=${page}`, {
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

export const getOrder = async (id:number): Promise<OrderItem> => {
  try {
      const response = await axios.get<OrderItem>(`${baseUrl}/api/orders/${id}`, {
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
