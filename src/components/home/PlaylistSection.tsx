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
    const { user } = useUser();
    return user?.id ? <UserPlaylists key={user.id} userId={user.id} /> : null;
}

function UserPlaylists({ userId }: { userId: number }) {
    const [playlists, setPlaylists] = useState<TPlaylistResponse[]>([]);
  

    useEffect(() => {
        const fetchPlaylists = async () => {
            const response = await PlaylistService.getAllPlaylists(userId);
            if (response.success) {
                setPlaylists(response.data || []);
            }
        };
        fetchPlaylists();
    }, [userId]);

    if (playlists.length === 0) return null;

    return (
        <ScrollableSection title="Danh sách phát của bạn">
            {playlists && playlists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
        </ScrollableSection>
    );
}