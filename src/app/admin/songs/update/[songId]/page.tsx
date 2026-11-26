import AdminHeader from "@/components/admin/AdminHeader";
import UpdateSong from "@/components/admin/songs/UpdateSong";

export default function Page({ params }: { params: { songId: string } }) {
  return <><AdminHeader title="Cập nhật bài hát" /><UpdateSong songId={params.songId} /></>;
}
