"use client"
import TableAuthor from '@/components/admin/author/TableAuthor'
import { BreadCrumb } from '@/components/layouts/BreadCrumb'
import { Button } from '@/components/ui/button'
import { ChevronRight, PlusIcon, Users } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { TAuthorResponse } from '@/types'
import { AuthorService } from '@/services/AuthorService'

const page = () => {
    const [authors, setAuthors] = useState<TAuthorResponse[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const res = await AuthorService.getAllAuthors();
                if (res.success && res.data) {
                    setAuthors(res.data);
                }
            } catch (error) {
                console.error("Error fetching authors:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAuthors();
    }, []);

    return (
        <div className="space-y-6">
            <BreadCrumb
                item={[
                    { href: "/admin/authors", label: "Tác giả" }
                ]}
                separetor={<ChevronRight className="w-3.5 h-3.5" />}
            />

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/20">
                        <Users className="w-6 h-6 text-violet-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Quản lý tác giả</h1>
                        <p className="text-sm text-grayDark mt-0.5">Quản lý danh sách nghệ sĩ và tác giả trong hệ thống</p>
                    </div>
                </div>
                <Link href="/admin/authors/create">
                    <Button className="text-white bg-primary hover:bg-primary/90 cursor-pointer gap-2 shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]">
                        <PlusIcon className="w-4 h-4" />
                        Thêm tác giả
                    </Button>
                </Link>
            </div>

            {/* Table */}
            <TableAuthor
                authors={authors}
                loading={loading}
            />
        </div>
    )
}

export default page