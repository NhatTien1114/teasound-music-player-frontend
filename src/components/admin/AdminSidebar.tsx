"use client";

import {
  LayoutDashboard,
  Music,
  ListMusic,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

const sidebarItems = [
  { id: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { id: "/admin/playlists", icon: ListMusic, label: "Playlists" },
  { id: "/admin/songs", icon: Music, label: "Songs" },
  { id: "/admin/users", icon: Users, label: "Users" },
  { id: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col shrink-0 transition-all duration-300 ease-in-out border-r border-white/5 bg-[#0D0D0D]",
        isCollapsed ? "w-[80px] items-center" : "w-64 px-4 items-stretch"
      )}
    >
      {/* Top Header Area */}
      <div className={cn("flex items-center h-20 mb-4", isCollapsed ? "justify-center" : "justify-between w-full")}>
        {!isCollapsed && (
          <div className="flex-1 flex justify-center pl-1 animate-in fade-in duration-300">
            <button
              onClick={() => router.push("/admin")}
              className="cursor-pointer flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold text-white tracking-wide">Tea<span className="text-primary">Admin</span></span>
            </button>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-grayDark hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/5 shrink-0"
        >
          {isCollapsed ? (
             <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5">
                <span className="text-primary font-bold text-lg">T</span>
             </div>
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col gap-2 flex-1">
        <div className={cn("text-xs font-semibold text-grayDark uppercase tracking-wider mb-2", isCollapsed ? "hidden" : "block px-4")}>
           Menu
        </div>
        {sidebarItems.map((item) => {
          const isActive = pathname === item.id || pathname.startsWith(`${item.id}/`);
          // Exact match for dashboard
          const isReallyActive = item.id === '/admin' ? pathname === '/admin' : isActive;
          
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => router.push(item.id)}
              className={cn(
                "relative flex items-center h-12 rounded-xl transition-all duration-300 group overflow-hidden",
                isCollapsed ? "justify-center w-12 mx-auto" : "justify-start px-4 w-full",
                isReallyActive
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-grayDark hover:text-white hover:bg-white/5"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className="w-5 h-5 shrink-0"
                strokeWidth={isReallyActive ? 2.5 : 2}
              />

              <span
                className={cn(
                  "font-medium transition-all duration-300 whitespace-nowrap",
                  isCollapsed ? "opacity-0 w-0 translate-x-4 hidden" : "opacity-100 ml-4 translate-x-0"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom Area */}
      <div className="mb-6 mt-4">
          <button
              onClick={() => router.push("/")}
              className={cn(
                "relative flex items-center h-12 rounded-xl transition-all duration-300 group overflow-hidden text-red-400 hover:text-red-300 hover:bg-red-400/10",
                isCollapsed ? "justify-center w-12 mx-auto" : "justify-start px-4 w-full",
              )}
              title={isCollapsed ? "Exit Admin" : undefined}
            >
              <LogOut
                className="w-5 h-5 shrink-0"
                strokeWidth={2}
              />

              <span
                className={cn(
                  "font-medium transition-all duration-300 whitespace-nowrap",
                  isCollapsed ? "opacity-0 w-0 translate-x-4 hidden" : "opacity-100 ml-4 translate-x-0"
                )}
              >
                Exit Admin
              </span>
            </button>
      </div>
    </aside>
  );
}
