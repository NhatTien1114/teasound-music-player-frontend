"use client";

import React, { useState } from "react";
import { Play, Clock, MoreHorizontal, Music, Plus } from "lucide-react";
import { TSongResponse } from "@/types";
import { usePlayer } from "@/hooks/usePlayer";

interface PlaylistSongProps {
  songs?: TSongResponse[];
  allSongs?: TSongResponse[];
  onAddSong?: (song: TSongResponse) => void;
  onRemoveSong?: (songId: number) => void;
}

export default function PlaylistSong({
  songs = [],
  allSongs = [],
  onAddSong,
  onRemoveSong,
}: PlaylistSongProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();

  // Filter out songs that are already in the playlist for the Recommended section
  const recommendedSongs = allSongs.filter(
    (s) => !songs.some((ps) => ps.id === s.id)
  );

  return (
    <div className="mt-4 px-2 text-white">
      {/* Playlist Songs Table */}
      {songs.length > 0 ? (
        <div>
          <div className="grid grid-cols-[40px_1fr_80px] items-center px-4 py-2 border-b border-white/10 text-gray-400 text-sm font-medium">
            <span className="text-center">#</span>
            <span>Title</span>
            <span className="flex justify-end">
              <Clock className="w-4 h-4" />
            </span>
          </div>

          <div className="mt-1 space-y-1">
            {songs.map((song, index) => {
              const isCurrent = currentSong?.id === song.id;

              return (
                <div
                  key={song.id || index}
                  className={`group grid grid-cols-[40px_1fr_80px] items-center px-4 py-2.5 rounded-md transition-colors duration-150 cursor-pointer ${
                    isCurrent ? "bg-white/10" : "hover:bg-white/[0.07]"
                  }`}
                  onMouseEnter={() => setHoveredRow(song.id || index)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => {
                    if (isCurrent) {
                      togglePlay();
                    } else {
                      playSong(song);
                    }
                  }}
                >
                  {/* # / Play Icon */}
                  <div className="flex items-center justify-center w-6 h-6 mx-auto">
                    {hoveredRow === (song.id || index) ? (
                      <Play className="w-4 h-4 text-white fill-white" />
                    ) : isCurrent && isPlaying ? (
                      <Play className="w-4 h-4 text-green-500 fill-green-500 animate-pulse" />
                    ) : (
                      <span className="text-sm text-gray-400 font-medium">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Thumbnail + Title + Description */}
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <div className="w-10 h-10 rounded bg-[#282828] flex items-center justify-center shrink-0 overflow-hidden">
                      {song.thumbnailUrl ? (
                        <img
                          src={song.thumbnailUrl}
                          alt={song.name || "Song"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Music className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span
                        className={`text-sm font-semibold truncate ${
                          isCurrent ? "text-green-500" : "text-white"
                        }`}
                      >
                        {song.name || "Unknown Song"}
                      </span>
                      <span className="text-xs text-gray-400 truncate">
                        {song.description || song.type || "Artist"}
                      </span>
                    </div>
                  </div>

                  {/* Action / Duration */}
                  <div className="flex items-center justify-end gap-3">
                    <span className="text-xs text-gray-400 font-mono">
                      {song.duration || "3:30"}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (song.id && onRemoveSong) {
                          onRemoveSong(song.id);
                        }
                      }}
                      className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white"
                      title="Remove from playlist"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
          <Music className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-lg font-semibold text-white">Playlist này chưa có bài hát nào</p>
          <p className="text-xs text-gray-400 mt-1">Hãy thêm bài hát bên dưới để bắt đầu thưởng thức</p>
        </div>
      )}

      {/* Recommended Section (Image 2) */}
      <div className="mt-12 pt-8 border-t border-white/10">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">Recommended</h2>
          <p className="text-xs text-gray-400">Based on your listening</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendedSongs.slice(0, 6).map((song) => (
            <div
              key={song.id}
              className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-12 h-12 rounded bg-[#282828] flex items-center justify-center shrink-0 overflow-hidden">
                  {song.thumbnailUrl ? (
                    <img
                      src={song.thumbnailUrl}
                      alt={song.name || "Song"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Music className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-white truncate">
                    {song.name || "Unknown"}
                  </span>
                  <span className="text-xs text-gray-400 truncate">
                    {song.description || "Artist"}
                  </span>
                </div>
              </div>

              {onAddSong && (
                <button
                  onClick={() => onAddSong(song)}
                  className="border border-white/30 hover:border-white text-white hover:bg-white hover:text-black font-semibold text-xs px-4 py-1.5 rounded-full transition-all shrink-0"
                >
                  Add
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}