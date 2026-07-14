"use client";
import React, { useCallback, useEffect, useState } from 'react'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from 'next/link'
import { Edit, Trash2, Clock, Eye, Music2, Disc3 } from 'lucide-react';
import Image from 'next/image';
import { TSongResponse } from '@/types';
import AdminFooter from '../AdminFooter';
import AdminHeader from '../AdminHeader';
import { Input } from '@/components/ui/input';
import { typeOfMusic } from '@/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import Spinner from '@/components/icons/IconSpinner';
import { SongService } from '@/services/SongService';

const LIMIT = 5;


const TableSong = () => {
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const searchParams = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";
    const [songs, setSongs] = useState<TSongResponse[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const fetchSongs = useCallback(async () => {
        try {
            const response = await SongService.getAllSongsPaginated({
                page,
                limit: LIMIT,
                search,
                type: type || undefined,
            });
            if (response.success && response.data) {
                setSongs(response.data.content);
                setTotalPages(response.data.totalPages);
                setTotalElements(response.data.totalElements);
            }
        } catch (error) {
            console.error('Error fetching songs:', error);
        } finally {
            setLoading(false);
        }
    }, [page, search, type]);

    useEffect(() => {
        fetchSongs();
    }, [fetchSongs]);

    const handleSearch = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set("search", value);
        } else {
            params.delete("search");
        }
        params.set("page", "1");
        router.push(`?${params.toString()}`);
    }

    const handleTypeFilter = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "ALL") {
            params.set("type", value);
        } else {
            params.delete("type");
        }
        params.set("page", "1");
        router.push(`?${params.toString()}`);
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-grayDarker rounded-xl border border-grayDark/20">
                <Spinner className="size-6 text-primary" />
                <p className="text-sm text-grayDark mt-3">Đang tải dữ liệu...</p>
            </div>
        )
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <AdminHeader
                    icon={Music2}
                    title="Quản lý bài hát"
                    description="Quản lý danh sách bài hát trong hệ thống"
                />
                <div className="flex gap-3">
                    <Input
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Tìm kiếm bài hát..."
                        className="w-[350px]"
                        defaultValue={searchParams.get("search") || ""}
                    />
                    <Select
                        onValueChange={(value) => handleTypeFilter(value)}
                        defaultValue={searchParams.get("type") || undefined}
                    >
                        <SelectTrigger className="w-[150px] z-10 dark:bg-grayDarker border border-gray-200 hover:border-primary/70 transition-all">
                            <SelectValue placeholder="Chọn định dạng" />
                        </SelectTrigger>
                        <SelectContent className="bg-grayDarker dark:bg-grayDarker w-full">
                            <SelectGroup>
                                <SelectLabel>Chọn định dạng</SelectLabel>
                                {typeOfMusic.map((item) => (
                                    <SelectItem key={item.value} value={item.value} className={item.className}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Link
                href="/admin/songs/create"
                className="z-10 size-10 rounded-full bg-primary flex justify-center items-center text-white fixed right-5 bottom-2 animate-bounce"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                    />
                </svg>
            </Link>
            <div className="bg-grayDarker rounded-xl shadow-lg shadow-black/10 border border-grayDark/20 overflow-hidden text-white">
                {/* Table Header Bar */}
                <div className="px-6 py-4 border-b border-grayDark/15 flex justify-between items-center bg-linear-to-r from-grayDarkest/40 to-transparent">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/15">
                            <Music2 className="w-4 h-4 text-sky-400" />
                        </div>
                        <h2 className="text-base font-semibold text-white">Danh sách Bài hát</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-grayDark bg-grayDarkest/60 px-3 py-1.5 rounded-full border border-grayDark/10">
                            {totalElements} bài hát
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
                            <TableRow key={song.id} className="border-grayDark/10 hover:bg-white/2 transition-colors group">
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
                                            href={`/admin/songs/update/${song.id}`}
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
                <AdminFooter
                    page={page}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    limit={LIMIT}
                />
            </div>
        </>
    )
}

export default TableSong