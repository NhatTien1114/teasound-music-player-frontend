"use client";

import {
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Star,
  Volume2,
  Shuffle,
} from "lucide-react";
import { useState, useMemo } from "react";

export default function NowPlayingBar() {
  const [isPlaying, setIsPlaying] = useState(true);

  const totalSeconds = 230; // 3:50
  const currentSeconds = 36; // 0:36
  const progressPercent = (currentSeconds / totalSeconds) * 100;

  // Generate a consistent waveform pattern
  const waveformBars = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => {
        const seed =
          Math.sin(i * 0.7) * 0.4 +
          Math.cos(i * 0.3) * 0.3 +
          Math.sin(i * 1.2) * 0.2 +
          0.5;
        return Math.max(15, Math.min(100, seed * 100));
      }),
    []
  );

  return (
    <div className="flex items-center gap-5 px-6 py-3 bg-grayDarker/80 backdrop-blur-xl border-t border-white/5">
      {/* Song Info */}
      <div className="flex items-center gap-3 w-52 shrink-0">
        <div className="w-12 h-12 rounded-full bg-linear-to-br from-amber-200 via-orange-300 to-pink-400 shrink-0 shadow-lg shadow-orange-500/20 animate-[spin_8s_linear_infinite]" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            Dark paradise
          </p>
          <p className="text-xs text-grayDark truncate">Lana del ray</p>
        </div>
      </div>

      {/* Transport Controls */}
      <div className="flex items-center gap-3 shrink-0">
        <button className="text-grayDark hover:text-white transition-colors duration-200">
          <SkipBack className="w-5 h-5" fill="currentColor" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 rounded-full bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 active:scale-95"
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
      <div className="flex items-end gap-[2px] h-8 flex-1 min-w-0">
        {waveformBars.map((height, i) => {
          const isPlayed = (i / waveformBars.length) * 100 < progressPercent;
          return (
            <div
              key={i}
              className={`flex-1 rounded-full min-w-[2px] transition-colors duration-150 ${isPlayed ? "bg-pink-500" : "bg-white/10"
                }`}
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>

      {/* Time */}
      <div className="flex items-center gap-2 shrink-0 text-xs text-grayDark tabular-nums">
        <span>0:36</span>
        <span className="text-white/20">/</span>
        <span>3:50</span>
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
