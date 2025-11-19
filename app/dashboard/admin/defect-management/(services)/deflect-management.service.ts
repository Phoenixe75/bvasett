import Cookies from 'js-cookie';
import axios, {AxiosResponse} from 'axios';
import {axiosApi} from '@/app/api/api';
import {AdCompleteStatusEnumType} from '@/app/dashboard/admin/defect-management/(models)/types';
import {IAdsBase, IAdsResponse} from '@/app/dashboard/admin/ads/(models)/ads';
import {AdCompleteStatusEnum} from '@/app/dashboard/admin/defect-management/(models)/ad-complete-status.enum';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const token = Cookies.get('authToken');

export const getAdsByCompleteStatus = async (completeStatus: AdCompleteStatusEnumType, page: number = 1, pageSize: number = 25): Promise<IAdsResponse> => {
  try {
    const response: AxiosResponse<IAdsResponse> = await axiosApi.get(`${baseUrl}/api/ads?complete=${completeStatus}`, {
      headers: {
        Authorization: `Token ${token}`
      },
      params: {
        page: page,
        pageSize: pageSize
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
};

export const acceptDeflectFile = async (id: string | number, formData: any): Promise<any> => {
  const filterNullValues = (data: IAdsBase) => {
    return Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== null && value !== ''));
  };

  const filteredData = filterNullValues(formData);
  filteredData.complete = AdCompleteStatusEnum.complete
  try {
    const response = await axios.put<any>(`${baseUrl}/api/ads/${id}/`, filteredData, {
      headers: {
        Authorization: `Token ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating ad:', error);
    throw error;
  }
}
// export const rejectDeflectFileById = async ()
