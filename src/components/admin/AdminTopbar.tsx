"use client";

import useUser from "@/hooks/useUser";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronRight, SlidersHorizontal } from "lucide-react";

export default function AdminTopbar() {
  const path = usePathname();
  const [, , section, action] = path.split("/");
  const label = section === "songs" ? "Bài hát" : section === "authors" ? "Tác giả" : "Tổng quan";
  const { user } = useUser();
  return <header className="studio-top"><nav aria-label="Đường dẫn"><SlidersHorizontal size={16} /><Link href="/admin">Quản trị</Link><ChevronRight size={14} /><Link href={section ? `/admin/${section}` : "/admin"}>{label}</Link>{action && <><ChevronRight size={14} /><span>{action === "create" ? "Thêm mới" : "Cập nhật"}</span></>}</nav>{user?.role === "ADMIN" && <span className="studio-account">{user.avatarUrl ? <Image src={user.avatarUrl} alt="" width={32} height={32} unoptimized /> : <b>{(user.name || user.email || "A").slice(0,1)}</b>}{user.name || user.email}</span>}</header>;
}
