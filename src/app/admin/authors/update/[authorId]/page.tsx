import UpdateAuthor from '@/components/admin/author/UpdateAuthor';
import { BreadCrumb } from '@/components/layouts/BreadCrumb';
import { ChevronRight, FilePlus2 } from 'lucide-react';
import React from 'react'

const page = ({ params }: { params: { authorId: string } }) => {

    const authorId = params.authorId;
    return (
        <div className="space-y-6">
            <BreadCrumb
                item={[
                    { href: "/admin/authors", label: "Tác giả" },
                    { href: "/admin/authors/update", label: "Cập nhật" }
                ]}
                separetor={<ChevronRight className="w-3.5 h-3.5" />}
            />

            {/* Page Header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-linear-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/20">
                    <FilePlus2 className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Cập nhật tác giả</h1>
                    <p className="text-sm text-grayDark mt-0.5">Điền thông tin bên dưới để cập nhật tác giả</p>
                </div>
            </div>

            {/* Form */}
            <UpdateAuthor
                authorId={authorId}
            />
        </div>
    )
}

export default page