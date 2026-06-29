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
import { commonClassNames } from '@/constants';
import { ChevronLeft, ChevronRight, Edit, Trash2, Clock, Music, Video, Plus, Eye } from 'lucide-react';
import Image from 'next/image';

const mockSongs = [
    {
        id: 1,
        name: "Lạc Trôi",
        description: "Bản hit mang phong cách cổ trang kết hợp hiện đại",
        type: "VIDEO",
        thumbnailUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80",
        duration: "03:52"
    },
    {
        id: 2,
        name: "Nơi Này Có Anh",
        description: "Ca khúc lãng mạn dành cho ngày Valentine",
        type: "AUDIO",
        thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80",
        duration: "04:20"
    },
    {
        id: 3,
        name: "Chúng Ta Của Hiện Tại",
        description: "Bản tình ca hoài niệm về tình yêu thanh xuân",
        type: "VIDEO",
        thumbnailUrl: "https://images.unsplash.com/photo-1493225457124-a1a2a5f5646f?w=300&q=80",
        duration: "05:02"
    }
];

const TableSong = () => {

    return (
        <div className="bg-grayDarker rounded-xl shadow-sm border border-grayDark/30 overflow-hidden text-white">
            <Link
                href="/admin/songs/new"
                className="size-14 rounded-full bg-primary hover:bg-primary/90 flex justify-center items-center text-white fixed right-8 bottom-8 shadow-lg shadow-primary/30 transition-all hover:scale-110 z-50 group"
            >
                <Plus strokeWidth={2.5} className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
            </Link>

            <div className="p-5 border-b border-grayDark/20 flex justify-between items-center bg-grayDarkest/30">
                <h2 className="text-lg font-semibold text-white">Danh sách Bài hát</h2>
                <div className="text-sm text-grayDark">Tổng cộng: {mockSongs.length} bài hát</div>
            </div>

            <Table className="table-responsive w-full">
                <TableHeader className="bg-grayDarkest/50">
                    <TableRow className="hover:bg-transparent border-grayDark/20">
                        <TableHead className="font-semibold text-grayDark">Bài hát</TableHead>
                        <TableHead className="font-semibold text-grayDark">Định dạng</TableHead>
                        <TableHead className="font-semibold text-grayDark">Thời lượng</TableHead>
                        <TableHead className="font-semibold text-grayDark text-right pr-6">Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockSongs.map((song) => (
                        <TableRow key={song.id} className="border-grayDark/20 hover:bg-grayDarkest/40 transition-colors group">
                            <TableCell className="py-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative size-14 rounded-lg overflow-hidden shrink-0 shadow-sm border border-grayDark/30">
                                        <Image
                                            src={song.thumbnailUrl}
                                            alt={song.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-white line-clamp-1">{song.name}</span>
                                        <span className="text-sm text-grayDark line-clamp-1 max-w-[300px]">{song.description}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                {song.type === 'VIDEO' ? (
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium border border-secondary/20">
                                        <Video className="w-3.5 h-3.5" />
                                        Video
                                    </div>
                                ) : (
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                                        <Music className="w-3.5 h-3.5" />
                                        Audio
                                    </div>
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1.5 text-grayDark font-medium bg-grayDarkest/50 w-fit px-2.5 py-1 rounded-md text-sm border border-grayDark/10">
                                    <Clock className="w-4 h-4 text-grayDark" />
                                    {song.duration}
                                </div>
                            </TableCell>
                            <TableCell className="text-right pr-6">
                                <div className="flex items-center justify-end gap-2 group-hover:opacity-100 transition-opacity">
                                    <Link
                                        className={commonClassNames.action + " bg-grayDarkest shadow-sm hover:text-secondary hover:border-secondary/50 border-grayDark/20 text-grayDark"}
                                        title="Xem"
                                        href={`/admin/songs/view/${song.id}`}
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        className={commonClassNames.action + " bg-grayDarkest shadow-sm hover:text-secondary hover:border-secondary/50 border-grayDark/20 text-grayDark"}
                                        title="Chỉnh sửa"
                                        href={`/admin/songs/edit/${song.id}`}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        className={commonClassNames.action + " bg-grayDarkest shadow-sm hover:text-red-400 hover:border-red-500/50 border-grayDark/20 text-grayDark"}
                                        title="Xoá"
                                        href={`/admin/songs/delete/${song.id}`}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Link>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="p-4 border-t border-grayDark/20 flex justify-between items-center bg-grayDarkest/30">
                <div className="text-sm text-grayDark">
                    Hiển thị 1 đến 3 của 3 kết quả
                </div>
                <div className="flex gap-2">
                    <button className={commonClassNames.paginationButton + " bg-grayDarkest border-grayDark/20 text-grayDark disabled:opacity-50 disabled:cursor-not-allowed"} disabled>
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className={commonClassNames.paginationButton + " bg-grayDarkest border-grayDark/20 text-grayDark disabled:opacity-50 disabled:cursor-not-allowed"} disabled>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TableSong