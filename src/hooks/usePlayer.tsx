"use client"

import { HistoryService } from '@/services/HistoryService';
import { TPlayerContext, TPlaylistResponse, TSongResponse } from '@/types';
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

    const [volume, setVolume] = useState(1);
    const [repeatMode, setRepeatMode] = useState<"off" | "song" | "playlist">("off");
    const [queue, setQueue] = useState<{ id: number; songs: TSongResponse[] } | null>(null);

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;
    }, [volume]);

    const startPlayback = (audio: HTMLAudioElement) => {
        audio.play().catch((error: Error) => {
            if (error.name !== "AbortError") console.error("Lỗi khi phát nhạc:", error);
        });
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentSong?.audioUrl) return;
        setCurrentTime(0);
        setDuration(0);
        audio.src = currentSong.audioUrl;
        startPlayback(audio);
    }, [currentSong]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio || !currentSong?.audioUrl) return;
        if (audio.paused) startPlayback(audio);
        else audio.pause();
    };

    const recordPlay = async (song: TSongResponse) => {
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

    const startSong = (song: TSongResponse) => {
        setCurrentSong(song);
        void recordPlay(song);
    };

    const playSong = (song: TSongResponse) => {
        if (!song.audioUrl) return;
        setQueue(null);
        if (repeatMode === "playlist") setRepeatMode("off");
        if (song.id === currentSong?.id) togglePlay();
        else startSong(song);
    };

    const playPlaylist = (playlist: TPlaylistResponse, selected?: TSongResponse) => {
        const songs = playlist.songs?.filter(song => song.audioUrl) ?? [];
        const song = selected ?? songs[0];
        if (!playlist.id || !song?.audioUrl) return;
        if (queue?.id !== playlist.id) setRepeatMode("playlist");
        setQueue({ id: playlist.id, songs });
        if (song.id !== currentSong?.id) startSong(song);
        else if (queue?.id === playlist.id) togglePlay();
        else if (audioRef.current?.paused) startPlayback(audioRef.current);
    };

    const togglePlaylistRepeat = (playlist: TPlaylistResponse) => {
        if (!playlist.songs?.some(song => song.audioUrl)) return;
        if (queue?.id !== playlist.id) playPlaylist(playlist);
        setRepeatMode(queue?.id === playlist.id && repeatMode === "playlist" ? "off" : "playlist");
    };

    const advancePlaylist = (wrap: boolean) => {
        if (!queue) return;
        const index = queue.songs.findIndex(song => song.id === currentSong?.id);
        const next = queue.songs[index + 1] ?? (wrap ? queue.songs[0] : undefined);
        if (!next) {
            setIsPlaying(false);
        } else if (next.id === currentSong?.id && audioRef.current) {
            audioRef.current.currentTime = 0;
            startPlayback(audioRef.current);
        } else {
            startSong(next);
        }
    };

    const seek = (time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    return (
        <PlayerContext.Provider value={{ currentSong, isPlaying, currentTime, duration, volume, setVolume, repeat: repeatMode === "song",
            toggleRepeat: () => setRepeatMode(mode => mode === "song" ? "off" : "song"),
            nextTrack: () => advancePlaylist(true),
            playingPlaylistId: queue?.id ?? null, repeatingPlaylist: repeatMode === "playlist",
            playPlaylist, togglePlaylistRepeat, playSong, togglePlay, seek }}>
            <audio
                ref={audioRef}
                loop={repeatMode === "song" || (repeatMode === "playlist" && queue?.songs.length === 1)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onEnded={() => {
                    setIsPlaying(false);
                    advancePlaylist(repeatMode === "playlist");
                }}
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