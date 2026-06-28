"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SearchInput from "@/components/ui/SearchInput";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TopBar() {
  const router = useRouter();
  return (
    <header className="flex justify-center items-center gap-4 px-6 py-4">

      {/* Navigation arrows */}
      <div className="absolute left-5 flex items-center gap-1 shrink-0">
        <button className="p-2 rounded-full hover:bg-white/5 text-white/70 hover:text-white transition-colors duration-200">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-white/5 text-white/70 hover:text-white transition-colors duration-200">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Logo - vinyl record style */}
      <Image
        src="https://i.pinimg.com/736x/d1/a2/a5/d1a2a5cd94d4741fc79d5350ed1b7e39.jpg"
        alt="TeaSound Logo"
        width={40}
        height={20}
        className={"rounded-lg"}
        onClick={() => router.push("/")}
      />

      {/* Search bar */}
      <SearchInput className="w-96" />
    </header>
  );
}
