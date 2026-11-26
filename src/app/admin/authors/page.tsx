import { Suspense } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import TableAuthor from "@/components/admin/author/TableAuthor";

export default function Page() {
  return <><AdminHeader title="Tác giả" href="/admin/authors/create" action="Thêm tác giả" />
    <Suspense fallback={<p role="status">Đang tải…</p>}><TableAuthor /></Suspense>
  </>;
}
