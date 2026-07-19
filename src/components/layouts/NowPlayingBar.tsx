"use client";

import { usePlayer } from "@/hooks/usePlayer";
import { cn } from "@/lib/utils";
import {
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Star,
  Volume2,
  Shuffle,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function NowPlayingBar() {
  const { currentSong, isPlaying, audioRef, togglePlay, seek } = usePlayer();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (currentSong?.audioUrl && audioRef.current) {
      audioRef.current.src = currentSong.audioUrl;
      audioRef.current.play();
    }
  }, [currentSong])

  if (!currentSong) return null;

  return (
    <div className="flex items-center gap-5 px-6 py-3 bg-grayDarker/80 backdrop-blur-xl border-t border-white/5">
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => togglePlay()}
      />
      {/* Song Info */}
      <div className="flex items-center gap-3 w-52 shrink-0">
        <div className={cn(
          "relative w-12 h-12 rounded-full shrink-0 shadow-lg",
          isPlaying && "animate-[spin_8s_linear_infinite]"
        )}>
          <Image
            src={currentSong.thumbnailUrl ?? "/placeholder.jpg"}
            alt={currentSong.name ?? ""}
            fill
            className="object-cover rounded-full"
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {currentSong.name}
          </p>
          <p className="text-xs text-grayDark truncate">{currentSong.description}</p>
        </div>
      </div>

      {/* Transport Controls */}
      <div className="flex items-center gap-3 shrink-0">
        <button className="text-grayDark hover:text-white transition-colors duration-200">
          <SkipBack className="w-5 h-5" fill="currentColor" />
        </button>
        <button
          onClick={() => togglePlay()}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:shadow-lg hover:bg-primary/50 transition-all duration-300 active:scale-95"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-white" fill="white" />
          ) : (
            <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
          )}
        </button>
        <button className="text-grayDark hover:text-white transition-colors duration-200">
          <SkipForward className="w-5 h-5" fill="currentColor" />
        </button>
      </div>

      {/* Waveform Visualization */}
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={currentTime}
        onChange={(e) => seek(Number(e.target.value))}
        className="flex-1"
      />

      {/* Time */}
      <div className="flex items-center gap-2 shrink-0 text-xs text-grayDark tabular-nums">
        <span>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}</span>
        <span className="text-white/20">/</span>
        <span>{Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}</span>
      </div>

      {/* Extra Controls */}
      <div className="flex items-center gap-3 shrink-0">
        <button className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200">
          <Star className="w-4 h-4" fill="currentColor" />
        </button>
        <button className="text-grayDark hover:text-white transition-colors duration-200">
          <Volume2 className="w-4 h-4" />
        </button>
        <button className="text-secondary hover:text-secondary/80 transition-colors duration-200">
          <Shuffle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
