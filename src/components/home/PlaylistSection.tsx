"use client";
import { TSongResponse } from "@/types";
import SongCard from "./SongCard";
import ScrollableSection from "./ScrollableSection";
import { useEffect, useState } from "react";
import { TPlaylistResponse } from "@/types";
import { PlaylistService } from "@/services/PlaylistService";
import useUser from "@/hooks/useUser";
import PlaylistCard from "../playlist/PlaylistCard";

export default function PlaylistSection() {
    const [playlists, setPlaylists] = useState<TPlaylistResponse[]>([]);
    const { user } = useUser();

    useEffect(() => {
        const fetchPlaylists = async () => {
            if (!user?.id) return;
            const response = await PlaylistService.getAllPlaylists(user.id);
            if (response.success) {
                setPlaylists(response.data || []);
            }
        };
        fetchPlaylists();
    }, [user]);

    if (playlists.length === 0) return null;

    return (
        <ScrollableSection title="Danh sách phát của bạn">
            {playlists && playlists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
        </ScrollableSection>
    );
}