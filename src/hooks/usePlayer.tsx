"use client"

import { HistoryService } from '@/services/HistoryService';
import { TPlayerContext, TSongResponse } from '@/types';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import useUser from './useUser';

const PlayerContext = createContext<TPlayerContext | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
    const [currentSong, setCurrentSong] = useState<TSongResponse | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioRef = useRef<HTMLAudioElement>(null);
    const { user } = useUser();

    useEffect(() => {
        if (!currentSong?.audioUrl || !audioRef.current) return;

        audioRef.current.src = currentSong.audioUrl;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => setIsPlaying(true))
                .catch((error) => {
                    console.error("Lỗi khi phát nhạc:", error);
                    setIsPlaying(false);
                });
        }
    }, [currentSong]);

    const togglePlay = () => {
        if (!audioRef.current || !currentSong) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch((error) => {
                        console.error("Lỗi khi tiếp tục phát nhạc:", error);
                        setIsPlaying(false);
                    });
            }
        }
    };

    const playSong = async (song: TSongResponse) => {
        if (song.id === currentSong?.id) {
            togglePlay();
        } else {
            setCurrentSong(song);
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
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    return (
        <PlayerContext.Provider value={{ currentSong, isPlaying, currentTime, duration, audioRef, playSong, togglePlay, seek }}>
            <audio
                ref={audioRef}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onEnded={() => setIsPlaying(false)}
                onError={(e) => {
                    console.error("Audio media element error:", e);
                    setIsPlaying(false);
                }}
            />
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