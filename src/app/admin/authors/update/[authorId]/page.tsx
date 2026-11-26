import AdminHeader from "@/components/admin/AdminHeader";
import UpdateAuthor from "@/components/admin/author/UpdateAuthor";

export default function Page({ params }: { params: { authorId: string } }) {
  return <><AdminHeader title="Cập nhật tác giả" /><UpdateAuthor authorId={params.authorId} /></>;
}
