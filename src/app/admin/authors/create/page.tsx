import AddNewAuthor from '@/components/admin/author/AddNewAuthor'
import Heading from '@/typography/Heading'
import React from 'react'

const page = () => {
    return (
        <>
            <Heading>Thêm tác giả mới</Heading>
            <div className="m-5">
                <AddNewAuthor />
            </div>
        </>
    )
}

export default page