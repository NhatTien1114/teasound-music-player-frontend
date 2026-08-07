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
    },
    changePassword: async (userId: number | undefined, oldPassword: string, newPassword: string): Promise<boolean> => {
        try {
            const response = await axiosInstance.post('/api/users/' + userId + '/change-password', { oldPassword, newPassword });
            return response.status === 204;
        } catch (error) {
            console.error('Lỗi khi đổi mật khẩu:', error);
            return false;
        }
    },
    updateInfo: async (userId: number | undefined, name?: string, avatarUrl?: string) => {
        try {
            const response = await axiosInstance.put('/api/users/' + userId, { name, avatarUrl });
            return response.data;
        } catch (error: any) {
            console.error('Lỗi khi cập nhật thông tin:', error);
            return error?.response?.data || {
                error: 'Error',
                message: 'Lỗi không xác định'
            };
        }
    }
};