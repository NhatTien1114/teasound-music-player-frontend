"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {page: number; totalPages: number; totalElements: number; limit: number};

export default function AdminFooter({ page, totalPages, totalElements, limit }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  function href(target: number) {
    const next = new URLSearchParams(params.toString());
    next.set("page", String(target));
    return "?" + next.toString();
  }
  return <footer className="studio-pagination">
    <span>{(page - 1) * limit + 1}–{Math.min(page * limit, totalElements)} trong {totalElements} kết quả</span>
    {totalPages > 1 && <nav aria-label="Phân trang">
      {page > 1 && <Link href={href(page - 1)} aria-label="Trang trước"><ChevronLeft size={17} /></Link>}
      <label>Trang <select aria-label="Chọn trang" value={page} onChange={event => router.push(href(Number(event.target.value)), {scroll: false})}>
        {Array.from({length: totalPages}, (_, index) => <option key={index} value={index + 1}>{index + 1}</option>)}
      </select> / {totalPages}</label>
      {page < totalPages && <Link href={href(page + 1)} aria-label="Trang sau"><ChevronRight size={17} /></Link>}
    </nav>}
  </footer>;
}
