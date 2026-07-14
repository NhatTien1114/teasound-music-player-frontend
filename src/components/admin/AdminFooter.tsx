"use client"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type AdminFooterProps = {
    page: number,
    totalPages: number,
    totalElements: number,
    limit: number,
}

const AdminFooter = ({ page, totalPages, totalElements, limit }: AdminFooterProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const from = totalElements === 0 ? 0 : (page - 1) * limit + 1;
    const to = Math.min(page * limit, totalElements);

    const navigateToPage = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    }

    return (
        <div className="px-6 py-3.5 border-t border-grayDark/15 flex justify-between items-center bg-grayDarkest/20">
            <div className="text-xs text-grayDark">
                Hiển thị <span className="text-white font-medium">{from}</span> đến <span className="text-white font-medium">{to}</span> của <span className="text-white font-medium">{totalElements}</span> kết quả
            </div>
            <div className="flex items-center gap-1.5">
                {/* Page number buttons */}
                {totalPages > 1 && (
                    <>
                        <button
                            className="size-8 rounded-lg border border-grayDark/15 bg-grayDarkest/50 flex items-center justify-center text-grayDark cursor-pointer hover:border-primary/30 hover:text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-grayDark/15 disabled:hover:text-grayDark"
                            disabled={page <= 1}
                            onClick={() => navigateToPage(page - 1)}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => {
                                // Show first, last, current and neighbors
                                if (p === 1 || p === totalPages) return true;
                                if (Math.abs(p - page) <= 1) return true;
                                return false;
                            })
                            .reduce<(number | string)[]>((acc, p, idx, arr) => {
                                if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                                    acc.push("...");
                                }
                                acc.push(p);
                                return acc;
                            }, [])
                            .map((item, idx) =>
                                typeof item === "string" ? (
                                    <span key={`ellipsis-${idx}`} className="size-8 flex items-center justify-center text-grayDark text-xs">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={item}
                                        onClick={() => navigateToPage(item)}
                                        className={`size-8 rounded-lg border flex items-center justify-center text-xs font-medium cursor-pointer transition-all ${
                                            item === page
                                                ? "border-primary/50 bg-primary/15 text-primary"
                                                : "border-grayDark/15 bg-grayDarkest/50 text-grayDark hover:border-primary/30 hover:text-primary"
                                        }`}
                                    >
                                        {item}
                                    </button>
                                )
                            )}
                        <button
                            className="size-8 rounded-lg border border-grayDark/15 bg-grayDarkest/50 flex items-center justify-center text-grayDark cursor-pointer hover:border-primary/30 hover:text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-grayDark/15 disabled:hover:text-grayDark"
                            disabled={page >= totalPages}
                            onClick={() => navigateToPage(page + 1)}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default AdminFooter