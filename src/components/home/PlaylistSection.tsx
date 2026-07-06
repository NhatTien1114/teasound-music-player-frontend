"use client";
import { TSongResponse } from "@/types";
import SongCard from "./SongCard";
import ScrollableSection from "./ScrollableSection";
import { useEffect, useState } from "react";
import { SongService } from "@/services/SongService";

export default function PlaylistSection() {
  const [songs, setSongs] = useState<TSongResponse[]>([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const response = await SongService.getAllSongs();
      if (response.success) {
        setSongs(response.data || []);
      }
    };
    fetchSongs();
  }, []);

  if (songs.length === 0) return null;

  return (
    <ScrollableSection title="Dành cho bạn">
      {songs.map((song) => (
        <SongCard key={song.id} song={song} />
      ))}
    </ScrollableSection>
  );
}
