"use client"
import React from 'react'
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const ProfilePage = () => {
    const router = useRouter()
    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn')
        window.dispatchEvent(new Event('auth-change'))
        toast.success("Đã đăng xuất thành công")
        router.push('/')
    }
    return (
        <>
            <div className={cn("flex mb-8 mt-5", "justify-between px-2")}>
                <div className="flex items-center">
                    <button className="w-10 h-10 rounded-full bg-secondary/80 flex items-center justify-center hover:bg-secondary transition-colors duration-200 shadow-md shadow-secondary/20 flex-shrink-0">
                        <span className="text-sm text-white font-medium">T</span>
                    </button>
                    <div className="ml-3 flex flex-col justify-center overflow-hidden whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                        <span className="text-sm text-white font-medium">Tea User</span>
                        <span className="text-xs text-grayDark">Free plan</span>
                    </div>
                </div>
                <Button
                    onClick={() => handleLogout()}
                    className="bg-red-500 text-white w-30 h-auto hover:bg-red-600 transition-colors duration-200 shadow-md shadow-red-500/20">
                    Đăng xuất
                </Button>
            </div>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="fieldgroup-name">Name</FieldLabel>
                    <Input id="fieldgroup-name" placeholder="Jordan Lee" />
                </Field>
                <Field>
                    <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
                    <Input
                        id="fieldgroup-email"
                        type="email"
                        placeholder="name@example.com"
                    />
                </Field>
                <Field orientation="horizontal">
                    <Button type="submit">Cập nhật</Button>
                </Field>
            </FieldGroup>
        </>
    )
}

export default ProfilePage