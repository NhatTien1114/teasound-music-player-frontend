import Image from 'next/image'
import React from 'react'

const SignUp = () => {
    return (
        <div className="relative w-screen h-screen">
            {/* Background image */}
            <Image
                src="https://i.pinimg.com/736x/dc/ee/32/dcee32cad9ca5f226c9dac794b103a9e.jpg"
                alt=""
                fill
                style={{ objectFit: "cover" }}
                className="blur-sm"
            />

            <div className="relative z-10 flex justify-center items-center h-screen">
                <div className="h-96 w-80 bg-black border border-gray-800 rounded-lg shadow-2xl">

                </div>
            </div>
        </div>
    )
}

export default SignUp