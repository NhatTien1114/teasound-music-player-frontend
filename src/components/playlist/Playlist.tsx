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
import useUser from "@/hooks/useUser";
import { toast } from "sonner";
import SongCard from "../home/SongCard";

import { useSearchParams } from "next/navigation";
import { decodeId } from "@/utils/hashId";

export default function Playlist() {
    const searchParams = useSearchParams();
    const [songs, setSongs] = useState<TSongResponse[]>([]);
    const [playlists, setPlaylists] = useState<TPlaylistResponse[]>([]);
    const [activePlaylistId, setActivePlaylistId] = useState<number | null>(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedSongToAdd, setSelectedSongToAdd] = useState<TSongResponse | null>(null);

    const { user } = useUser();

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

    // Feature 1: Click Plus button -> Automatically create a playlist like Image 1
    const handleCreatePlaylist = async () => {
        if (!user?.id) {
            toast.error("Vui lòng đăng nhập để tạo playlist");
            return;
        }

        const playlistNumber = playlists.length + 1;
        const defaultName = `My Playlist #${playlistNumber}`;

        const response = await PlaylistService.createPlaylist({
            name: defaultName,
            thumbnailUrl: "",
            coverImage: "",
            isPublic: true,
            songs: [],
            userId: Number(user.id),
        });

        if (response.success && response.data) {
            const newPlaylist = response.data;
            setPlaylists((prev) => [...prev, newPlaylist]);
            if (newPlaylist.id) {
                setActivePlaylistId(newPlaylist.id);
            }
            toast.success(`Đã tạo ${defaultName}`);
        } else {
            // Fallback local creation if backend response is mocked
            const fallbackId = Date.now();
            const fallbackPlaylist: TPlaylistResponse = {
                id: fallbackId,
                name: defaultName,
                coverImage: "",
                isPublic: true,
                songs: [],
            };
            setPlaylists((prev) => [...prev, fallbackPlaylist]);
            setActivePlaylistId(fallbackId);
            toast.success(`Đã tạo ${defaultName}`);
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

    // Feature 3: Add song to playlist (existing or new)
    const handleAddSongToExistingPlaylist = async (playlistId: number) => {
        if (!selectedSongToAdd?.id) return;

        await PlaylistService.addSongToPlaylist(playlistId, selectedSongToAdd.id);

        // Update playlist in local state
        setPlaylists((prev) =>
            prev.map((p) => {
                if (p.id === playlistId) {
                    const currentSongs = p.songs || [];
                    if (!currentSongs.some((s) => s.id === selectedSongToAdd.id)) {
                        return { ...p, songs: [...currentSongs, selectedSongToAdd] };
                    }
                }
                return p;
            })
        );

        const target = playlists.find((p) => p.id === playlistId);
        toast.success(`Đã thêm bài hát vào ${target?.name || "playlist"}`);
    };

    const handleCreatePlaylistAndAddSong = async () => {
        if (!selectedSongToAdd) return;
        if (!user?.id) {
            toast.error("Vui lòng đăng nhập để tạo playlist");
            return;
        }

        const playlistNumber = playlists.length + 1;
        const defaultName = `My Playlist #${playlistNumber}`;

        const response = await PlaylistService.createPlaylist({
            name: defaultName,
            thumbnailUrl: "",
            coverImage: "",
            isPublic: true,
            songs: [selectedSongToAdd],
            userId: Number(user.id),
        });

        let newPlId: number | undefined = response.data?.id;

        if (response.success && response.data) {
            const newPl = response.data;
            if (newPl.id && selectedSongToAdd.id) {
                await PlaylistService.addSongToPlaylist(newPl.id, selectedSongToAdd.id);
            }
            setPlaylists((prev) => [...prev, { ...newPl, songs: [selectedSongToAdd] }]);
            if (newPl.id) setActivePlaylistId(newPl.id);
        } else {
            const fallbackId = Date.now();
            newPlId = fallbackId;
            const fallbackPlaylist: TPlaylistResponse = {
                id: fallbackId,
                name: defaultName,
                songs: [selectedSongToAdd],
            };
            setPlaylists((prev) => [...prev, fallbackPlaylist]);
            setActivePlaylistId(fallbackId);
        }

        toast.success(`Đã tạo ${defaultName} và thêm bài hát!`);
    };

    // Add song directly from Recommended section inside active playlist
    const handleAddRecommendedSong = async (song: TSongResponse) => {
        if (!activePlaylist?.id || !song.id) return;
        await PlaylistService.addSongToPlaylist(activePlaylist.id, song.id);

        setPlaylists((prev) =>
            prev.map((p) => {
                if (p.id === activePlaylist.id) {
                    const currentSongs = p.songs || [];
                    return { ...p, songs: [...currentSongs, song] };
                }
                return p;
            })
        );

        toast.success(`Đã thêm "${song.name}" vào ${activePlaylist.name}`);
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
                    onClick={handleCreatePlaylist}
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
                        songs={activePlaylist.songs || []}
                        allSongs={songs}
                        onAddSong={handleAddRecommendedSong}
                        onRemoveSong={handleRemoveSongFromActivePlaylist}
                    />
                </div>
            ) : (
                <div className="text-center py-16 bg-[#181818] rounded-2xl border border-white/5">
                    <Music className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Bạn chưa có playlist nào</h3>
                    <p className="text-sm text-gray-400 mb-6">Nhấn nút bên dưới để tự động tạo playlist mới</p>
                    <button
                        onClick={handleCreatePlaylist}
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
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                song={selectedSongToAdd}
                playlists={playlists}
                onSelectPlaylist={handleAddSongToExistingPlaylist}
                onCreateNewPlaylist={handleCreatePlaylistAndAddSong}
            />
        </div>
    );
}