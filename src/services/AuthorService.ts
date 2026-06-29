import { TAuthorResponse } from "@/types";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
})

axiosInstance.interceptors.request.use(
    (config) => {
        // Chỉ gọi localStorage nếu đang ở client (Browser)
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

type TApiResponse<T> = {
    success: boolean;
    message: string;
    data: T | null;
};

export const createAuthor = async ({ data }: { data: TAuthorResponse }): Promise<TApiResponse<TAuthorResponse>> => {
    try {
        const response = await axiosInstance.post("/api/authors", data);
        return {
            success: true,
            message: "Author created successfully",
            data: response.data
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || "Something went wrong",
            data: null
        };
    }
}