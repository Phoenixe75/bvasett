import { axiosApi } from "@/app/api/api";
import Cookies from "js-cookie";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getFavorite = async (page:number): Promise<any> => {
  const token = Cookies.get('authToken');
  try {
      const response = await axiosApi.get(`${baseUrl}/api/ads/favorites?page=${page}`, {
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