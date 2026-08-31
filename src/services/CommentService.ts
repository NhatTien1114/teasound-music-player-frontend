import { TCommentResponse, TCreateCommentRequest } from "@/types";
import axiosInstance from "@/lib/axiosInstance";

export const CommentService = {
    getCommentsBySongId: async (songId: number): Promise<TCommentResponse[]> => {
        try {
            const response = await axiosInstance.get<TCommentResponse[]>(`/api/comments/${songId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching comments:", error);
            return [];
        }
    },

    createComment: async (songId: number, request: TCreateCommentRequest): Promise<TCommentResponse | null> => {
        try {
            const response = await axiosInstance.post<TCommentResponse>(`/api/comments/${songId}`, request);
            return response.data;
        } catch (error) {
            console.error("Error creating comment:", error);
            return null;
        }
    },

    deleteComment: async (commentId: number): Promise<boolean> => {
        try {
            await axiosInstance.delete(`/api/comments/${commentId}`);
            return true;
        } catch (error) {
            console.error("Error deleting comment:", error);
            return false;
        }
    },
};
