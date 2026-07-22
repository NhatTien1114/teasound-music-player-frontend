"use client"

import { HistoryService } from '@/services/HistoryService';
import { TPlayerContext, TSongResponse } from '@/types';
import React, { createContext, useContext, useRef, useState } from 'react';
import useUser from './useUser';

const PlayerContext = createContext<TPlayerContext | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
    const [currentSong, setCurrentSong] = useState<TSongResponse | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const audioRef = useRef<HTMLAudioElement>(null);
    const { user } = useUser();

    const togglePlay = () => {
        if (!audioRef.current) return; // Không có nhạc thì ẩn NowPlayingBar
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const playSong = async (song: TSongResponse) => {
        if (song.id === currentSong?.id) {
            togglePlay();
        } else {
            setCurrentSong(song);
            setIsPlaying(true);
        }

        // Lưu/cập nhật lịch sử nghe nhạc và phát sự kiện lên client
        if (user?.id && song?.id) {
            try {
                const historyItem = await HistoryService.createHistory({
                    songId: song.id,
                    userId: user.id,
                });
                if (typeof window !== "undefined" && historyItem) {
                    window.dispatchEvent(new CustomEvent("history-updated", { detail: historyItem }));
                }
            } catch (error) {
                console.error("Lỗi khi lưu lịch sử nghe nhạc:", error);
            }
        }
    };

    const seek = (time: number) => {
        if (audioRef.current) audioRef.current.currentTime = time;
    };

    return (
        <PlayerContext.Provider value={{ currentSong, isPlaying, audioRef, playSong, togglePlay, seek }}>
            {children}
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error("usePlayer must be used within PlayerProvider");
    }
    return context;
}