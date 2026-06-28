"use client"
import ProfilePage from '@/components/home/ProfilePage'
import { UserService } from '@/services/UserService'
import { TUserProfileResponse } from '@/types'
import React, { useEffect, useState } from 'react'


const page = () => {
    const [userData, setUserData] = useState<TUserProfileResponse | null>(null);
    const fetchUser = async () => {
        try {
            const user = await UserService.getCurrentUser();
            setUserData(user);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <>
            <ProfilePage
                user={userData!}
            />
        </>
    )
}

export default page