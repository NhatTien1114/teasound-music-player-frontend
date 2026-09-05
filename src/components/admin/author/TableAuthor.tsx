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
import Link from 'next/link'
import { Edit, Trash2, Eye, Users, UserCircle } from 'lucide-react';
import Image from 'next/image';
import { TAuthorResponse } from '@/types';
import Spinner from '@/components/icons/IconSpinner';
import AdminFooter from '../AdminFooter';
import AdminHeader from '../AdminHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthorService } from '@/services/AuthorService';

const TableAuthor = () => {
    const [authors, setAuthors] = useState<TAuthorResponse[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [authorToDelete, setAuthorToDelete] = useState<TAuthorResponse | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const page = Number(searchParams.get("page") || 1);
    const search = searchParams.get("search") || "";
    const LIMIT = 5;

    const fetchAuthors = useCallback(async () => {
        try {
            const response = await AuthorService.getAllAuthorsPaginated({
                page,
                limit: LIMIT,
                search,
            });
            if (response.success && response.data) {
                setAuthors(response.data.content);
                setTotalPages(response.data.totalPages);
                setTotalElements(response.data.totalElements);
            }
        } catch (error) {
            console.error('Error fetching authors:', error);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    const handleDeleteAuthor = async () => {
        if (!authorToDelete || !authorToDelete.id) return;
        setIsDeleting(true);
        try {
            const res = await AuthorService.deleteAuthor({ id: authorToDelete.id });
            if (res.success) {
                toast.success(res.message || "Xóa tác giả thành công");
                setAuthorToDelete(null);
                fetchAuthors();
            } else {
                toast.error(res.message || "Xóa tác giả thất bại");
            }
        } catch (error: any) {
            toast.error(error.message || "Có lỗi xảy ra khi xóa tác giả");
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        fetchAuthors();
    }, [fetchAuthors]);

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
        <>
            <div className="flex items-center justify-between">
                {/* Table Header Bar */}
                <AdminHeader
                    icon={Users}
                    title='Quản lý tác giả'
                    description='Quản lý danh sách tác giả trong hệ thống'
                />
                <div className="flex gap-3">
                    <Input
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Tìm kiếm tác giả..."
                        className="w-[350px]"
                        defaultValue={searchParams.get("search") || ""}
                    />
                </div>
            </div>
            <div className="bg-grayDarker rounded-xl shadow-lg shadow-black/10 border border-grayDark/20 overflow-hidden text-white">

                <Table className="w-full">
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-grayDark/15 bg-grayDarkest/30">
                            <TableHead className="font-semibold text-grayDark text-xs uppercase tracking-wider pl-6">Tác giả</TableHead>
                            <TableHead className="font-semibold text-grayDark text-xs uppercase tracking-wider">Tiểu sử</TableHead>
                            <TableHead className="font-semibold text-grayDark text-xs uppercase tracking-wider text-right pr-6">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {authors.map((author, _) => (
                            <TableRow
                                key={author.id}
                                className="border-grayDark/10 hover:bg-white/2 transition-colors group"
                            >
                                <TableCell className="py-4 pl-6">
                                    <div className="flex items-center gap-3.5">
                                        <div className="relative size-11 rounded-full overflow-hidden shrink-0 ring-2 ring-grayDark/10 group-hover:ring-primary/30 transition-all">
                                            {author.avatar ? (
                                                <Image
                                                    src={author.avatar.toString()}
                                                    alt={author.name ?? ""}
                                                    fill
                                                    unoptimized
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-linear-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center">
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
                                            className="size-8 rounded-lg border border-grayDark/15 bg-grayDarkest/50 flex items-center justify-center text-grayDark hover:text-amber-400 hover:border-amber-400/30 hover:bg-amber-400/5 transition-all"
                                            title="Chỉnh sửa"
                                            href={`/admin/authors/update/${author.id}`}
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                        </Link>
                                        <button
                                            type="button"
                                            className="size-8 rounded-lg border border-grayDark/15 bg-grayDarkest/50 flex items-center justify-center text-grayDark hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/5 transition-all cursor-pointer"
                                            title="Xoá"
                                            onClick={() => setAuthorToDelete(author)}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
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

            {/* Delete Confirmation Modal */}
            <Dialog open={!!authorToDelete} onOpenChange={(open) => !open && setAuthorToDelete(null)}>
                <DialogContent className="bg-grayDarker border-grayDark/20 text-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-white flex items-center gap-2.5">
                            <div className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                                <Trash2 className="w-5 h-5" />
                            </div>
                            Xác nhận xóa tác giả
                        </DialogTitle>
                        <DialogDescription className="text-grayDark mt-2 space-y-2 text-sm">
                            <span>
                                Bạn có chắc chắn muốn xóa tác giả <strong className="text-white font-semibold">{authorToDelete?.name}</strong>?
                            </span>
                            <span className="text-xs text-amber-400/90 block p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                Lưu ý: Hành động này không thể hoàn tác. Không thể xóa nếu tác giả đang có bài hát trong hệ thống.
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2 sm:gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="text-grayDark hover:text-white border-grayDark/20"
                            onClick={() => setAuthorToDelete(null)}
                            disabled={isDeleting}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700 text-white gap-2"
                            isLoading={isDeleting}
                            onClick={handleDeleteAuthor}
                            disabled={isDeleting}
                        >
                            Xác nhận xóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default TableAuthor