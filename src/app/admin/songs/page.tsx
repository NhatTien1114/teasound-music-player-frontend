import { Suspense } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import TableSongs from "@/components/admin/songs/TableSongs";

export default function Page() {
  return <><AdminHeader title="Bài hát" href="/admin/songs/create" action="Thêm bài hát" />
    <Suspense fallback={<p role="status">Đang tải…</p>}><TableSongs /></Suspense>
  </>;
}
