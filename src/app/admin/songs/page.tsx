import React from 'react'
import AddNewSong from '@/components/admin/songs/AddNewSong'
import Heading from '@/typography/Heading'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import TableSong from '@/components/admin/songs/TableSongs'

const page = () => {
    return (
        <>
            <div className="flex justify-between items-center">
                <Heading>
                    Quản lý bài hát
                </Heading>
                <Link href="/admin/songs/create">
                    <Button className="text-white bg-primary hover:bg-primary/80 cursor-pointer gap-2 mt-5 mr-5">
                        <PlusIcon />
                        Thêm bài hát
                    </Button>
                </Link>
            </div>
            <div className="m-5">
                <TableSong />
            </div>
        </>
    )
}

export default page