import { TCreateHistoryRequest, THistoryResponse } from "@/types";
import axios from "axios";

const BACK_END_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({
    baseURL: BACK_END_URL,
    withCredentials: true
});

export const HistoryService = {
    getHistory: async (userId?: number): Promise<THistoryResponse[]> => {
        try {
            const response = await axiosInstance.get(`/api/history?userId=${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching history:", error);
            throw error;
        }
    },
    createHistory: async (request: TCreateHistoryRequest): Promise<THistoryResponse> => {
        try {
            const response = await axiosInstance.post("/api/history", request);
            return response.data;
        } catch (error) {
            console.error("Error creating history:", error);
            throw error;
        }
    }
}