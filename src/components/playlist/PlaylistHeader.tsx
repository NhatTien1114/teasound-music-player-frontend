"use client";

import React from "react";
import { Music, UserPlus, MoreHorizontal, ListFilter } from "lucide-react";
import { TPlaylistResponse } from "@/types";

interface PlaylistHeaderProps {
  playlist: TPlaylistResponse | null;
  userName?: string;
  userAvatar?: string;
  onOpenEditModal: () => void;
}

export default function PlaylistHeader({
  playlist,
  userName = "Nhật Tiến",
  userAvatar,
  onOpenEditModal,
}: PlaylistHeaderProps) {
  const isPublic = playlist?.isPublic !== false;
  const cover = playlist?.coverImage || playlist?.thumbnailUrl;
  const title = playlist?.name || "My Playlist";
  const songCount = playlist?.songs?.length || 0;

  // Calculate total duration in minutes
  let totalMinutes = 0;
  playlist?.songs?.forEach((song) => {
    if (song.duration) {
      const parts = song.duration.split(":");
      if (parts.length === 2) {
        totalMinutes += parseInt(parts[0], 10) + Math.round(parseInt(parts[1], 10) / 60);
      }
    }
  });

  return (
    <div className="w-full text-white bg-gradient-to-b from-gray-800/80 via-gray-900/60 to-transparent p-6 rounded-2xl shadow-xl">
      {/* Top Banner Header */}
      <div className="flex items-end gap-6 pb-4">
        {/* Cover Image / Music Icon Box */}
        <div
          onClick={onOpenEditModal}
          className="relative group w-48 h-48 sm:w-56 sm:h-56 shrink-0 bg-[#282828] rounded-xl shadow-2xl flex items-center justify-center cursor-pointer overflow-hidden border border-white/10 hover:opacity-90 transition-opacity"
        >
          {cover ? (
            <img
              src={cover}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Music className="w-20 h-20 text-gray-400 group-hover:scale-105 transition-transform" />
          )}
        </div>

        {/* Info Column */}
        <div className="flex flex-col justify-end gap-2 flex-1 min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
            {isPublic ? "Playlist" : "Private Playlist"}
          </span>

          {/* Playlist Title */}
          <h1
            onClick={onOpenEditModal}
            className="text-4xl sm:text-6xl font-black text-white tracking-tight cursor-pointer hover:underline truncate py-1"
            title="Click to edit details"
          >
            {title}
          </h1>

          {/* User Row matching Spotify screenshot */}
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-300 font-medium">
            <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-gray-600 overflow-hidden text-xs font-bold shrink-0">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white">{userName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <span className="font-bold text-white hover:underline cursor-pointer">
              {userName}
            </span>
            <span>•</span>
            <span>{songCount} {songCount === 1 ? "song" : "songs"}</span>
            {totalMinutes > 0 && (
              <>
                <span>,</span>
                <span>{totalMinutes} min</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Row below header (Image 1 bottom row) */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-2">
        <div className="flex items-center gap-4">
          <button className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors">
            <UserPlus className="w-5 h-5" />
          </button>
          <button className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white cursor-pointer transition-colors">
          <span>List</span>
          <ListFilter className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}