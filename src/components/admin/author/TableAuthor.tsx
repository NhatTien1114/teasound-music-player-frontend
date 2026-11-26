"use client";
import { useState } from 'react'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from 'next/link'
import { Edit, Trash2, UserCircle } from 'lucide-react';
import Image from 'next/image';
import { TAuthorResponse } from '@/types';
import AdminFooter from '../AdminFooter';
import CatalogFilters from "../CatalogFilters";
import { useCatalogPage, pageSize } from "../useCatalogPage";

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
import { AuthorService } from '@/services/AuthorService';

const TableAuthor = () => {
    const { data, page, search, loading, filter, refresh } = useCatalogPage<TAuthorResponse>(AuthorService.getAllAuthorsPaginated);
    const [authorToDelete, setAuthorToDelete] = useState<TAuthorResponse | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAuthor = async () => {
        if (!authorToDelete || !authorToDelete.id) return;
        setIsDeleting(true);
        try {
            const res = await AuthorService.deleteAuthor({ id: authorToDelete.id });
            if (res.success) {
                toast.success(res.message || "Xóa tác giả thành công");
                setAuthorToDelete(null);
                refresh();
            } else {
                toast.error(res.message || "Xóa tác giả thất bại");
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa tác giả");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <CatalogFilters search={search} filter={filter} />
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
                            <TableHead className="font-semibold text-grayDark text-xs uppercase tracking-wider pl-6">Tác giả</TableHead>
                            <TableHead className="font-semibold text-grayDark text-xs uppercase tracking-wider">Tiểu sử</TableHead>
                            <TableHead className="font-semibold text-grayDark text-xs uppercase tracking-wider text-right pr-6">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.content.map((author) => (
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
                                    <div className="flex items-center justify-end gap-1.5">
                                        <Link
                                            className="size-11 rounded-lg border border-grayDark/15 bg-grayDarkest/50 flex items-center justify-center text-grayDark hover:text-amber-400 hover:border-amber-400/30 hover:bg-amber-400/5 transition-all"
                                            title="Chỉnh sửa"
                                            href={`/admin/authors/update/${author.id}`}
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                        </Link>
                                        <button
                                            type="button"
                                            className="size-11 rounded-lg border border-grayDark/15 bg-grayDarkest/50 flex items-center justify-center text-grayDark hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/5 transition-all cursor-pointer"
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
                    totalPages={data.totalPages}
                    totalElements={data.totalElements}
                    limit={pageSize}
                />
            </div>) }

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