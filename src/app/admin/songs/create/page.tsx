"use client"
import React from 'react'
import { BreadCrumb } from '@/components/layouts/BreadCrumb'
import { ChevronRight, FilePlus2 } from 'lucide-react'
import AddNewSong from '@/components/admin/songs/AddNewSong'

const page = () => {
    return (
        <div className="space-y-6">
            <BreadCrumb
                item={[
                    { href: "/admin/songs", label: "Bài hát" },
                    { href: "/admin/songs/create", label: "Thêm mới" }
                ]}
                separetor={<ChevronRight className="w-3.5 h-3.5" />}
            />

            {/* Page Header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/20">
                    <FilePlus2 className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Thêm bài hát mới</h1>
                    <p className="text-sm text-grayDark mt-0.5">Điền thông tin bên dưới để thêm một bài hát mới</p>
                </div>
            </div>

            {/* Form */}
            <AddNewSong />
        </div>
    )
}

export default page