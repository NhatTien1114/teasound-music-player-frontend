import FavArtistItem from "./FavArtistItem";
import { Play } from "lucide-react";

const favArtists = [
  {
    name: "Sia",
    songCount: 34,
    avatarGradient: "from-amber-400 to-pink-500",
  },
  {
    name: "Weeknd",
    songCount: 29,
    avatarGradient: "from-blue-400 to-indigo-600",
  },
];

export default function RightPanel() {
  return (
    <aside className="w-64 flex-shrink-0 space-y-6">
      {/* Upgrade Card */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 p-6 min-h-[200px] flex flex-col justify-between">
        {/* Decorative blurs */}
        <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-pink-400/30 blur-xl" />
        <div className="absolute bottom-6 right-10 w-14 h-14 rounded-full bg-blue-400/30 blur-lg" />
        <div className="absolute top-1/2 left-2 w-10 h-10 rounded-full bg-purple-300/20 blur-md" />

        <div className="relative z-10">
          <h3 className="text-xl font-bold text-white leading-tight">
            Upgrade
            <br />
            your account
          </h3>
        </div>

        <div className="relative z-10 self-end">
          <button className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors duration-200 shadow-lg">
            <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
          </button>
        </div>
      </div>

      {/* Fav Artists */}
      <div>
        <h3 className="text-base font-bold text-white mb-3">Fav Artists</h3>
        <div className="space-y-1">
          {favArtists.map((artist) => (
            <FavArtistItem key={artist.name} {...artist} />
          ))}
        </div>
      </div>
    </aside>
  );
}
