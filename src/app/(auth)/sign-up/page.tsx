"use client";

import React, { useState, useEffect, Suspense } from 'react'
import { Input } from "@/components/ui/input"
import { Field, FieldGroup } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { FaFacebook, FaGoogle } from "react-icons/fa";
import IconUser from '@/components/icons/IconUser'
import IconLock from '@/components/icons/IconLock'
import IconMail from '@/components/icons/IconMail'
import IconPhone from '@/components/icons/IconPhone'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useSearchParams, useRouter } from 'next/navigation'
import { AuthService } from '@/services/AuthService'

const SignUpContent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');

    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const error = searchParams.get('error');
        if (error === 'email_exists') {
            toast.error('Email này đã được sử dụng. Vui lòng chọn email khác!');
        }
    }, [searchParams]);

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await AuthService.register({
                email,
                displayName,
                phoneNumber,
                password,
            });

            toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
            router.push('/sign-in?registered=true');
        } catch (error: any) {
            console.error("Register error:", error);
            const message = error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative w-screen h-screen">
            <div className="relative z-10 flex justify-center items-center h-screen">
                <div
                    className="
                                w-120
                                rounded-3xl
                                bg-grayDarkest
                                led-border"
                >
                    {/* Ảnh logo */}
                    <div className="flex justify-center items-center mt-5">
                        <Image
                            src="https://i.pinimg.com/736x/d1/a2/a5/d1a2a5cd94d4741fc79d5350ed1b7e39.jpg"
                            alt="TeaSound Logo"
                            width={60}
                            height={40}
                            className={"rounded-lg"}
                        />
                    </div>

                    {/* Chào mừng */}
                    <div className="grid grid-cols justify-center items-center mt-3">
                        <h3 className="font-bold text-2xl text-white">Hãy tận hưởng âm nhạc</h3>
                        <h4 className="flex justify-center items-center text-gray-300 text-sm mt-2 gap-1">Bạn đã có tài khoản?<Link href="/sign-in" className="text-white hover:text-secondary font-semibold">Đăng nhập!</Link></h4>
                    </div>

                    {/* Form Đăng ký */}
                    <form
                        onSubmit={handleRegisterSubmit}
                        className="flex justify-center items-center p-5 mt-4"
                    >
                        <FieldGroup>
                            <Field>
                                <div className="relative">
                                    <IconMail
                                        className="absolute z-10 left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4"
                                    />
                                    <Input
                                        id="fieldgroup-mail"
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email"
                                        autoComplete="off"
                                        required
                                        className="pl-10 text-white bg-white/5 border border-white/10 h-10 backdrop-blur-4xl"
                                    />
                                </div>
                            </Field>
                            <div className="grid grid-cols-2 gap-2">
                                <Field>
                                    <div className="relative">
                                        <IconUser
                                            className="absolute z-10 left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4"
                                        />
                                        <Input
                                            id="fieldgroup-name"
                                            name="displayName"
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            placeholder="Tên đăng nhập"
                                            autoComplete="off"
                                            required
                                            className="pl-10 text-white bg-white/5 border border-white/10 h-10 backdrop-blur-4xl"
                                        />
                                    </div>
                                </Field>
                                <Field>
                                    <div className="relative">
                                        <IconPhone
                                            className="absolute z-10 left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4"
                                        />
                                        <Input
                                            id="form-phone"
                                            name="phoneNumber"
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder="(+84) 123 456 789"
                                            autoComplete="off"
                                            className="pl-10 text-white bg-white/5 border border-white/10 h-10 backdrop-blur-4xl"
                                        />
                                    </div>
                                </Field>
                            </div>

                            <Field>
                                <div className="relative">
                                    <IconLock className="absolute z-10 left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4"></IconLock>
                                    <Input
                                        id="fieldgroup-password"
                                        name="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Mật khẩu"
                                        required
                                        className="pl-10 text-white bg-white/5 border border-white/10 h-10 backdrop-blur-4xl"
                                        autoComplete="new-password"
                                    />
                                </div>

                            </Field>
                            <Field orientation="horizontal">
                                <Button type="submit" disabled={isLoading} className="w-full h-10 mt-5 bg-primary">
                                    {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                                    Đăng ký
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>

                    <div className="flex items-center mx-5 mt-2">
                        <div className="flex-1 border-t border-grayDarkest"></div>

                        <span className="px-3 text-sm text-gray-500">
                            Hoặc
                        </span>

                        <div className="flex-1 border-t border-grayDarkest"></div>
                    </div>

                    {/* OAuth2 */}
                    <div className="grid grid-cols-2 gap-4 m-5">
                        <a
                            href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/oauth2/authorization/facebook`}
                            className="h-10 rounded-lg border border-grayDarker bg-grayDarker flex items-center justify-center text-white hover:bg-grayDarkest transition"
                            onClick={() => setIsLoading(true)}
                        >
                            <FaFacebook size={18} />
                        </a>

                        <a
                            href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/oauth2/authorization/google`}
                            className="h-10 rounded-lg border border-grayDarker bg-grayDarker flex items-center justify-center text-white hover:bg-grayDarkest transition"
                            onClick={() => setIsLoading(true)}
                        >
                            <FaGoogle size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </div >
    )
}

const SignUp = () => {
    return (

        <div className="min-h-screen w-full bg-black relative">
            {/* Midnight Aurora Glow Background */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
                  radial-gradient(circle at 50% 50%, 
                    rgba(58, 123, 255, 0.25) 0%, 
                    rgba(100, 149, 237, 0.15) 25%, 
                    rgba(123, 104, 238, 0.07) 35%, 
                    transparent 50%
                  )
                `,
                }}
            />
            {/* Your Content/Components */}
            <Suspense fallback={<div className="flex h-screen items-center justify-center relative z-10"><Loader2 className="animate-spin h-8 w-8 text-white" /></div>}>
                <SignUpContent />
            </Suspense>
        </div>
    )
}

export default SignUp
