import axios from 'axios';
import Cookies from 'js-cookie';
import { IVerifyResponse } from '../../filterResult/(models)/orderBuy';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const token = Cookies.get('authToken');
type Params = {
    Authority: string;
    Status: string;
}
export const getVerifyBuy = async (params:Params): Promise<IVerifyResponse> => {
    const response = await axios.get<IVerifyResponse>(`${baseUrl}/api/payments/verify/`, {
        headers: {
            Authorization: `Token ${token}`,
        },
        params
    });
    return response.data;
};
