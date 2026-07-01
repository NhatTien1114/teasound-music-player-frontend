"use client"
import AddNewAuthor from '@/components/admin/author/AddNewAuthor'
import { BreadCrumb } from '@/components/layouts/BreadCrumb'
import { ChevronRight, UserPlus } from 'lucide-react'
import React from 'react'

const page = () => {
    return (
        <div className="space-y-6">
            <BreadCrumb
                item={[
                    { href: "/admin/authors", label: "Tác giả" },
                    { href: "/admin/authors/create", label: "Thêm mới" }
                ]}
                separetor={<ChevronRight className="w-3.5 h-3.5" />}
            />

            {/* Page Header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/20">
                    <UserPlus className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Thêm tác giả mới</h1>
                    <p className="text-sm text-grayDark mt-0.5">Điền thông tin bên dưới để tạo một tác giả mới</p>
                </div>
            </div>

            {/* Form */}
            <AddNewAuthor />
        </div>
    )
}

export default page