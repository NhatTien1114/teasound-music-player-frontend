import { Star, MoreHorizontal } from "lucide-react";

interface SongRowProps {
  title: string;
  artist: string;
  duration: string;
  rating: number;
  avatarGradient?: string;
}

export default function SongRow({
  title,
  artist,
  duration,
  rating,
  avatarGradient = "from-purple-500 to-pink-500",
}: SongRowProps) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/5 transition-colors duration-200 group cursor-pointer">
      {/* Album art placeholder */}
      <div
        className={`w-10 h-10 rounded-lg bg-linear-to-br ${avatarGradient} shrink-0 shadow-md`}
      />

      {/* Song info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{title}</p>
        <p className="text-xs text-grayDark truncate">{artist}</p>
      </div>

      {/* Duration */}
      <span className="text-xs text-grayDark tabular-nums">{duration}</span>

      {/* Rating */}
      <div className="flex items-center gap-1 ml-1">
        <span className="text-xs text-grayDark">{rating}</span>
        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
      </div>

      {/* More menu */}
      <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-1">
        <MoreHorizontal className="w-4 h-4 text-grayDark hover:text-white transition-colors" />
      </button>
    </div>
  );
}
