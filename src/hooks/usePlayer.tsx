"use client"

import { TSongResponse } from '@/types'
import React, { createContext, useContext, useRef, useState } from 'react'

type PlayerContextType = {
    currentSong: TSongResponse | null;
    isPlaying: boolean,
    audioRef: React.RefObject<HTMLAudioElement>,
    playSong: (song: TSongResponse) => void,
    togglePlay: () => void,
    seek: (time: number) => void
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
    const [currentSong, setCurrentSong] = useState<TSongResponse | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlay = () => {
        if (!audioRef.current) return; // Không có nhạc thì ẩn NowPlayingBar
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }

    const playSong = (song: TSongResponse) => {
        if (song.id === currentSong?.id) {
            // Click lại bài đang phát
            togglePlay();
            return;
        }
        setCurrentSong(song);
        setIsPlaying(true);
    }

    const seek = (time: number) => {
        if (audioRef.current) audioRef.current.currentTime = time;
    };

    return (
        <PlayerContext.Provider value={{ currentSong, isPlaying, audioRef, playSong, togglePlay, seek }} >
            {children}
        </PlayerContext.Provider>
    )

}

export function usePlayer() {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error("usePlayer must be used within PlayerProvider");
    }
    return context;
}