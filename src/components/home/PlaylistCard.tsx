import { Star } from "lucide-react";

interface PlaylistCardProps {
  title: string;
  songCount: number;
  rating: number;
  gradient: string;
  icon?: React.ReactNode;
}

export default function PlaylistCard({
  title,
  songCount,
  rating,
  gradient,
  icon,
}: PlaylistCardProps) {
  return (
    <div className="group cursor-pointer">
      <div
        className={`relative aspect-square rounded-2xl overflow-hidden ${gradient} flex items-center justify-center transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-xl group-hover:shadow-black/30`}
      >
        {icon && <div className="opacity-80 group-hover:opacity-100 transition-opacity duration-300">{icon}</div>}

        {/* Rating badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
          <span className="text-xs text-white font-medium">{rating}</span>
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        </div>
      </div>
      <h3 className="mt-3 text-sm font-semibold text-white truncate">{title}</h3>
      <p className="text-xs text-grayDark">{songCount} songs</p>
    </div>
  );
}
