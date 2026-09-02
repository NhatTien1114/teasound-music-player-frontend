"use client";

import { usePlayer } from "@/hooks/usePlayer";
import { useDominantColor } from "@/hooks/useDominantColor";
import { SongService } from "@/services/SongService";
import { TSongResponse } from "@/types";
import { decodeId } from "@/utils/hashId";
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Star,
    Volume2,
    ChevronDown,
    Repeat,
    Shuffle,
    ListMusic,
    Share2,
    MessageCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import CommentPanel from "./CommentPanel";

// Helper to parse LRC lyrics format [mm:ss.xx]
function parseLrc(lrcText: string): { time: number; text: string }[] {
    if (!lrcText) return [];
    const lines = lrcText.split("\n");
    const result: { time: number; text: string }[] = [];
    const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

    let hasTimestamps = false;

    for (const line of lines) {
        const match = timeRegex.exec(line);
        if (match) {
            hasTimestamps = true;
            const minutes = parseInt(match[1], 10);
            const seconds = parseInt(match[2], 10);
            const msStr = match[3];
            const milliseconds = parseInt(msStr, 10);
            const timeInSeconds = minutes * 60 + seconds + milliseconds / (msStr.length === 3 ? 1000 : 100);
            const text = line.replace(timeRegex, "").trim();
            result.push({ time: timeInSeconds, text });
        }
    }

    if (!hasTimestamps) {
        lines.forEach((line, index) => {
            const trimmed = line.trim();
            if (trimmed) {
                result.push({ time: index * 5, text: trimmed });
            }
        });
    }

    return result.sort((a, b) => a.time - b.time);
}

