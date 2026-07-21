import { Star, MoreHorizontal } from "lucide-react";
import { HistoryResponse } from "@/services/HistoryService";
import { usePlayer } from "@/hooks/usePlayer";

export default function SongRow({ song, isLoading }: { song: HistoryResponse, isLoading: boolean }) {
  const { playSong } = usePlayer();

  const handlePlay = () => {
    if (!song) return;
    playSong({
      id: song.songId,
      name: song.title,
      audioUrl: song.audioUrl,
      thumbnailUrl: song.thumbnailUrl,
      duration: song.duration,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/5 transition-colors duration-200 group cursor-pointer">
        {/* Album art placeholder */}
        <div
          className="w-10 h-10 rounded-lg bg-linear-to-br shrink-0 shadow-md animate-pulse bg-grayDark/30"
        />

        {/* Song info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate animate-pulse bg-grayDark/30 h-5 rounded">.</p>
          <p className="text-xs text-grayDark truncate animate-pulse bg-grayDark/30 h-4 rounded">.</p>
        </div>

        {/* Duration */}
        <span className="text-xs text-grayDark tabular-nums animate-pulse bg-grayDark/30 h-5 rounded w-12"></span>

        {/* Rating */}
        <div className="flex items-center gap-1 ml-1">
          <span className="text-xs text-grayDark animate-pulse bg-grayDark/30 h-5 rounded w-8"></span>
        </div>

        {/* More menu */}
        <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-1">
          <MoreHorizontal className="w-4 h-4 text-grayDark hover:text-white transition-colors" />
        </button>
      </div>
    );
  }

  return (
    <div onClick={handlePlay} className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/5 transition-colors duration-200 group cursor-pointer">
      {/* Album art placeholder */}
      <img
        src={song.thumbnailUrl}
        alt={song.title}
        className="w-10 h-10 rounded-lg bg-linear-to-br shrink-0 shadow-md object-cover"
      />

      {/* Song info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{song.title}</p>
        <p className="text-xs text-grayDark truncate">{song.authorName}</p>
      </div>

      {/* Duration */}
      <span className="text-xs text-grayDark tabular-nums">{song.duration}</span>

      {/* Rating */}
      <div className="flex items-center gap-1 ml-1">
        <span className="text-xs text-grayDark">4.5</span>
        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
      </div>

      {/* More menu */}
      <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-1">
        <MoreHorizontal className="w-4 h-4 text-grayDark hover:text-white transition-colors" />
      </button>
    </div>
  );
}
