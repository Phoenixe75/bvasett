import axios from 'axios';
import Cookies from 'js-cookie';
import {ISendSms, ISmsTemplateInterface, SendSmsDTO} from '../(models)/types';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const token = Cookies.get('authToken');

export const sendPreformattedSmsToUser = async (data: SendSmsDTO): Promise<any> => {
  try {
    const response = await axios.post<any>(
      `${baseUrl}/api/notification/sms/preformatted/`,
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

export const getSmsTemplates = async (): Promise<Array<ISmsTemplateInterface>> => {
  try {
    const response = await axios.get<Array<ISmsTemplateInterface>>(
      `${baseUrl}/api/settings/sms-templates/`,
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
