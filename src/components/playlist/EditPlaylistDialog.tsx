"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Music, Lock, Globe, Pencil } from "lucide-react";
import { TPlaylistResponse } from "@/types";

interface EditPlaylistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  playlist: TPlaylistResponse | null;
  onSave: (updatedData: { name: string; coverImage: string; isPublic: boolean }) => Promise<void>;
}

export default function EditPlaylistDialog({
  isOpen,
  onClose,
  playlist,
  onSave,
}: EditPlaylistDialogProps) {
  const [name, setName] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (playlist) {
      setName(playlist.name || "My Playlist");
      setCoverImage(playlist.coverImage || playlist.thumbnailUrl || "");
      setIsPublic(playlist.isPublic !== false);
    }
  }, [playlist, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await onSave({
        name: name.trim(),
        coverImage,
        isPublic,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-[#282828] text-white border-none p-6 rounded-xl shadow-2xl">
        <DialogHeader className="flex flex-row items-center justify-between pb-2">
          <DialogTitle className="text-xl font-bold text-white">
            Edit details
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Main Grid: Cover Image + Name Field */}
          <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
            {/* Left Column: Image Box */}
            <div className="relative group w-[180px] h-[180px] bg-[#181818] rounded-md overflow-hidden flex items-center justify-center border border-white/10 shadow-inner">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt="Playlist Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Music className="w-16 h-16 text-gray-500" />
              )}

              {/* Hover overlay for changing image */}
              <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-xs font-semibold text-white gap-2">
                <Pencil className="w-8 h-8" />
                <span>Choose photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Right Column: Name Field (Description removed as requested) */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-300">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Add a name"
                className="w-full bg-[#3e3e3e] text-white placeholder-gray-400 px-3 py-2.5 rounded-md border border-transparent focus:border-white/20 focus:outline-none text-sm font-medium"
                required
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className="flex items-center gap-2 border border-white/20 bg-black/30 hover:bg-black/50 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
            >
              {isPublic ? (
                <>
                  <Globe className="w-4 h-4" />
                  <span>Make private</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Make public</span>
                </>
              )}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-black font-bold px-7 py-2.5 rounded-full hover:bg-gray-200 transition-all text-sm shadow-md disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>

          {/* Disclaimer text */}
          <p className="text-[11px] text-gray-400 leading-tight pt-2 border-t border-white/10">
            By proceeding, you agree to give TeaSound access to the image you choose to upload. Please make sure you have the right to upload the image.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
