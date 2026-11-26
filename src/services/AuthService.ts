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
        const response = await axiosInstance.post<any>("/api/auth/token", data);
        const resData = response.data;
        const resultData: AuthResponseData = resData?.result || resData;
        if (resultData?.token) {
            localStorage.setItem("token", resultData.token);
        }
        return resultData;
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
        const token = localStorage.getItem("token");
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        window.dispatchEvent(new Event("auth-change"));
        try {
            await axiosInstance.post("/api/auth/logout", {}, {
                withCredentials: true,
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
        } catch (error) {
            console.error("Lỗi khi đăng xuất ở backend:", error);
        }
    },

    getToken: (): string | null => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("token");
        }
        return null;
    }
};