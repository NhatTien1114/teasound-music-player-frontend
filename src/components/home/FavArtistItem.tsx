import { MoreHorizontal } from "lucide-react";

interface FavArtistItemProps {
  name: string;
  songCount: number;
  avatarGradient?: string;
}

export default function FavArtistItem({
  name,
  songCount,
  avatarGradient = "from-amber-400 to-orange-500",
}: FavArtistItemProps) {
  return (
    <div className="flex items-center gap-3 py-2.5 group cursor-pointer hover:bg-white/5 rounded-xl px-2 transition-colors duration-200">
      {/* Artist avatar */}
      <div
        className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarGradient} flex-shrink-0 shadow-md`}
      />

      {/* Artist info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{name}</p>
        <p className="text-xs text-grayDark">{songCount} songs in library</p>
      </div>

      {/* More menu */}
      <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <MoreHorizontal className="w-4 h-4 text-grayDark hover:text-white transition-colors" />
      </button>
    </div>
  );
}
