"use client"
import React from 'react'
import Image from 'next/image'
import { TUserProfileResponse } from '@/types'
import { Button } from "@/components/ui/button"
import { MoreVertical, User, Key, Mail, Edit } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import PageNotFound from '@/app/not-found'
import useUser from '@/hooks/useUser'

const ProfilePage = () => {
    const { user, isLoading } = useUser();

    if (isLoading) return null;
    if (!user) return <PageNotFound />
    return (
        <>
            <div className="relative mt-5 rounded-lg h-60 w-full bg-gray-700/80 flex flex-row p-4 items-center">
                <div className="flex flex-row items-center">
                    <div className="w-40 h-40 rounded-full bg-secondary/80 flex items-center justify-center hover:bg-secondary transition-colors duration-200 shadow-md shadow-secondary/20 shrink-0 overflow-hidden">
                        {user?.avatarUrl ? (
                            <Image src={user.avatarUrl} alt="Avatar" width={40} height={40} className="object-cover w-full h-full" />
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
                        <form>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-gray-600/50 rounded-full h-10 w-10">
                                    <MoreVertical className="w-5 h-5" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[480px] p-0 bg-[#1C1C24] border-gray-800 text-white overflow-hidden border-none shadow-2xl rounded-2xl">
                                <div className="flex flex-col items-center justify-center pt-10 pb-6 relative">
                                    <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-900/50 overflow-hidden">
                                        {user?.avatarUrl ? (
                                            <Image src={user.avatarUrl} alt="Avatar" width={80} height={80} className="object-cover w-full h-full" />
                                        ) : (
                                            <span className="text-3xl text-white font-bold uppercase">
                                                {user?.name ? user.name.charAt(0) : "T"}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-xl font-bold mt-4">{user?.name}</h2>
                                    <span className="text-xs bg-gray-800/80 text-gray-400 px-3 py-1 rounded-full mt-1 border border-gray-700">
                                        {user?.role}
                                    </span>
                                </div>

                                <Tabs defaultValue="info" className="w-full flex flex-col h-full">
                                    <div className="px-6 mb-4">
                                        <TabsList className="flex w-full bg-grayDarker rounded-lg p-1 h-12">
                                            <TabsTrigger
                                                value="info"
                                                className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-gray-400 rounded-md transition-all h-full font-medium"
                                            >
                                                <User className="w-4 h-4 mr-2" /> Thông tin
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="password"
                                                className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-gray-400 rounded-md transition-all h-full font-medium"
                                            >
                                                <Key className="w-4 h-4 mr-2" /> Đổi mật khẩu
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>

                                    <TabsContent value="info" className="px-6 pb-6 space-y-4 focus-visible:outline-none focus-visible:ring-0">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="text-gray-400 text-sm flex items-center gap-2"><User className="w-4 h-4" /> Tên người dùng</Label>
                                                <Input className="bg-grayDarker border-transparent focus-visible:ring-1 focus-visible:ring-primary text-white h-12 rounded-lg" readOnly value={user?.name || ''} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-gray-400 text-sm flex items-center gap-2"><Mail className="w-4 h-4" /> Email</Label>
                                                <Input className="bg-grayDarker border-transparent focus-visible:ring-1 focus-visible:ring-primary text-white h-12 rounded-lg" readOnly value={user?.email || ''} />
                                            </div>
                                        </div>
                                        <Button className="w-full bg-grayDarker hover:bg-gray-700 text-white border border-grayDarker h-12 rounded-lg mt-6 font-medium">
                                            <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa thông tin
                                        </Button>
                                    </TabsContent>

                                    <TabsContent value="password" className="px-6 pb-6 space-y-4 focus-visible:outline-none focus-visible:ring-0">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="text-gray-400 text-sm">Mật khẩu hiện tại</Label>
                                                <Input type="password" autoComplete="new-password" placeholder="••••••••" className="bg-grayDarker border-transparent focus-visible:ring-1 focus-visible:ring-primary text-white h-12 rounded-lg" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-gray-400 text-sm">Mật khẩu mới</Label>
                                                <Input type="password" placeholder="••••••••" className="bg-grayDarker border-transparent focus-visible:ring-1 focus-visible:ring-primary text-white h-12 rounded-lg" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-gray-400 text-sm">Xác nhận mật khẩu mới</Label>
                                                <Input type="password" placeholder="••••••••" className="bg-grayDarker border-transparent focus-visible:ring-1 focus-visible:ring-primary text-white h-12 rounded-lg" />
                                            </div>
                                        </div>
                                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 rounded-lg mt-6">
                                            <Key className="w-4 h-4 mr-2" /> Cập nhật mật khẩu
                                        </Button>
                                    </TabsContent>
                                </Tabs>
                            </DialogContent>
                        </form>
                    </Dialog>
                </div>
            </div>
        </>
    )
}

export default ProfilePage