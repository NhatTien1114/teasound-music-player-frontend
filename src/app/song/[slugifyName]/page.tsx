"use client";

import SongLyricView from "@/components/song/SongLyricView";
import { Suspense } from "react";

export default function SongLyricPage() {
    return (
        <Suspense
            fallback={
                <div className="fixed inset-0 bg-grayDarkest flex items-center justify-center z-50">
                    <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
            }
        >
            <SongLyricView />
        </Suspense>
    );
}