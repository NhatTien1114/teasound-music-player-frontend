import SongRow from "./SongRow";

const recentSongs = [
  {
    title: "Starboy",
    artist: "The Weeknd",
    duration: "3:40",
    rating: 3,
    avatarGradient: "from-red-500 to-orange-600",
  },
  {
    title: "Not today",
    artist: "Imagine Dragons",
    duration: "4:18",
    rating: 5,
    avatarGradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Chandelier",
    artist: "Sia",
    duration: "3:36",
    rating: 4,
    avatarGradient: "from-pink-500 to-purple-500",
  },
  {
    title: "Shape of You",
    artist: "Ed Sheeran",
    duration: "3:54",
    rating: 4,
    avatarGradient: "from-green-500 to-teal-500",
  },
];

export default function RecentlyPlayedSection() {
  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-5">Recently played</h2>
      <div className="grid grid-cols-2 gap-1">
        {recentSongs.map((song) => (
          <SongRow key={song.title} {...song} />
        ))}
      </div>
    </section>
  );
}
