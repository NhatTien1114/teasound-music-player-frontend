import Link from "next/link";
import { Plus } from "lucide-react";

export default function AdminHeader({ title, href, action }: { title: string; href?: string; action?: string }) {
  return <div className="studio-heading"><h1>{title}</h1>{href && <Link className="studio-action" href={href}><Plus size={17} />{action}</Link>}</div>;
}
