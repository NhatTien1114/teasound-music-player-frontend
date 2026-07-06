import { TSongResponse } from "@/types";
import { Music, Play, Plus, Heart } from "lucide-react";

const typeColors: Record<string, string> = {
  POP: "bg-blue-500",
  ROCK: "bg-red-500",
  HIPHOP: "bg-yellow-500",
  RNB: "bg-pink-500",
  EDM: "bg-cyan-500",
  JAZZ: "bg-amber-600",
  CLASSICAL: "bg-emerald-600",
  LOFI: "bg-indigo-500",
  KPOP: "bg-rose-500",
  VPOP: "bg-green-500",
  ACOUSTIC: "bg-orange-500",
  INDIE: "bg-violet-500",
  REMIX: "bg-fuchsia-500",
  OTHER: "bg-gray-500",
};

export default function SongCard({ song }: { song: TSongResponse }) {
  return (
    <div className="group cursor-pointer shrink-0 w-[170px]">
      {/* Thumbnail */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-grayDarker shadow-md">
        {song.thumbnailUrl ? (
          <img
            src={song.thumbnailUrl}
            alt={song.name || "Song"}
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
          {/* Action buttons */}
          <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
            <button
              className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              aria-label="Add to playlist"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
            </button>
            <button
              className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              aria-label="Like"
            >
              <Heart className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* Play button */}
          <button
            className="w-11 h-11 rounded-full bg-green-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 hover:bg-green-400 hover:scale-110 shadow-xl shadow-green-500/30"
            aria-label="Play"
          >
            <Play className="w-5 h-5 text-black fill-black ml-0.5" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-2.5 space-y-1 px-0.5">
        <h3 className="text-sm font-semibold text-white truncate group-hover:text-green-400 transition-colors duration-200">
          {song.name || "Unknown"}
        </h3>
        <p className="text-xs text-grayDark truncate">
          {song.description || "Unknown Artist"}
        </p>

        {/* Genre badge */}
        {song.type && (
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide text-white ${typeColors[song.type] || typeColors.OTHER
              }`}
          >
            {song.type}
          </span>
        )}
      </div>
    </div>
  );
}
