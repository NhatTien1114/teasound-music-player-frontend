import { TAllAuthors, TAuthorResponse, TPaginatedResponse } from "@/types";
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

const createAuthor = async ({ data }: { data: TAuthorResponse }): Promise<TApiResponse<TAuthorResponse>> => {
    try {
        const response = await axiosInstance.post("/api/authors/create", data);
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

const getAllAuthors = async (): Promise<TApiResponse<TAuthorResponse[]>> => {
    try {
        const response = await axiosInstance.get("/api/authors");
        return {
            success: true,
            message: "Authors fetched successfully",
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

const getAllAuthorsPaginated = async (params: TAllAuthors): Promise<TApiResponse<TPaginatedResponse<TAuthorResponse>>> => {
    try {
        const { page = 1, limit = 5, search = "" } = params;
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            search,
        });
        const response = await axiosInstance.get(`/api/authors/paginated?${queryParams.toString()}`);
        return {
            success: true,
            message: "Authors fetched successfully",
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

export const AuthorService = {
    createAuthor,
    getAllAuthors,
    getAllAuthorsPaginated,
}