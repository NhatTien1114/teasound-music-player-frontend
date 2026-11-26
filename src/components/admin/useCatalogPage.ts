"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { TAllSongs, TPaginatedResponse } from "@/types";

export const pageSize = 5;

export function useCatalogPage<T>(fetchPage: (params: TAllSongs) => Promise<{ data: TPaginatedResponse<T> | null }>) {
  const router = useRouter();
  const params = useSearchParams();
  const query = params.toString();
  const page = Math.max(1, Math.floor(Number(params.get("page"))) || 1);
  const search = params.get("search") || "";
  const type = params.get("type") || undefined;
  const [data, setData] = useState<TPaginatedResponse<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchPage({page, limit: pageSize, search, type}).then(({data: result}) => {
      if (!active) return;
      const lastPage = Math.max(1, result?.totalPages || 0);
      if (result && page > lastPage) {
        const next = new URLSearchParams(query);
        next.set("page", String(lastPage));
        router.replace("?" + next.toString(), {scroll: false});
        return;
      }
      setData(result);
      setLoading(false);
    });
    return () => { active = false; };
  }, [page, search, type, revision, fetchPage, query, router]);

  function filter(key: string, value: string) {
    const next = new URLSearchParams(query);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set("page", "1");
    router.replace("?" + next.toString(), { scroll: false });
  }
  return {data, page, search, type, loading, filter, refresh: () => setRevision(v => v + 1)};
}
