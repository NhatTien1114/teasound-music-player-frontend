import axios from "axios";

const BACK_END_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({
    baseURL: BACK_END_URL,
    withCredentials: true
});

export interface CreateHistoryRequest {
    userId: number;
    songId: number;
}

export interface HistoryResponse {
    id: number;
    songId: number;
    title: string;
    duration: string;
    thumbnailUrl: string;
    audioUrl: string;
    authorName: string;
    userId: number;
    playedAt: string;
}

export const HistoryService = {
    getHistory: async (userId?: number): Promise<HistoryResponse[]> => {
        try {
            const response = await axiosInstance.get(`/api/history?userId=${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching history:", error);
            throw error;
        }
    },
    createHistory: async (request: CreateHistoryRequest): Promise<HistoryResponse> => {
        try {
            const response = await axiosInstance.post("/api/history", request);
            return response.data;
        } catch (error) {
            console.error("Error creating history:", error);
            throw error;
        }
    }
}