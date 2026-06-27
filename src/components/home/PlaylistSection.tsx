import PlaylistCard from "./PlaylistCard";
import { ChevronRight } from "lucide-react";

const playlists = [
  {
    title: "Best 80s songs",
    songCount: 173,
    rating: 3.8,
    gradient: "bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900",
    icon: (
      <div className="text-center">
        <div className="text-3xl font-black text-purple-300 tracking-tight">
          80s
        </div>
        <div className="text-xl font-bold text-pink-400 -mt-1">Hits</div>
      </div>
    ),
  },
  {
    title: "Old school",
    songCount: 41,
    rating: 4,
    gradient: "bg-gradient-to-br from-yellow-400 via-amber-300 to-yellow-300",
    icon: <span className="text-5xl drop-shadow-lg">🎸</span>,
  },
  {
    title: "Hesam's Top",
    songCount: 312,
    rating: 4.2,
    gradient: "bg-gradient-to-br from-slate-100 via-gray-200 to-slate-300",
    icon: <span className="text-5xl drop-shadow-lg">🎧</span>,
  },
];

export default function PlaylistSection() {
  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-white">Playlists</h2>
        <button className="flex items-center gap-1 text-sm text-grayDark hover:text-white transition-colors duration-200 group">
          <span>More</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-5">
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist.title} {...playlist} />
        ))}
      </div>
    </section>
  );
}
