"use client"
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { User, Key, Mail, Edit, Check, Camera, Loader2 } from 'lucide-react'
import { DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import PageNotFound from '@/app/not-found'
import { toast } from 'sonner'
import { UserService } from '@/services/UserService'
import { cn } from '@/lib/utils'
import { useUploadThing } from '@/utils/uploadthing'
import { TUserProfileResponse } from '@/types'

const ChangeInformationUser = ({ user, isLoading }: { user: TUserProfileResponse, isLoading: boolean }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [userName, setUserName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { startUpload, isUploading } = useUploadThing("imageUploader", {
        onClientUploadComplete: async (res) => {
            if (res && res[0]) {
                const uploadedUrl = res[0].ufsUrl || res[0].url;
                setAvatarUrl(uploadedUrl);
                const response = await UserService.updateInfo(user.id, userName, uploadedUrl);
                if (response?.error === 'Success') {
                    setUserName(response.newName);
                    setAvatarUrl(response.newAvatarUrl);
                    toast.success('Cập nhật ảnh đại diện thành công');
                    setIsEditing(false);
                    window.location.reload();
                }
            }
        },
        onUploadError: (error: Error) => {
            toast.error(`Lỗi tải ảnh: ${error.message}`);
        },
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            startUpload(Array.from(files));
        }
    };

    useEffect(() => {
        if (user) {
            setUserName(user.name || '');
            setAvatarUrl(user.avatarUrl || '');
        }
    }, [user]);

    if (isLoading) return null;
    if (!user) return <PageNotFound />

    const handleSaveInfo = async () => {
        const response = await UserService.updateInfo(user.id, userName, avatarUrl);
        if (response?.error === 'Success') {
            setUserName(response.newName);
            setAvatarUrl(response.newAvatarUrl);
            toast.success('Cập nhật thông tin thành công');
            setIsEditing(false);
            window.location.reload();
        } else {
            toast.error('Lỗi khi cập nhật thông tin: ' + response?.message);
        }
    };

    const handleUpdatePassword = async () => {
        if (oldPassword === '' || newPassword === '' || confirmPassword === '') {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp');
            return;
        }

        const response = await UserService.changePassword(user.id, oldPassword, newPassword);
        if (response) {
            toast.success('Cập nhật mật khẩu thành công');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            toast.error('Lỗi khi cập nhật mật khẩu');
        }
    }
    return (
        <DialogContent className="sm:max-w-120 p-0 bg-[#1C1C24] border-gray-800 text-white overflow-hidden border-none shadow-2xl rounded-2xl">
            <div className="flex flex-col items-center justify-center pt-10 pb-6 relative">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                />
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-900/50 overflow-hidden group cursor-pointer border-2 border-purple-500/30 hover:border-purple-500 transition-all"
                    title="Nhấp để thay đổi ảnh đại diện"
                >
                    {avatarUrl ? (
                        <Image
                            src={avatarUrl}
                            alt="Avatar"
                            width={96}
                            height={96}
                            className="object-cover w-full h-full group-hover:opacity-40 transition-opacity duration-300"
                        />
                    ) : (
                        <span className="text-3xl text-white font-bold uppercase group-hover:opacity-40 transition-opacity duration-300">
                            {userName ? userName.charAt(0) : "T"}
                        </span>
                    )}

                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {isUploading ? (
                            <Loader2 className="w-7 h-7 text-white animate-spin" />
                        ) : (
                            <Camera className="w-7 h-7 text-white drop-shadow-md" />
                        )}
                    </div>
                </div>
                <h2 className="text-xl font-bold mt-4">{userName}</h2>
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
                            <Input
                                className={cn("bg-grayDarker border-transparent focus-visible:ring-1 focus-visible:ring-primary text-white h-12 rounded-lg", isEditing ? "" : "cursor-not-allowed")}
                                readOnly={!isEditing}
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-400 text-sm flex items-center gap-2"><Mail className="w-4 h-4" /> Email</Label>
                            <Input className="cursor-not-allowed bg-grayDarker border-transparent focus-visible:ring-1 focus-visible:ring-primary text-white h-12 rounded-lg" readOnly value={user?.email || ''} />
                        </div>
                    </div>
                    <Button
                        onClick={() => {
                            if (isEditing) {
                                handleSaveInfo();
                            }
                            setIsEditing(!isEditing);
                        }}
                        className="w-full bg-grayDarker hover:bg-gray-700 text-white border border-grayDarker h-12 rounded-lg mt-6 font-medium">
                        {!isEditing ? <Edit className="w-4 h-4 mr-2" /> : <Check className="w-4 h-4 mr-2" />} {isEditing ? "Lưu thông tin" : "Chỉnh sửa thông tin"}
                    </Button>
                </TabsContent>

                <TabsContent value="password" className="px-6 pb-6 space-y-4 focus-visible:outline-none focus-visible:ring-0">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-gray-400 text-sm">Mật khẩu hiện tại</Label>
                            <Input
                                type="password"
                                autoComplete="new-password"
                                placeholder="••••••••"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="bg-grayDarker border-transparent focus-visible:ring-1 focus-visible:ring-primary text-white h-12 rounded-lg" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-400 text-sm">Mật khẩu mới</Label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="bg-grayDarker border-transparent focus-visible:ring-1 focus-visible:ring-primary text-white h-12 rounded-lg" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-400 text-sm">Xác nhận mật khẩu mới</Label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="bg-grayDarker border-transparent focus-visible:ring-1 focus-visible:ring-primary text-white h-12 rounded-lg" />
                        </div>
                    </div>
                    <Button
                        onClick={() => handleUpdatePassword()}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 rounded-lg mt-6">
                        <Key className="w-4 h-4 mr-2" /> Cập nhật mật khẩu
                    </Button>
                </TabsContent>
            </Tabs>
        </DialogContent>
    )
}

export default ChangeInformationUser