"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Music, Plus } from "lucide-react";
import { TPlaylistResponse, TSongResponse } from "@/types";

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: TSongResponse | null;
  playlists: TPlaylistResponse[];
  onSelectPlaylist: (playlistId: number) => Promise<void>;
  onCreateNewPlaylist: () => Promise<void>;
}

export default function AddToPlaylistModal({
  isOpen,
  onClose,
  song,
  playlists,
  onSelectPlaylist,
  onCreateNewPlaylist,
}: AddToPlaylistModalProps) {
  if (!song) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#282828] text-white border-none p-6 rounded-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white">
            Thêm vào playlist
          </DialogTitle>
          <p className="text-xs text-gray-400 truncate">
            Bài hát: <span className="text-white font-medium">{song.name || song.description || "Unkown Song"}</span>
          </p>
        </DialogHeader>

        <div className="space-y-2 mt-3 max-h-[300px] overflow-y-auto pr-1">
          {/* Option: Create New Playlist */}
          <button
            onClick={async () => {
              await onCreateNewPlaylist();
              onClose();
            }}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left group border border-white/10"
          >
            <div className="w-10 h-10 rounded-md bg-green-600 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Tạo playlist mới</p>
              <p className="text-xs text-gray-400">Tạo playlist tự động và thêm bài hát này</p>
            </div>
          </button>

          {/* List of Existing Playlists */}
          {playlists.length > 0 && (
            <div className="pt-2 border-t border-white/10 space-y-1">
              <p className="text-xs font-semibold text-gray-400 mb-2 px-1">Danh sách playlist của bạn</p>
              {playlists.map((pl) => (
                <button
                  key={pl.id}
                  onClick={async () => {
                    if (pl.id) {
                      await onSelectPlaylist(pl.id);
                      onClose();
                    }
                  }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/10 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-md bg-[#3e3e3e] flex items-center justify-center shrink-0 overflow-hidden">
                    {pl.coverImage || pl.thumbnailUrl ? (
                      <img
                        src={pl.coverImage || pl.thumbnailUrl}
                        alt={pl.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Music className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-medium text-white truncate">{pl.name || "My Playlist"}</p>
                    <p className="text-xs text-gray-400">{pl.songs?.length || 0} bài hát</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
