import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response?.status === 401 &&
            typeof window !== "undefined"
        ) {
            // Không redirect nếu đang ở trang sign-in hoặc đang gọi /api/auth/me
            const isAuthPage = window.location.pathname.includes("/sign-in");
            const isAuthMeRequest = error.config?.url?.includes("/api/auth/me");

            if (!isAuthPage && !isAuthMeRequest) {
                localStorage.removeItem("token");
                window.location.href = "/sign-in";
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
