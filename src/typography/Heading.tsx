import React from 'react'

const Heading = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="text-4xl font-bold p-5">
            {children}
        </div>
    )
}

export default Heading
