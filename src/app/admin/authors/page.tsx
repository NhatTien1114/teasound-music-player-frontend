import TableAuthor from '@/components/admin/author/TableAuthor'
import { Button } from '@/components/ui/button'
import Heading from '@/typography/Heading'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
        <>
            <div className="flex justify-between items-center">
                <Heading>
                    Quản lý tác giả
                </Heading>
                <Link href="/admin/authors/create">
                    <Button className="text-white bg-primary hover:bg-primary/80 cursor-pointer gap-2 mt-5 mr-5">
                        <PlusIcon />
                        Thêm tác giả
                    </Button>
                </Link>
            </div>
            <div className="m-5">
                <TableAuthor />
            </div>
        </>
    )
}

export default page