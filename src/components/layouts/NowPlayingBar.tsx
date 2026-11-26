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
  Repeat1,
  Maximize2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import slugify from "slugify";
import { encodeId } from "@/utils/hashId";

export default function NowPlayingBar() {
  const { currentSong, nextTrack, playingPlaylistId, isPlaying, currentTime, duration, volume, setVolume, repeat, toggleRepeat, togglePlay, seek } = usePlayer();

  if (!currentSong) return null;

  const slugifyName = slugify(currentSong.name || "", {
    lower: true,
    locale: "vi",
    strict: true,
    replacement: "-",
  })

  return (
    <div className="flex flex-wrap items-center gap-3 lg:gap-5 px-6 py-3 bg-grayDarker/80 backdrop-blur-xl border-t border-white/5">
      {/* Song Info */}
      <div className="flex items-center gap-3 min-w-0 max-w-52">
        <Link
          aria-label="Xem lời bài hát"
          href={`/song/${slugifyName}?id=${encodeId(currentSong.id)}`}
          className="relative w-12 h-12 rounded-full shrink-0 shadow-lg group/expand"
        >
          <Image
            src={currentSong.thumbnailUrl ?? "/placeholder.jpg"}
            alt={currentSong.name ?? ""}
            fill
            className={cn("object-cover rounded-full transition-opacity duration-300",
              isPlaying && "motion-safe:animate-[spin_8s_linear_infinite]")}
          />
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover/expand:opacity-100 transition-opacity duration-300">
            <Maximize2 className="w-4 h-4 text-white" />
          </div>
        </Link>
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
          aria-label={isPlaying ? "Tạm dừng" : "Phát"}
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:shadow-lg hover:bg-primary/50 transition-all duration-300 active:scale-95"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-white" fill="white" />
          ) : (
            <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
          )}
        </button>
        <button aria-label="Bài tiếp" disabled={playingPlaylistId === null} onClick={nextTrack} className="text-grayDark hover:text-white transition-colors duration-200">
          <SkipForward className="w-5 h-5" fill="currentColor" />
        </button>
      </div>

      {/* Waveform Visualization */}
      <input
        type="range"
        aria-label="Vị trí phát"
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
        <label className="flex items-center gap-2 text-grayDark">
          <Volume2 className="w-4 h-4" />
          <input type="range" aria-label="Âm lượng" min={0} max={100} value={Math.round(volume * 100)}
            onChange={e => setVolume(Number(e.target.value) / 100)} className="w-20 accent-secondary" />
        </label>
        <button type="button" aria-label="Lặp lại bài hát" aria-pressed={repeat} title="Lặp lại bài hát"
          onClick={toggleRepeat} className={cn("p-2 rounded-md", repeat ? "text-secondary bg-secondary/15" : "text-grayDark hover:text-white")}>
          <Repeat1 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
