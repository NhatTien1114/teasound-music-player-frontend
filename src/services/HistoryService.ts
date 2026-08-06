import { TCreateHistoryRequest, THistoryResponse } from "@/types";
import axiosInstance from "@/lib/axiosInstance";

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