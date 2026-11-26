"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AudioLines, Disc3, LayoutDashboard, Mic2, PanelLeftClose, PanelLeftOpen, Radio } from "lucide-react";

const items = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/songs", label: "Bài hát", icon: Disc3 },
  { href: "/admin/authors", label: "Tác giả", icon: Mic2 },
];

export default function AdminSidebar() {
  const path = usePathname();
  const [compact, setCompact] = useState(false);
  return <aside className={compact ? "studio-side compact" : "studio-side"}>
    <Link href="/admin" className="studio-brand" aria-label="TeaSound Studio"><AudioLines /><span>TeaSound <small>Studio</small></span></Link>
    <nav aria-label="Quản trị">{items.map(({ href, label, icon: Icon }) =>
      <Link key={href} href={href} aria-label={label} title={label} aria-current={(path === href || (href !== "/admin" && path.startsWith(href + "/"))) ? "page" : undefined}><Icon /><span>{label}</span></Link>
    )}</nav>
    <div className="studio-side-end">
      <Link href="/" title="Về trình phát" aria-label="Về trình phát"><Radio /><span>Về trình phát</span></Link>
      <button onClick={() => setCompact(!compact)} aria-label={compact ? "Mở rộng menu" : "Thu gọn menu"}>{compact ? <PanelLeftOpen /> : <PanelLeftClose />}<span>Thu gọn menu</span></button>
    </div>
  </aside>;
}
