"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { MoreVertical } from 'lucide-react'
import {
    Dialog,
    DialogTrigger,
} from "@/components/ui/dialog"
import PageNotFound from '@/app/not-found'
import useUser from '@/hooks/useUser'
import ChangeInformationUser from './ChangeInformationUser'

const ProfilePage = () => {
    const { user, isLoading } = useUser();
    const [avatarUrl, setAvatarUrl] = useState('');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (user) {
            setUserName(user.name || '');
            setAvatarUrl(user.avatarUrl || '');
        }
    }, [user]);

    if (isLoading) return null;
    if (!user) return <PageNotFound />

    return (
        <>
            <div className="relative mt-5 rounded-lg h-60 w-full bg-gray-700/80 flex flex-row p-4 items-center">
                <div className="flex flex-row items-center">
                    <div className="w-40 h-40 rounded-full bg-secondary/80 flex items-center justify-center hover:bg-secondary transition-colors duration-200 shadow-md shadow-secondary/20 shrink-0 overflow-hidden">
                        {avatarUrl || user?.avatarUrl ? (
                            <Image src={avatarUrl || user?.avatarUrl || ''} alt="Avatar" width={160} height={160} className="object-cover w-full h-full" />
                        ) : (
                            <span className="text-6xl text-white font-bold uppercase">
                                {user?.name ? user.name.charAt(0) : "T"}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <p className="px-4 text-white text-sm">Profile</p>
                        <h1 className="p-4 text-4xl font-bold text-white">{user?.name}</h1>
                        {user?.createdAt && (
                            <p className="px-4 text-gray-300 text-sm mt-1 font-medium">
                                Tham gia từ: {Array.isArray(user.createdAt)
                                    ? new Date(user.createdAt[0], user.createdAt[1] - 1, user.createdAt[2]).toLocaleDateString('vi-VN')
                                    : new Date(user.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                        )}
                    </div>
                </div>

                <div className="absolute top-4 right-4">
                    <Dialog>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-gray-600/50 rounded-full h-10 w-10">
                                    <MoreVertical className="w-5 h-5" />
                                </Button>
                            </DialogTrigger>
                            <ChangeInformationUser user={user} isLoading={isLoading} />
                        </form>
                    </Dialog>
                </div>
            </div>
        </>
    )
}

export default ProfilePage