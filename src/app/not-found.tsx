import { ArchiveIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const PageNotFound = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <h1 className="font-bold text-5xl">404</h1>
            <h2 className="mb-5">Page not found</h2>
            <Link href="/" className="flex items-center gap-2 hover:text-primary"><ArchiveIcon />Trang chủ</Link>
        </div>
    )
}

export default PageNotFound
