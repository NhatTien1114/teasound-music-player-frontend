"use client";

import { Search } from "lucide-react";
import { typeOfMusic } from "@/constants";

export default function CatalogFilters({search, type, songs, filter}: {
  search: string; type?: string; songs?: boolean; filter: (key: string, value: string) => void;
}) {
  return <div className="studio-filters"><form key={search} role="search" onSubmit={event => {
    event.preventDefault();
    filter("search", String(new FormData(event.currentTarget).get("search") || "").trim());
  }}>
    <input type="search" name="search" defaultValue={search} placeholder={songs ? "Tìm theo tên bài hát…" : "Tìm theo tên tác giả…"} aria-label={songs ? "Tên bài hát" : "Tên tác giả"} />
    <button aria-label="Tìm kiếm" title="Tìm kiếm"><Search size={18}/></button>
  </form>
  {songs && <select aria-label="Lọc theo thể loại" value={type ?? ""} onChange={event => filter("type", event.target.value)}>
    <option value="">Tất cả thể loại</option>{typeOfMusic.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
  </select>}</div>;
}
