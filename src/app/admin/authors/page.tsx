import TableAuthor from '@/components/admin/author/TableAuthor'
import { BreadCrumb } from '@/components/layouts/BreadCrumb'
import { ChevronRight, Users } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const page = () => {


    return (
        <div className="space-y-6">
            <BreadCrumb
                item={[
                    { href: "/admin/authors", label: "Tác giả" }
                ]}
                separetor={<ChevronRight className="w-3.5 h-3.5" />}
            />
            <Link
                href="/admin/authors/create"
                className="z-10 size-10 rounded-full bg-primary flex justify-center items-center text-white fixed right-5 bottom-2 animate-bounce"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                    />
                </svg>
            </Link>

            {/* Table */}
            <TableAuthor />
        </div>
    )
}

export default page