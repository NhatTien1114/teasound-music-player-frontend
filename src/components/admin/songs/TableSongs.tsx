"use client";
import React from 'react'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Edit, Trash2, Clock, Music, Video, Eye, Music2, Disc3 } from 'lucide-react';
import Image from 'next/image';
import { TSongResponse } from '@/types';

const TableSong = ({ songs }: { songs: TSongResponse[] }) => {

    return (
        <div className="bg-grayDarker rounded-xl shadow-lg shadow-black/10 border border-grayDark/20 overflow-hidden text-white">
            {/* Table Header Bar */}
            <div className="px-6 py-4 border-b border-grayDark/15 flex justify-between items-center bg-gradient-to-r from-grayDarkest/40 to-transparent">
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/15">
                        <Music2 className="w-4 h-4 text-sky-400" />
                    </div>
                    <h2 className="text-base font-semibold text-white">Danh sách Bài hát</h2>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-grayDark bg-grayDarkest/60 px-3 py-1.5 rounded-full border border-grayDark/10">
                        {songs.length} bài hát
                    </span>
                </div>
            </div>

            <Table className="w-full">
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-grayDark/15 bg-grayDarkest/30">
                        <TableHead className="font-semibold text-grayDark text-xs uppercase tracking-wider pl-6">Bài hát</TableHead>
                        <TableHead className="font-semibold text-grayDark text-xs uppercase tracking-wider">Định dạng</TableHead>
                        <TableHead className="font-semibold text-grayDark text-xs uppercase tracking-wider">Thời lượng</TableHead>
                        <TableHead className="font-semibold text-grayDark text-xs uppercase tracking-wider text-right pr-6">Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {songs.map((song) => (
                        <TableRow key={song.id} className="border-grayDark/10 hover:bg-white/[0.02] transition-colors group">
                            <TableCell className="py-4 pl-6">
                                <div className="flex items-center gap-3.5">
                                    <div className="relative size-12 rounded-lg overflow-hidden shrink-0 ring-1 ring-grayDark/10 group-hover:ring-primary/30 transition-all">
                                        <Image
                                            src={song.thumbnailUrl ?? ""}
                                            alt={song.name ?? ""}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        {/* Play overlay */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                                            <Disc3 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-white text-sm">{song.name}</span>
                                        <span className="text-xs text-grayDark/70 line-clamp-1 max-w-[280px] mt-0.5">{song.description}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-medium border border-violet-500/15">
                                    <span>{song.type?.toString()}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1.5 text-grayDark/80 text-sm">
                                    <Clock className="w-3.5 h-3.5" />
                                    {song.duration}
                                </div>
                            </TableCell>
                            <TableCell className="text-right pr-6">
                                <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <Link
                                        className="size-8 rounded-lg border border-grayDark/15 bg-grayDarkest/50 flex items-center justify-center text-grayDark hover:text-sky-400 hover:border-sky-400/30 hover:bg-sky-400/5 transition-all"
                                        title="Xem"
                                        href={`/admin/songs/view/${song.id}`}
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                    </Link>
                                    <Link
                                        className="size-8 rounded-lg border border-grayDark/15 bg-grayDarkest/50 flex items-center justify-center text-grayDark hover:text-amber-400 hover:border-amber-400/30 hover:bg-amber-400/5 transition-all"
                                        title="Chỉnh sửa"
                                        href={`/admin/songs/edit/${song.id}`}
                                    >
                                        <Edit className="w-3.5 h-3.5" />
                                    </Link>
                                    <Link
                                        className="size-8 rounded-lg border border-grayDark/15 bg-grayDarkest/50 flex items-center justify-center text-grayDark hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/5 transition-all"
                                        title="Xoá"
                                        href={`/admin/songs/delete/${song.id}`}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination Footer */}
            <div className="px-6 py-3.5 border-t border-grayDark/15 flex justify-between items-center bg-grayDarkest/20">
                <div className="text-xs text-grayDark">
                    Hiển thị <span className="text-white font-medium">1</span> đến <span className="text-white font-medium">{songs.length}</span> của <span className="text-white font-medium">{songs.length}</span> kết quả
                </div>
                <div className="flex gap-1.5">
                    <button className="size-8 rounded-lg border border-grayDark/15 bg-grayDarkest/50 flex items-center justify-center text-grayDark disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary/30 hover:text-primary transition-all" disabled>
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="size-8 rounded-lg border border-grayDark/15 bg-grayDarkest/50 flex items-center justify-center text-grayDark disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary/30 hover:text-primary transition-all" disabled>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TableSong