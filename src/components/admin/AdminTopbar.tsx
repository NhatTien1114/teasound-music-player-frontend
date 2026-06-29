"use client";

import { Bell, Search } from "lucide-react";
import Image from "next/image";

export default function AdminTopbar() {
  return (
    <header className="h-20 w-full flex items-center justify-between px-6 border-b border-white/5 bg-[#0D0D0D]">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grayDark group-focus-within:text-primary transition-colors duration-300" />
          <input
            type="text"
            placeholder="Search playlists, users, songs..."
            className="w-full h-12 bg-white/5 border border-white/10 rounded-full pl-12 pr-6 text-sm text-white placeholder:text-grayDark focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-300"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 pl-6">
        <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors duration-200">
          <Bell className="w-5 h-5 text-grayDark hover:text-white transition-colors" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-[#0D0D0D]"></span>
        </button>

        <div className="h-8 w-[1px] bg-white/10 mx-2"></div>

        <div className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-1.5 rounded-full pr-4 transition-colors duration-200">
          <div className="w-9 h-9 rounded-full bg-secondary overflow-hidden">
            {/* Fallback to T if no image */}
            <div className="w-full h-full flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white leading-tight">Admin User</span>
            <span className="text-xs text-primary leading-tight mt-0.5">Superadmin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