export default function SongLyricView() {
    const searchParams = useSearchParams();
    const encodedId = searchParams.get("id");
    const songId = decodeId(encodedId);

    const { currentSong, isPlaying, audioRef, togglePlay, playSong, seek } = usePlayer();
    const [song, setSong] = useState<TSongResponse | null>(null);
    const displaySong = song || currentSong;
    const [loading, setLoading] = useState(!displaySong);

    const lyrics = useMemo(() => {
        if (displaySong?.lyric) {
            const parsed = parseLrc(displaySong.lyric);
            if (parsed.length > 0) return parsed;
        }
        return [];
    }, [displaySong?.lyric]);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [volume, setVolume] = useState(1);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [showCommentPanel, setShowCommentPanel] = useState(false);

    const lyricsContainerRef = useRef<HTMLDivElement>(null);
    const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);

    const { color } = useDominantColor(displaySong?.thumbnailUrl);

    // Sync loading state if displaySong is present
    useEffect(() => {
        if (displaySong) {
            setLoading(false);
        }
    }, [displaySong]);

    // Fetch song data if not available in player context
    useEffect(() => {
        if (!songId) {
            setLoading(false);
            return;
        }

        if (currentSong?.id === songId) {
            setLoading(false);
            return;
        }

        let isMounted = true;
        const fetchSong = async () => {
            try {
                const result = await SongService.getSongById({ id: songId });
                if (isMounted && result.success && result.data) {
                    setSong(result.data);
                }
            } catch (error) {
                console.error("Error fetching song:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchSong();
        return () => {
            isMounted = false;
        };
    }, [songId, currentSong?.id]);

    // Update current lyric line
    useEffect(() => {
        let newIndex = 0;
        for (let i = lyrics.length - 1; i >= 0; i--) {
            if (currentTime >= lyrics[i].time) {
                newIndex = i;
                break;
            }
        }
        setCurrentLineIndex(newIndex);
    }, [currentTime, lyrics]);

    // Auto-scroll lyrics to current line
    useEffect(() => {
        const currentLine = lineRefs.current[currentLineIndex];
        if (currentLine && lyricsContainerRef.current) {
            currentLine.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [currentLineIndex]);

    useEffect(() => {
        if (currentSong?.audioUrl && audioRef.current) {
            audioRef.current.src = currentSong.audioUrl;
            audioRef.current.play();
        }
    }, [currentSong])

    // Volume control
    const handleVolumeChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newVolume = parseFloat(e.target.value);
            setVolume(newVolume);
            if (audioRef.current) {
                audioRef.current.volume = newVolume;
            }
        },
        [audioRef]
    );

    // Generate background style from dominant color
    const bgStyle = color
        ? {
            background: `
                radial-gradient(ellipse at 20% 50%, rgba(${color.r}, ${color.g}, ${color.b}, 0.6) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 20%, rgba(${Math.min(color.r + 40, 255)}, ${Math.min(color.g + 20, 255)}, ${Math.min(color.b + 30, 255)}, 0.35) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 100%, rgba(${Math.max(color.r - 30, 0)}, ${Math.max(color.g - 30, 0)}, ${Math.max(color.b - 20, 0)}, 0.5) 0%, transparent 60%),
                linear-gradient(180deg, rgba(${Math.floor(color.r * 0.3)}, ${Math.floor(color.g * 0.3)}, ${Math.floor(color.b * 0.3)}, 1) 0%, rgba(${Math.floor(color.r * 0.1)}, ${Math.floor(color.g * 0.1)}, ${Math.floor(color.b * 0.1)}, 1) 100%)
              `,
        }
        : { background: "linear-gradient(180deg, #1a1a2e 0%, #0d0d14 100%)" };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-grayDarkest flex items-center justify-center z-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <p className="text-white/50 text-sm">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (!displaySong) {
        return (
            <div className="fixed inset-0 bg-grayDarkest flex items-center justify-center z-50">
                <div className="text-center">
                    <p className="text-white/50 text-lg mb-4">Không tìm thấy bài hát</p>
                    <Link
                        href="/"
                        className="text-secondary hover:text-secondary/80 transition-colors underline"
                    >
                        Quay về trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col overflow-hidden transition-all duration-1000 ease-out"
            style={bgStyle}
        >
            {/* Noise overlay for texture */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Top Navigation Bar */}
            <div className="relative flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 shrink-0">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200 group"
                >
                    <ChevronDown className="w-6 h-6 group-hover:translate-y-0.5 transition-transform duration-200" />
                    <span className="text-sm font-medium hidden sm:inline">Quay lại</span>
                </Link>

                <div className="flex items-center gap-3">
                    <button className="text-white/50 hover:text-white transition-colors duration-200">
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button className="text-white/50 hover:text-white transition-colors duration-200">
                        <ListMusic className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:flex-row gap-6 lg:gap-10 px-4 sm:px-6 lg:px-12 xl:px-20 overflow-hidden min-h-0">
                {/* Left Column - Artwork + Controls (scrollable) */}
                <div className="lg:w-80 xl:w-88 shrink-0 lg:py-8 overflow-y-auto scrollbar-hide min-h-0 flex flex-col">
                    <div className="flex flex-col items-center gap-4 my-auto">

                        {/* Album Artwork */}
                        <div className="relative group">
                            <div
                                className="absolute w-full h-full -inset-4 rounded-3xl opacity-40 blur-2xl transition-opacity duration-500"
                                style={{
                                    background: color
                                        ? `radial-gradient(circle, rgba(${color.r}, ${color.g}, ${color.b}, 0.6), transparent)`
                                        : "none",
                                }}
                            />
                            <div className="relative w-48 h-48 sm:w-52 sm:h-52 lg:w-56 lg:h-56 xl:w-60 xl:h-60 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                                <Image
                                    src={displaySong.thumbnailUrl ?? "/placeholder.jpg"}
                                    alt={displaySong.name ?? "Song artwork"}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Playback Controls */}
                        <div className="flex items-center justify-center gap-6 w-full">
                            <button className="text-white/50 hover:text-white transition-colors duration-200">
                                <Shuffle className="w-4 h-4" />
                            </button>
                            <button className="text-white/80 hover:text-white transition-all duration-200 active:scale-90">
                                <SkipBack className="w-5 h-5" fill="currentColor" />
                            </button>
                            <button
                                onClick={() => togglePlay()}
                                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center
                                    hover:bg-white/20 hover:scale-105 transition-all duration-300 active:scale-95
                                    ring-1 ring-white/10"
                            >
                                {isPlaying ? (
                                    <Pause className="w-5 h-5 text-white" fill="white" />
                                ) : (
                                    <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                                )}
                            </button>
                            <button className="text-white/80 hover:text-white transition-all duration-200 active:scale-90">
                                <SkipForward className="w-5 h-5" fill="currentColor" />
                            </button>
                            <button className="text-white/50 hover:text-white transition-colors duration-200">
                                <Repeat className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex items-center gap-3 w-full">
                            <audio
                                ref={audioRef}
                                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                                onEnded={() => togglePlay()}
                            />
                            <span className="text-xs text-white/40 tabular-nums shrink-0">
                                {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}
                            </span>
                            <input
                                type="range"
                                min={0}
                                max={duration || 0}
                                value={currentTime}
                                onChange={(e) => seek(Number(e.target.value))}
                                className="flex-1"
                            />
                            <span className="text-xs text-white/40 tabular-nums shrink-0">
                                {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
                            </span>
                        </div>

                        {/* Song Info */}
                        <div className="w-full text-left">
                            <h1 className="text-base font-bold text-white leading-tight mb-1">
                                {displaySong.name}
                            </h1>
                            <p className="text-sm text-white/50 leading-relaxed line-clamp-2">
                                {displaySong.description ?? "Unknown Artist"}
                            </p>
                        </div>

                        {/* Star + Volume Row */}
                        <div className="flex items-center justify-between w-full">
                            <button className="text-yellow-400/80 hover:text-yellow-300 transition-colors duration-200">
                                <Star className="w-5 h-5" fill="currentColor" />
                            </button>

                            {/* Volume */}
                            <div className="relative flex items-center gap-2">
                                <button
                                    onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                                    className="text-white/50 hover:text-white transition-colors duration-200"
                                >
                                    <Volume2 className="w-5 h-5" />
                                </button>
                                <div
                                    className={cn(
                                        "flex items-center overflow-hidden transition-all duration-300",
                                        showVolumeSlider ? "w-24 opacity-100" : "w-0 opacity-0"
                                    )}
                                >
                                    <input
                                        type="range"
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        value={volume}
                                        onChange={handleVolumeChange}
                                        className="w-full h-1 appearance-none bg-white/20 rounded-full cursor-pointer
                                            [&::-webkit-slider-thumb]:appearance-none
                                            [&::-webkit-slider-thumb]:w-3
                                            [&::-webkit-slider-thumb]:h-3
                                            [&::-webkit-slider-thumb]:rounded-full
                                            [&::-webkit-slider-thumb]:bg-white
                                            [&::-moz-range-thumb]:w-3
                                            [&::-moz-range-thumb]:h-3
                                            [&::-moz-range-thumb]:rounded-full
                                            [&::-moz-range-thumb]:bg-white
                                            [&::-moz-range-thumb]:border-0"
                                        style={{
                                            background: `linear-gradient(to right, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.7) ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Comment Toggle Button */}
                        <button
                            onClick={() => setShowCommentPanel(!showCommentPanel)}
                            className={cn(
                                "flex items-center gap-1.5 py-1 transition-all duration-200 self-start",
                                showCommentPanel
                                    ? "text-white"
                                    : "text-white/40 hover:text-white/70"
                            )}
                            title="Bình luận"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm">Bình luận</span>
                        </button>

                        {/* Inline Comment Panel */}
                        {displaySong?.id && (
                            <div className="w-full">
                                <CommentPanel
                                    songId={displaySong.id}
                                    isOpen={showCommentPanel}
                                    onClose={() => setShowCommentPanel(false)}
                                    inline
                                />
                            </div>
                        )}

                        {/* Bottom padding for scroll */}
                        <div className="h-4 shrink-0" />
                    </div>
                </div>

                {/* Right Column - Lyrics */}
                <div className="flex-1 min-h-0 flex flex-col lg:py-8 lg:px-30">
                    <div
                        ref={lyricsContainerRef}
                        className="flex-1 overflow-y-auto pr-2 scrollbar-hide mask-gradient"
                        style={{
                            maskImage:
                                "linear-gradient(to bottom, transparent 0%, black 10%, black 85%, transparent 100%)",
                            WebkitMaskImage:
                                "linear-gradient(to bottom, transparent 0%, black 10%, black 85%, transparent 100%)",
                        }}
                    >
                        {/* Top spacer for scroll centering */}
                        <div className="h-[20vh] lg:h-[15vh]" />

                        {lyrics.map((line, index) => (
                            <p
                                key={index}
                                ref={(el) => {
                                    lineRefs.current[index] = el;
                                }}
                                className={cn(
                                    "py-2 sm:py-3 text-2xl sm:text-3xl lg:text-4xl font-bold cursor-pointer transition-all duration-500 ease-out select-none",
                                    line.text === "" && "py-6 sm:py-8",
                                    index === currentLineIndex
                                        ? "text-white scale-100 opacity-100"
                                        : index < currentLineIndex
                                            ? "text-white/25 scale-[0.98] opacity-70"
                                            : "text-white/30 scale-[0.98] opacity-80"
                                )}
                                onClick={() => {
                                    seek(line.time);
                                }}
                            >
                                {line.text || "\u00A0"}
                            </p>
                        ))}

                        {/* Bottom spacer */}
                        <div className="h-[30vh] lg:h-[20vh]" />
                    </div>
                </div>
            </div>

            {/* Bottom safe area for mobile */}
            <div className="h-2 sm:h-4 shrink-0" />
        </div>
    );
}
