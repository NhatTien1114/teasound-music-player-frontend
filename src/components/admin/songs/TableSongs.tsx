"use client";


import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from 'next/link'
import { Edit, Clock, Disc3, Eye } from 'lucide-react';
import Image from 'next/image';
import slugify from 'slugify';
import { encodeId } from '@/utils/hashId';
import { TSongResponse } from '@/types';
import AdminFooter from '../AdminFooter';
import CatalogFilters from "../CatalogFilters";
import { useCatalogPage, pageSize } from "../useCatalogPage";

import { SongService } from '@/services/SongService';

const TableSong = () => {
    const { data, page, search, loading, filter, refresh, type } = useCatalogPage<TSongResponse>(SongService.getAllSongsPaginated);
    return (
        <>
            <CatalogFilters search={search} filter={filter} songs type={type} />
            {loading || !data || !data.content.length ? (
                <div className="studio-empty" role="status">
                    {loading ? "Đang tải dữ liệu…" : !data ? "Chưa tải được danh sách." : "Không có kết quả."}
                    {!loading && !data && <button onClick={refresh}>Thử lại</button>}
                </div>
            ) : (
            <div className="studio-panel overflow-hidden">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-grayDark/15 bg-grayDarkest/30">
                            <TableHead className="font-semibold text-grayDark text-xs uppercase tracking-wider pl-6">Bài hát</TableHead>
                            <TableHead className="font-semibold text-grayDark text-xs uppercase tracking-wider">Thể loại</TableHead>
                            <TableHead className="font-semibold text-grayDark text-xs uppercase tracking-wider">Thời lượng</TableHead>
                            <TableHead className="font-semibold text-grayDark text-xs uppercase tracking-wider text-right pr-6">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.content.map((song) => (
                            <TableRow key={song.id} className="border-grayDark/10 hover:bg-white/2 transition-colors group">
                                <TableCell className="py-4 pl-6">
                                    <div className="flex items-center gap-3.5">
                                        <div className="relative size-12 rounded-lg overflow-hidden shrink-0 ring-1 ring-grayDark/10 group-hover:ring-primary/30 transition-all">
                                            {song.thumbnailUrl ? <Image
                                                src={song.thumbnailUrl}
                                                alt={song.name ?? ""}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            /> : <Disc3 className="m-auto mt-3" />}
                                            {/* Play overlay */}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                                                <Disc3 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-white text-sm">{song.name}</span>
                                            <div className="flex items-center gap-1.5 text-xs text-grayDark/70 mt-0.5">
                                                {song.authorName && (
                                                    <span className="text-primary font-medium">{song.authorName}</span>
                                                )}
                                                {song.authorName && song.description && <span>•</span>}
                                                {song.description && (
                                                    <span className="line-clamp-1 max-w-[200px]">{song.description}</span>
                                                )}
                                            </div>
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
                                    <div className="flex items-center justify-end gap-1.5">
                                        <Link
                                            className="size-11 rounded-lg border border-grayDark/15 flex items-center justify-center text-grayDark hover:text-white"
                                            aria-label={`Xem bài hát ${song.name}`}
                                            href={`/song/${slugify(song.name || "bai-hat", { lower: true, strict: true }) || "bai-hat"}?id=${encodeId(song.id)}`}
                                        >
                                            <Eye size={16} />
                                        </Link>
                                        <Link
                                            className="size-11 rounded-lg border border-grayDark/15 bg-grayDarkest/50 flex items-center justify-center text-grayDark hover:text-amber-400 hover:border-amber-400/30 hover:bg-amber-400/5 transition-all"
                                            title="Chỉnh sửa"
                                            href={`/admin/songs/update/${song.id}`}
                                        >
                                            <Edit className="w-3.5 h-3.5" />
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
                    totalPages={data.totalPages}
                    totalElements={data.totalElements}
                    limit={pageSize}
                />
            </div>) }
        </>
    )
}

export default TableSong