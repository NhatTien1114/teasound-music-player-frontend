import axios from 'axios';
import { TUserProfileResponse } from '@/types';
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export const UserService = {
    getCurrentUser: async (): Promise<TUserProfileResponse | null> => {
        try {
            const response = await axiosInstance.get<TUserProfileResponse>('/api/auth/me');
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy thông tin user:', error);
            return null;
        }
    }
};