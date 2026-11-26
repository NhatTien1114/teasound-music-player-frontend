"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowUpRight, Disc3, Layers3, Mic2, RefreshCw } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { SongService } from "@/services/SongService";
import { AuthorService } from "@/services/AuthorService";
import { typeOfMusic } from "@/constants";
import type { TSongResponse } from "@/types";

export default function Dashboard() {
  const [songs, setSongs] = useState<TSongResponse[] | null>(null);
  const [authors, setAuthors] = useState<number | null>(null);
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([SongService.getAllSongs(), AuthorService.getAllAuthorsPaginated({page: 1, limit: 1})]).then(([tracks, artists]) => {
      if (!active) return;
      setSongs(tracks.data);
      setAuthors(artists.data?.totalElements ?? null);
      setLoading(false);
    });
    return () => { active = false; };
  }, [revision]);

  const counts = new Map<string, number>();
  for (const song of songs ?? []) {
    const genre = String(song.type || "");
    if (genre) counts.set(genre, (counts.get(genre) ?? 0) + 1);
  }
  const genres = Array.from(counts).sort((a,b) => b[1] - a[1]);
  const latest = [...(songs ?? [])].sort((a,b) => (b.id ?? 0) - (a.id ?? 0)).slice(0, 6);
  const metrics = [
    { label: "Bài hát", value: songs?.length, icon: Disc3 },
    { label: "Tác giả", value: authors, icon: Mic2 },
    { label: "Thể loại có bài hát", value: songs ? counts.size : null, icon: Layers3 },
  ];
  const empty = loading ? "Đang tải thư viện…" : songs === null ? "Chưa tải được dữ liệu bài hát." : "Chưa có dữ liệu.";
  return <>
    <AdminHeader title="Tổng quan thư viện" href="/admin/songs/create" action="Thêm bài hát" />
    {!loading && (songs === null || authors === null) && <div role="status" className="studio-notice">Một phần dữ liệu chưa tải được.<button onClick={() => setRevision(v => v + 1)}><RefreshCw size={15}/>Thử lại</button></div>}
    <section className="studio-metrics" aria-label="Thống kê thư viện">{metrics.map(({ label, value, icon: Icon }) =>
      <article key={label}><div><Icon size={19} />{label}</div><strong>{loading ? "…" : value?.toLocaleString("vi-VN") ?? "—"}</strong></article>
    )}</section>
    <div className="studio-panels">
      <section className="studio-panel"><header><h2>Bài hát mới thêm</h2><Link href="/admin/songs">Xem tất cả <ArrowUpRight size={15}/></Link></header>
        {latest.length ? <ul>{latest.map(song => <li key={song.id}><Link className="studio-track" href={`/admin/songs/update/${song.id}`}>
          <span className="studio-cover">{song.thumbnailUrl ? <Image alt="" src={song.thumbnailUrl} width={44} height={44} unoptimized /> : <Disc3 />}</span>
          <span className="studio-track-name"><b>{song.name}</b><small>{song.authorName || "Chưa có tác giả"}</small></span><time>{song.duration || "—"}</time>
        </Link></li>)}</ul> : <p>{empty}</p>}
      </section>
      <section className="studio-panel"><header><h2>Phân bố thể loại</h2><Layers3 size={18}/></header>
        {genres.length ? <ol className="studio-bars">{genres.map(([genre, count]) => <li key={genre}><Link href={`/admin/songs?type=${encodeURIComponent(genre)}`}><span>{typeOfMusic.find(g => g.value === genre)?.label ?? genre}</span><b>{count.toLocaleString("vi-VN")} bài</b><i><em style={{width: `${100 * count / (songs?.length || 1)}%`}} /></i></Link></li>)}</ol> : <p>{empty}</p>}
      </section>
    </div>
  </>;
}
