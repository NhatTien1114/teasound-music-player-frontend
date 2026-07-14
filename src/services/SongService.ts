import { TAllSongs, TPaginatedResponse, TSongResponse } from "@/types";
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

const createSong = async ({ data }: { data: TSongResponse }): Promise<TApiResponse<TSongResponse>> => {
    try {
        const response = await axiosInstance.post("/api/songs/create", data);
        return {
            success: true,
            message: "Song created successfully",
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

const getAllSongs = async (params: TAllSongs): Promise<TApiResponse<TSongResponse[]>> => {
    try {
        const response = await axiosInstance.get("/api/songs");
        return {
            success: true,
            message: "Songs fetched successfully",
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

const updateSong = async ({ data }: { data: TSongResponse }): Promise<TApiResponse<TSongResponse>> => {
    try {
        const response = await axiosInstance.post("/api/songs/update", data);
        return {
            success: true,
            message: "Song updated successfully",
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

const getSongById = async ({ id }: { id: number }): Promise<TApiResponse<TSongResponse>> => {
    try {
        const response = await axiosInstance.get(`/api/songs/${id}`);
        return {
            success: true,
            message: "Song fetched successfully",
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

const getAllSongsPaginated = async (params: TAllSongs): Promise<TApiResponse<TPaginatedResponse<TSongResponse>>> => {
    try {
        const { page = 1, limit = 10, search = "", type } = params;
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            search,
        });
        if (type) {
            queryParams.set("type", type);
        }
        const response = await axiosInstance.get(`/api/songs/paginated?${queryParams.toString()}`);
        return {
            success: true,
            message: "Songs fetched successfully",
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


export const SongService = {
    createSong,
    getAllSongs,
    updateSong,
    getSongById,
    getAllSongsPaginated
}