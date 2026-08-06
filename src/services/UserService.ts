import axiosInstance from '@/lib/axiosInstance';
import { TUserProfileResponse } from '@/types';

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