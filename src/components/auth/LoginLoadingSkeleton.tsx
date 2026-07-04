"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loading screen shown after login while checking user role.
 * Mimics the dashboard layout with animated skeleton placeholders (shadcn/ui).
 */
export default function LoginLoadingSkeleton() {
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-grayDarkest relative">
            {/* Ambient glow effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Skeleton TopBar */}
            <header className="flex items-center gap-4 px-6 py-4 relative z-10">
                <div className="flex items-center gap-1">
                    <Skeleton className="w-9 h-9 rounded-full bg-white/5" />
                    <Skeleton className="w-9 h-9 rounded-full bg-white/5" />
                </div>
                <div className="flex-1 flex justify-center">
                    <Skeleton className="w-10 h-10 rounded-lg bg-white/5" />
                </div>
                <Skeleton className="w-96 h-10 rounded-full bg-white/5" />
            </header>

            <div className="flex flex-1 overflow-hidden relative z-10">
                {/* Skeleton Sidebar */}
                <aside className="flex flex-col w-[72px] items-center shrink-0 border-r border-white/5 py-4 gap-4">
                    <Skeleton className="w-5 h-5 rounded bg-white/5 mb-2" />
                    <Skeleton className="w-10 h-10 rounded-full bg-white/8 mb-6" />
                    {[...Array(5)].map((_, i) => (
                        <Skeleton
                            key={i}
                            className="w-12 h-12 rounded-xl bg-white/5"
                            style={{ animationDelay: `${i * 0.15}s` }}
                        />
                    ))}
                </aside>

                {/* Skeleton Main Content Area */}
                <div className="flex flex-col flex-1 overflow-hidden my-2 mr-2 rounded-2xl bg-white/2 border border-white/5 p-6">
                    {/* Section title skeleton */}
                    <Skeleton className="w-48 h-7 rounded-lg bg-white/5 mb-6" />

                    {/* Card grid skeleton */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex flex-col gap-3">
                                <Skeleton
                                    className="aspect-square rounded-xl bg-white/5"
                                    style={{ animationDelay: `${i * 0.2}s` }}
                                />
                                <Skeleton
                                    className="w-3/4 h-4 rounded bg-white/5"
                                    style={{ animationDelay: `${i * 0.2}s` }}
                                />
                                <Skeleton
                                    className="w-1/2 h-3 rounded bg-white/3"
                                    style={{ animationDelay: `${i * 0.2}s` }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Second section */}
                    <Skeleton className="w-56 h-7 rounded-lg bg-white/5 mb-6" />

                    {/* List skeleton */}
                    <div className="flex flex-col gap-3">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 p-3 rounded-xl bg-white/2"
                            >
                                <Skeleton
                                    className="w-12 h-12 rounded-lg bg-white/5 shrink-0"
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                />
                                <div className="flex-1 flex flex-col gap-2">
                                    <Skeleton
                                        className="w-2/5 h-4 rounded bg-white/5"
                                        style={{ animationDelay: `${i * 0.15}s` }}
                                    />
                                    <Skeleton
                                        className="w-1/4 h-3 rounded bg-white/3"
                                        style={{ animationDelay: `${i * 0.15}s` }}
                                    />
                                </div>
                                <Skeleton
                                    className="w-12 h-3 rounded bg-white/3"
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Loading indicator */}
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 mt-8">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-primary animate-spin" />
                        </div>
                        <p className="text-sm text-white/40 animate-pulse">
                            Đang tải dữ liệu...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
