import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true,
});

export const AuthService = {
    logout: async (): Promise<void> => {
        try {
            await axiosInstance.post("/api/auth/logout")
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
            throw error
        }
    }
}