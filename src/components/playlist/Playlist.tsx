"use client";

import React, { useEffect, useState } from "react";
import { SongService } from "@/services/SongService";
import PlaylistCard from "./PlaylistCard";
import PlaylistHeader from "./PlaylistHeader";
import PlaylistSong from "./PlaylistSong";
import EditPlaylistDialog from "./EditPlaylistDialog";
import AddToPlaylistModal from "./AddToPlaylistModal";
import { TPlaylistResponse, TSongResponse } from "@/types";
import Heading from "@/typography/Heading";
import { Plus, Music } from "lucide-react";
import { PlaylistService } from "@/services/PlaylistService";
import useUser, { type TUser } from "@/hooks/useUser";
import { toast } from "sonner";
import SongCard from "../home/SongCard";

import { useRouter, useSearchParams } from "next/navigation";
import { decodeId } from "@/utils/hashId";

export default function Playlist() {
    const { user, isLoading } = useUser();
    if (isLoading) return <p role="status">Đang tải thư viện…</p>;
    return <PlaylistLibrary key={user?.id ?? "guest"} user={user} />;
}

function PlaylistLibrary({ user }: { user: TUser | null }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [songs, setSongs] = useState<TSongResponse[]>([]);
    const [playlists, setPlaylists] = useState<TPlaylistResponse[]>([]);
    const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(!!user?.id);
    const [activePlaylistId, setActivePlaylistId] = useState<number | null>(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const selectedSongToAdd = songs.find(song => song.id === Number(searchParams.get("addSong"))) ?? null;
    const closeSongPicker = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("addSong");
        router.replace(params.size ? `/playlist?${params}` : "/playlist", { scroll: false });
    };


    // Fetch songs and user playlists
    useEffect(() => {
        const fetchSongs = async () => {
            const response = await SongService.getAllSongs();
            if (response.success && response.data) {
                setSongs(response.data);
            }
        };
        fetchSongs();
    }, []);

    useEffect(() => {
        const fetchPlaylists = async () => {
            if (user?.id) {
                const response = await PlaylistService.getAllPlaylists(user.id);
                setIsLoadingPlaylists(false);
                if (response.success && response.data) {
                    setPlaylists(response.data);
                    const queryId = searchParams?.get("id");
                    if (queryId) {
                        const targetId = decodeId(queryId) || Number(queryId);
                        if (response.data.some((p) => p.id === targetId)) {
                            setActivePlaylistId(targetId);
                            return;
                        }
                    }
                    if (response.data.length > 0 && activePlaylistId === null) {
                        setActivePlaylistId(response.data[0].id || null);
                    }
                }
            }
        };
        fetchPlaylists();
    }, [user]);

    useEffect(() => {
        const queryId = searchParams?.get("id");
        if (queryId) {
            const decodedId = decodeId(queryId) || Number(queryId);
            if (decodedId && !isNaN(decodedId)) {
                setActivePlaylistId(decodedId);
            }
        }
    }, [searchParams]);

    const activePlaylist = playlists.find((p) => p.id === activePlaylistId) || playlists[playlists.length - 1] || null;

    const [isCreating, setIsCreating] = useState(false);
    const createPlaylist = async (initialSongId?: number) => {
        if (!user?.id) {
            toast.error("Vui lòng đăng nhập để tạo playlist");
            return;
        }
        if (isCreating) return;
        setIsCreating(true);
        try {
            const response = await PlaylistService.createPlaylist({
                name: `My Playlist #${playlists.length + 1}`,
                isPublic: true,
                initialSongId,
            });
            const saved = response.data;
            if (!response.success || !saved?.id) {
                toast.error(response.message || "Không thể tạo playlist. Vui lòng thử lại.");
                return;
            }
            setPlaylists(previous => [...previous, saved]);
            setActivePlaylistId(saved.id);
            toast.success(`Đã tạo ${saved.name}`);
        } finally {
            setIsCreating(false);
        }
    };

    // Feature 2: Update Playlist Title / Cover Image from Edit Details Dialog
    const handleUpdatePlaylist = async (updatedData: {
        name: string;
        coverImage: string;
        isPublic: boolean;
    }) => {
        if (!activePlaylist?.id) return;

        const response = await PlaylistService.updatePlaylist(
            activePlaylist.id,
            updatedData
        );

        // Update local state
        setPlaylists((prev) =>
            prev.map((p) =>
                p.id === activePlaylist.id
                    ? { ...p, ...updatedData }
                    : p
            )
        );

        toast.success("Cập nhật thông tin playlist thành công");
    };

    const addSong = async (playlistId: number, song: TSongResponse) => {
        if (!song.id) return;
        const result = await PlaylistService.addSongToPlaylist(playlistId, song.id);
        if (!result.success) {
            toast.error(result.message || "Kh?ng th? th?m b?i h?t v?o playlist.");
            return;
        }
        setPlaylists(previous => previous.map(playlist => {
            if (playlist.id !== playlistId || playlist.songs?.some(track => track.id === song.id)) return playlist;
            return { ...playlist, songs: [...(playlist.songs ?? []), song] };
        }));
        setActivePlaylistId(playlistId);
        toast.success(`?? th?m "${song.name}" v?o playlist`);
        if (selectedSongToAdd) closeSongPicker();
    };

    const handleRemoveSongFromActivePlaylist = async (songId: number) => {
        if (!activePlaylist?.id) return;
        await PlaylistService.removeSongFromPlaylist(activePlaylist.id, songId);

        setPlaylists((prev) =>
            prev.map((p) => {
                if (p.id === activePlaylist.id) {
                    return {
                        ...p,
                        songs: (p.songs || []).filter((s) => s.id !== songId),
                    };
                }
                return p;
            })
        );

        toast.success("Đã xóa bài hát khỏi playlist");
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Top Header & Playlist List Selector */}
            <div className="flex items-center justify-between">
                <Heading>Danh sách phát</Heading>
                <button
                    disabled={isCreating || isLoadingPlaylists}
                    onClick={() => createPlaylist()}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-4 py-2 rounded-full transition-all cursor-pointer shadow-lg shadow-green-500/20 text-sm"
                    title="Tạo playlist mới"
                >
                    <Plus className="w-5 h-5" />
                    <span>Tạo Playlist</span>
                </button>
            </div>

            {/* Playlists Tabs / Quick Selection Bar */}
            {playlists.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {playlists.map((pl) => {
                        const isActive = pl.id === activePlaylistId;
                        return (
                            <button
                                key={pl.id}
                                onClick={() => pl.id && setActivePlaylistId(pl.id)}
                                className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${isActive
                                    ? "bg-white text-black border-white shadow-md"
                                    : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                <Music className="w-3.5 h-3.5" />
                                <span>{pl.name || "My Playlist"}</span>
                                <span className="text-[10px] opacity-70">({pl.songs?.length || 0})</span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Main Playlist View (Spotify Style Header + Songs) */}
            {activePlaylist ? (
                <div className="bg-[#121212] rounded-2xl p-4 sm:p-6 border border-white/5 shadow-2xl">
                    {/* Feature 1 & 2: Spotify Header (Image 1 & Image 2) */}
                    <PlaylistHeader
                        playlist={activePlaylist}
                        userName={user?.username || "Nhật Tiến"}
                        userAvatar={user?.avatar}
                        onOpenEditModal={() => setIsEditModalOpen(true)}
                    />

                    {/* Playlist Songs List + Recommended Section */}
                    <PlaylistSong
                        playlist={activePlaylist}
                        allSongs={songs}
                        onAddSong={song => activePlaylist.id && addSong(activePlaylist.id, song)}
                        onRemoveSong={handleRemoveSongFromActivePlaylist}
                    />
                </div>
            ) : (
                <div className="text-center py-16 bg-[#181818] rounded-2xl border border-white/5">
                    <Music className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Bạn chưa có playlist nào</h3>
                    <p className="text-sm text-gray-400 mb-6">Nhấn nút bên dưới để tự động tạo playlist mới</p>
                    <button
                        disabled={isCreating || isLoadingPlaylists}
                        onClick={() => createPlaylist()}
                        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-full transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Tạo Playlist Ngay</span>
                    </button>
                </div>
            )}

            {/* Feature 2: Edit Details Dialog (Shadcn Dialog without description) */}
            <EditPlaylistDialog
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                playlist={activePlaylist}
                onSave={handleUpdatePlaylist}
            />

            {/* Feature 3: Add to Playlist Modal */}
            <AddToPlaylistModal
                isOpen={!!selectedSongToAdd && !isLoadingPlaylists}
                onClose={closeSongPicker}
                song={selectedSongToAdd}
                playlists={playlists}
                onSelectPlaylist={async id => { if (selectedSongToAdd) await addSong(id, selectedSongToAdd); }}
                onCreateNewPlaylist={() => createPlaylist(selectedSongToAdd?.id)}
            />
        </div>
    );
}