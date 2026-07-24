"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePlayer } from "@/hooks/usePlayer";
import { TPlaylistResponse } from "@/types";
import { Music, Play } from "lucide-react";
import { encodeId } from "@/utils/hashId";

interface PlaylistCardProps {
    playlist: TPlaylistResponse;
    onSelect?: (playlist: TPlaylistResponse) => void;
}

export default function PlaylistCard({ playlist, onSelect }: PlaylistCardProps) {
    const router = useRouter();
    const { playSong } = usePlayer();

    const handleCardClick = () => {
        if (onSelect) {
            onSelect(playlist);
        } else if (playlist.id) {
            router.push(`/playlist?id=${encodeId(playlist.id)}`);
        } else {
            router.push("/playlist");
        }
    };

    const handlePlayButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (playlist.songs && playlist.songs.length > 0) {
            playSong(playlist.songs[0]);
        }
        handleCardClick();
    };

    return (
        <div onClick={handleCardClick} className="group cursor-pointer shrink-0 w-[170px]">
            {/* Thumbnail */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-grayDarker shadow-md">
                {playlist.coverImage || playlist.thumbnailUrl ? (
                    <img
                        src={playlist.coverImage || playlist.thumbnailUrl}
                        alt={playlist.name || "Playlist"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-grayDarker to-grayDarkest">
                        <Music className="w-10 h-10 text-grayDark/50" />
                    </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <button
                        onClick={handlePlayButtonClick}
                        className="w-11 h-11 rounded-full bg-green-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 hover:bg-green-400 hover:scale-110 shadow-xl shadow-green-500/30 cursor-pointer"
                        aria-label="Play Playlist"
                    >
                        <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="mt-2.5 space-y-1 px-0.5">
                <h3 className="text-sm font-semibold text-white truncate group-hover:text-green-400 transition-colors duration-200">
                    {playlist.name || "My Playlist"}
                </h3>
                <p className="text-xs text-grayDark truncate">
                    {playlist.songs?.length || 0} bài hát
                </p>
            </div>
        </div>
    );
}