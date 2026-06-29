import React from 'react'
import Heading from '@/typography/Heading'
import AddNewSong from '@/components/admin/songs/AddNewSong'

const page = () => {
    return (
        <>
            <Heading>Thêm bài hát mới</Heading>
            <div className="m-5">
                <AddNewSong />
            </div>
        </>
    )
}

export default page