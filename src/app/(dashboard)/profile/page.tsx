"use client"
import ProfilePage from '@/components/home/ProfilePage'
import { UserService } from '@/services/UserService'
import { TUserProfileResponse } from '@/types'
import React, { useEffect, useState } from 'react'


const Page = () => {
    const [userData, setUserData] = useState<TUserProfileResponse | null>(null);
    useEffect(() => {
        const fetchUserData = async () => {
            const user = await UserService.getCurrentUser();
            setUserData(user);
        }
        fetchUserData();
    }, []);

    return (
        <>
            <ProfilePage
                user={userData!}
            />
        </>
    )
}

export default Page