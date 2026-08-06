/* eslint-disable @typescript-eslint/no-explicit-any */
import { TPlaylistResponse } from "@/types";
import axiosInstance from "@/lib/axiosInstance";

type TApiResponse<T> = {
    success: boolean;
    message: string;
    data: T | null;
};

export const PlaylistService = {
    getAllPlaylists: async (userId: string | number): Promise<TApiResponse<TPlaylistResponse[]>> => {
        try {
            const response = await axiosInstance.get(`/api/playlists/${userId}`);
            return {
                success: true,
                message: "Playlists fetched successfully",
                data: response.data
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong",
                data: null
            };
        }
    },

    createPlaylist: async (playlist: Partial<TPlaylistResponse>): Promise<TApiResponse<TPlaylistResponse>> => {
        try {
            const response = await axiosInstance.post(`/api/playlists/create`, playlist);
            return {
                success: true,
                message: "Playlist created successfully",
                data: response.data
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong",
                data: null
            };
        }
    },

    updatePlaylist: async (id: number, playlist: Partial<TPlaylistResponse>): Promise<TApiResponse<TPlaylistResponse>> => {
        try {
            const response = await axiosInstance.put(`/api/playlists/${id}`, playlist);
            return {
                success: true,
                message: "Playlist updated successfully",
                data: response.data
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong",
                data: null
            };
        }
    },

    getPlaylistById: async (id: number): Promise<TApiResponse<TPlaylistResponse>> => {
        try {
            const response = await axiosInstance.get(`/api/playlists/detail/${id}`);
            return {
                success: true,
                message: "Playlist fetched successfully",
                data: response.data
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong",
                data: null
            };
        }
    },

    addSongToPlaylist: async (playlistId: number, songId: number): Promise<TApiResponse<void>> => {
        try {
            await axiosInstance.post(`/api/playlists/${playlistId}/songs/${songId}`);
            return {
                success: true,
                message: "Song added to playlist",
                data: null
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to add song to playlist",
                data: null
            };
        }
    },

    removeSongFromPlaylist: async (playlistId: number, songId: number): Promise<TApiResponse<void>> => {
        try {
            await axiosInstance.delete(`/api/playlists/${playlistId}/songs/${songId}`);
            return {
                success: true,
                message: "Song removed from playlist",
                data: null
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to remove song",
                data: null
            };
        }
    }
}