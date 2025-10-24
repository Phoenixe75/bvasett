import axios from 'axios';
import Cookies from 'js-cookie';
import {ISendSms} from '@/app/dashboard/admin/send-sms/(models)/types';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const token = Cookies.get('authToken');

export const sendSmsToUsersByIds = async (data: ISendSms): Promise<any> => {
  try {
    const response = await axios.post<any>(
      `${baseUrl}/api/users/send-message/`,
      {...(data)},
      {
        headers: {
          Authorization: `Token ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending sms to users:', error);
    throw error; // Rethrow the error to be handled in the calling function
  }
};
