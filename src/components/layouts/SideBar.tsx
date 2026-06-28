"use client";

import {
  Home,
  Music2,
  Users,
  MonitorPlay,
  SlidersHorizontal,
  ChevronsRight,
  ChevronsLeft,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserService } from "@/services/UserService";

const sidebarItems = [
  { id: "home", icon: Home, label: "Home" },
  { id: "music", icon: Music2, label: "Music" },
  { id: "artists", icon: Users, label: "Artists" },
  { id: "videos", icon: MonitorPlay, label: "Videos" },
  { id: "equalizer", icon: SlidersHorizontal, label: "Equalizer" },
];

export default function SideBar() {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState("home");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<{ username?: string, avatar?: string, plan?: string } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userProfile = await UserService.getCurrentUser();

        if (userProfile && userProfile.authenticated) {
          setIsLoggedIn(true);
          setUserData({
            username: userProfile.name || userProfile.email || "Tea User",
            plan: userProfile.role === 'ADMIN' ? 'Quản trị viên' : (userProfile.role ? 'Người dùng' : 'Khách'),
            avatar: userProfile.avatarUrl
          });
        } else {
          setIsLoggedIn(false);
          setUserData(null);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setUserData(null);
      }
    };
    checkAuth();
    window.addEventListener("auth-change", checkAuth);
    return () => window.removeEventListener("auth-change", checkAuth);
  }, []);

  return (
    <aside
      className={cn(
        "flex flex-col shrink-0 transition-all duration-300 ease-in-out border-r border-white/5",
        isCollapsed ? "w-[72px] items-center" : "w-64 px-4 items-stretch"
      )}
    >
      {/* Top Header Area */}
      <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-between w-full")}>
        {!isCollapsed && (
          <div className="flex-1 flex justify-center pl-1 animate-in fade-in duration-300">
            <button
              onClick={() => router.push("/")}
              className="cursor-pointer"
            >
              <Image
                src="/TeaSound.png"
                alt="Logo"
                width={200}
                height={50}
                className="w-40 h-auto object-contain drop-shadow-md"
              />
            </button>

          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-grayDark hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/5 shrink-0"
        >
          {isCollapsed ? (
            <ChevronsRight className="w-5 h-5 mb-5 mt-5" />
          ) : (
            <ChevronsLeft className="w-5 h-5 mb-5 mt-5" />
          )}
        </button>
      </div>

      {/* User avatar / Login */}
      <div className={cn("flex mb-8", isCollapsed ? "justify-center" : "justify-start px-2")}>
        {isLoggedIn ? (
          <>
            <button
              onClick={() => router.push("/profile")}
              className="w-10 h-10 rounded-full bg-secondary/80 flex items-center justify-center hover:bg-secondary transition-colors duration-200 shadow-md shadow-secondary/20 shrink-0 overflow-hidden">
              {userData?.avatar ? (
                <Image src={userData.avatar} alt="Avatar" width={40} height={40} className="object-cover w-full h-full" />
              ) : (
                <span className="text-sm text-white font-medium uppercase">
                  {userData?.username ? userData.username.charAt(0) : "T"}
                </span>
              )}
            </button>
            {!isCollapsed && (
              <div className="ml-3 flex flex-col justify-center overflow-hidden whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                <span className="text-sm text-white font-medium">{userData?.username || "Người dùng"}</span>
                <span className="text-xs text-grayDark">{userData?.plan || "Khách"}</span>
              </div>
            )}
          </>
        ) : (
          <>
            <button
              onClick={() => router.push("/sign-in")}
              className="w-10 h-10 rounded-full bg-grayDarker flex items-center justify-center hover:bg-white/10 transition-colors duration-200 shrink-0">
              <User className="w-5 h-5 text-grayDark" />
            </button>
            {!isCollapsed && (
              <div className="ml-3 flex flex-col justify-center overflow-hidden whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                <span
                  onClick={() => router.push("/sign-in")}
                  className="text-sm text-white font-medium cursor-pointer hover:text-secondary transition-colors"
                >
                  Đăng nhập
                </span>
                <span className="text-xs text-grayDark">Khách</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col gap-2">
        {sidebarItems.map((item) => {
          const isActive = activeItem === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={cn(
                "relative flex items-center h-12 rounded-xl transition-all duration-300 group overflow-hidden",
                isCollapsed ? "justify-center w-12 mx-auto" : "justify-start px-4 w-full",
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-grayDark hover:text-white hover:bg-white/5"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className="w-5 h-5 shrink-0"
                strokeWidth={isActive ? 2.5 : 1.5}
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
    </aside>
  );
}