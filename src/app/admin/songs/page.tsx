import React from 'react'
import { BreadCrumb } from '@/components/layouts/BreadCrumb'
import { ChevronRight } from 'lucide-react'
import TableSong from '@/components/admin/songs/TableSongs'


const Page = () => {

    return (
        <div className="space-y-6">
            <BreadCrumb
                item={[
                    { href: "/admin/songs", label: "Bài hát" }
                ]}
                separetor={<ChevronRight className="w-3.5 h-3.5" />}
            />

            {/* Table */}
            <TableSong />
        </div>
    )
}

export default Page