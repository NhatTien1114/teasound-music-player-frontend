import PlaylistSection from "@/components/home/PlaylistSection";
import RecentlyPlayedSection from "@/components/home/RecentlyPlayedSection";
import RightPanel from "@/components/home/RightPanel";

export default function Home() {
  return (
    <>
      <div className="flex gap-6">
        {/* Main content - left column */}
        <div className="flex-1 space-y-8 min-w-0">
          <PlaylistSection />
          <RecentlyPlayedSection />
        </div>

        {/* Right panel */}
        <RightPanel />
      </div>
    </>
  );
}
