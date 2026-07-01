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
import { ChevronLeft, ChevronRight, Edit, Trash2, Eye, Users, UserCircle } from 'lucide-react';
import Image from 'next/image';
import { TAuthorResponse } from '@/types';
import Spinner from '@/components/icons/IconSpinner';

const TableAuthor = ({ authors, loading }: { authors: TAuthorResponse[], loading: boolean }) => {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-grayDarker rounded-xl border border-grayDark/20">
                <Spinner className="size-6 text-primary" />
                <p className="text-sm text-grayDark mt-3">Đang tải dữ liệu...</p>
            </div>
        )
    }

    if (authors.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-grayDarker rounded-xl border border-grayDark/20">
                <div className="p-4 rounded-full bg-grayDarkest/50 mb-4">
                    <Users className="w-8 h-8 text-grayDark/50" />
                </div>
                <p className="text-grayDark font-medium">Chưa có tác giả nào</p>
                <p className="text-sm text-grayDark/60 mt-1">Hãy thêm tác giả đầu tiên của bạn</p>
                <Link
                    href="/admin/authors/create"
                    className="mt-4 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-all hover:scale-[1.02]"
                >
                    Thêm tác giả
                </Link>
            </div>
        )
    }

    return (
        <div className="bg-grayDarker rounded-xl shadow-lg shadow-black/10 border border-grayDark/20 overflow-hidden text-white">
            {/* Table Header Bar */}
            <div className="px-6 py-4 border-b border-grayDark/15 flex justify-between items-center bg-gradient-to-r from-grayDarkest/40 to-transparent">
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-violet-500/10 border border-violet-500/15">
                        <Users className="w-4 h-4 text-violet-400" />
                    </div>
                    <h2 className="text-base font-semibold text-white">Danh sách Tác giả</h2>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-grayDark bg-grayDarkest/60 px-3 py-1.5 rounded-full border border-grayDark/10">
                        {authors.length} tác giả
                    </span>
                </div>
            </div>

            <Table className="w-full">
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-grayDark/15 bg-grayDarkest/30">
                        <TableHead className="font-semibold text-grayDark text-xs uppercase tracking-wider pl-6">Tác giả</TableHead>
                        <TableHead className="font-semibold text-grayDark text-xs uppercase tracking-wider">Tiểu sử</TableHead>
                        <TableHead className="font-semibold text-grayDark text-xs uppercase tracking-wider text-right pr-6">Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {authors.map((author, index) => (
                        <TableRow
                            key={author.id}
                            className="border-grayDark/10 hover:bg-white/[0.02] transition-colors group"
                        >
                            <TableCell className="py-4 pl-6">
                                <div className="flex items-center gap-3.5">
                                    <div className="relative size-11 rounded-full overflow-hidden shrink-0 ring-2 ring-grayDark/10 group-hover:ring-primary/30 transition-all">
                                        {author.avatar ? (
                                            <Image
                                                src={author.avatar.toString()}
                                                alt={author.name ?? ""}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center">
                                                <UserCircle className="w-6 h-6 text-violet-400/60" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-white text-sm">{author.name}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <p className="text-sm text-grayDark/80 line-clamp-2 max-w-[350px] leading-relaxed">
                                    {author.bio || "Chưa có tiểu sử"}
                                </p>
                            </TableCell>
                            <TableCell className="text-right pr-6">
                                <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <Link
                                        className="size-8 rounded-lg border border-grayDark/15 bg-grayDarkest/50 flex items-center justify-center text-grayDark hover:text-sky-400 hover:border-sky-400/30 hover:bg-sky-400/5 transition-all"
                                        title="Xem"
                                        href={`/admin/authors/view/${author.id}`}
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                    </Link>
                                    <Link
                                        className="size-8 rounded-lg border border-grayDark/15 bg-grayDarkest/50 flex items-center justify-center text-grayDark hover:text-amber-400 hover:border-amber-400/30 hover:bg-amber-400/5 transition-all"
                                        title="Chỉnh sửa"
                                        href={`/admin/authors/edit/${author.id}`}
                                    >
                                        <Edit className="w-3.5 h-3.5" />
                                    </Link>
                                    <Link
                                        className="size-8 rounded-lg border border-grayDark/15 bg-grayDarkest/50 flex items-center justify-center text-grayDark hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/5 transition-all"
                                        title="Xoá"
                                        href={`/admin/authors/delete/${author.id}`}
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
                    Hiển thị <span className="text-white font-medium">1</span> đến <span className="text-white font-medium">{authors.length}</span> của <span className="text-white font-medium">{authors.length}</span> kết quả
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

export default TableAuthor