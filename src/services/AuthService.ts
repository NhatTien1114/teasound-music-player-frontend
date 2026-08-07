import axiosInstance from "@/lib/axiosInstance";

export interface LoginRequestData {
    email?: string;
    password?: string;
    displayName?: string;
    phoneNumber?: string;
}

export interface AuthResponseData {
    token?: string;
    id?: number;
    email?: string;
    name?: string;
    avatarUrl?: string;
    role?: string;
    message?: string;
}

export const AuthService = {
    login: async (data: LoginRequestData): Promise<AuthResponseData> => {
        const response = await axiosInstance.post<AuthResponseData>("/api/auth/login", data);
        if (response.data?.token) {
            localStorage.setItem("token", response.data.token);
        }
        return response.data;
    },

    register: async (data: LoginRequestData): Promise<AuthResponseData> => {
        const response = await axiosInstance.post<AuthResponseData>("/api/auth/register", data);
        return response.data;
    },

    exchangeOAuth2Token: async (): Promise<AuthResponseData> => {
        const response = await axiosInstance.post<AuthResponseData>(
            "/api/auth/token-exchange",
            {},
            { withCredentials: true }
        );
        if (response.data?.token) {
            localStorage.setItem("token", response.data.token);
        }
        return response.data;
    },

    logout: async (): Promise<void> => {
        try {
            await axiosInstance.post("/api/auth/logout");
        } catch (error) {
            console.error("Lỗi khi đăng xuất ở backend:", error);
        } finally {
            localStorage.removeItem("token");
        }
    },

    getToken: (): string | null => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("token");
        }
        return null;
    }
};