import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import "./admin.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="studio" lang="vi">
    <AdminSidebar />
    <div className="studio-body">
      <AdminTopbar />
      <main className="studio-main">{children}</main>
    </div>
  </div>;
}
