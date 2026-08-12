"use client"

import SongRow from "./SongRow";
import { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import { THistoryResponse } from "@/types";
import { HistoryService } from "@/services/HistoryService";

export default function RecentlyPlayedSection() {
  const { user } = useUser();
  const [history, setHistory] = useState<THistoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.id) return;
      try {
        setIsLoading(true);
        const historyData = await HistoryService.getHistory(user.id);
        // Chỉ lấy tối đa 4 bài nhạc nghe gần nhất
        setHistory(historyData.slice(0, 4));
      } catch (error) {
        console.error("Lỗi khi tải lịch sử nghe nhạc:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [user?.id]);

  useEffect(() => {
    const handleHistoryUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<THistoryResponse>;
      const newItem = customEvent.detail;
      if (!newItem || !newItem.songId) return;

      setHistory((prevHistory) => {
        // Loại bỏ bài hát đã có trong danh sách (nếu trùng songId)
        const filtered = prevHistory.filter((item) => item.songId !== newItem.songId);
        // Đưa bài vừa nghe lên đầu danh sách và chỉ giữ tối đa 4 bài
        return [newItem, ...filtered].slice(0, 4);
      });
    };

    window.addEventListener("history-updated", handleHistoryUpdate);
    return () => {
      window.removeEventListener("history-updated", handleHistoryUpdate);
    };
  }, []);

  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-5">Bài hát nghe gần đây</h2>
      <div className="grid grid-cols-2 gap-1">
        {isLoading && user?.id
          ? Array.from({ length: 4 }).map((_, index) => (
            <SongRow key={index} song={{} as THistoryResponse} isLoading={true} />
          ))
          : history.map((song) => (
            <SongRow key={song.id} song={song} isLoading={false} />
          ))}
      </div>
    </section>
  );
}
