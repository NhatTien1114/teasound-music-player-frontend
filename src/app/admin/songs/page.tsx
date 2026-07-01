"use client"
import React, { useEffect, useState } from 'react'
import { BreadCrumb } from '@/components/layouts/BreadCrumb'
import { Button } from '@/components/ui/button'
import { ChevronRight, Music2, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import TableSong from '@/components/admin/songs/TableSongs'
import { TSongResponse } from '@/types'
import { SongService } from '@/services/SongService'

const page = () => {
    const [songs, SetSongs] = useState<TSongResponse[]>([]);
    useEffect(() => {
        const getList = async () => {
            try {
                const response = await SongService.getAllSongs();
                if (response.success) {
                    SetSongs(response.data || []);
                }
            } catch (error) {
                console.error('Error fetching songs:', error);
            }
        }
        getList();
    }, [songs])
    return (
        <div className="space-y-6">
            <BreadCrumb
                item={[
                    { href: "/admin/songs", label: "Bài hát" }
                ]}
                separetor={<ChevronRight className="w-3.5 h-3.5" />}
            />

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-600/20 border border-sky-500/20">
                        <Music2 className="w-6 h-6 text-sky-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Quản lý bài hát</h1>
                        <p className="text-sm text-grayDark mt-0.5">Quản lý danh sách bài hát trong hệ thống</p>
                    </div>
                </div>
                <Link href="/admin/songs/create">
                    <Button className="text-white bg-primary hover:bg-primary/90 cursor-pointer gap-2 shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]">
                        <PlusIcon className="w-4 h-4" />
                        Thêm bài hát
                    </Button>
                </Link>
            </div>

            {/* Table */}
            <TableSong
                songs={songs}
            />
        </div>
    )
}

export default page