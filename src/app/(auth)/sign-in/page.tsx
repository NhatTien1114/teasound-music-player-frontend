"use client";
import React, { useState, useEffect, Suspense } from 'react'
import { Input } from "@/components/ui/input"
import { Field, FieldGroup } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import IconUser from '@/components/icons/IconUser'
import IconLock from '@/components/icons/IconLock'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useSearchParams } from 'next/navigation'
import { FaFacebook, FaGoogle } from 'react-icons/fa';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const SignInContent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();

    useEffect(() => {
        const registered = searchParams.get('registered');
        const error = searchParams.get('error');

        if (registered === 'true') {
            toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
            window.history.replaceState({}, '', window.location.pathname);
        }

        if (error === 'true') {
            toast.error('Tài khoản hoặc mật khẩu không chính xác!');
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, [searchParams]);

    return (
        <div className="relative w-screen h-screen">
            {/* Background image */}
            {/* <Image
                src="https://i.pinimg.com/736x/dc/ee/32/dcee32cad9ca5f226c9dac794b103a9e.jpg"
                alt=""
                fill
                style={{ objectFit: "cover" }}
                className="blur-sm"
            /> */}

            <div className="relative z-10 flex justify-center items-center h-screen">
                <div
                    className="
                                h-130
                                w-120
                                rounded-2xl
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
                        <h3 className="font-bold text-2xl text-white">Chào mừng trở lại</h3>
                        <h4 className="flex justify-center items-center text-gray-300 text-sm mt-2 gap-1">Bạn chưa có tài khoản? <Link href="/sign-up" className="text-white hover:text-secondary font-semibold">Đăng ký!</Link></h4>
                    </div>

                    {/* Login */}
                    <form
                        action={`${BACKEND_URL}/api/auth/login`}
                        method="POST"
                        className="flex justify-center items-center p-5 mt-4"
                        onSubmit={() => setIsLoading(true)}
                    >
                        <FieldGroup>
                            <Field>
                                <div className="relative">
                                    <IconUser
                                        className="absolute z-10 left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4"
                                    />
                                    <Input
                                        id="fieldgroup-name"
                                        name="username"
                                        placeholder="Tên đăng nhập (Email)"
                                        autoComplete="off"
                                        required
                                        className="hover:led-border pl-10 text-white bg-white/5 border border-white/10 h-10 backdrop-blur-4xl"
                                    />
                                </div>
                            </Field>
                            <Field>
                                <div className="relative">
                                    <IconLock className="absolute z-10 left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4"></IconLock>
                                    <Input
                                        id="fieldgroup-password"
                                        name="password"
                                        type="password"
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
                                    Đăng nhập
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
                            href={`${BACKEND_URL}/oauth2/authorization/facebook`}
                            className="h-10 rounded-lg border border-grayDarker bg-grayDarker flex items-center justify-center text-white hover:bg-grayDarkest transition"
                            onClick={() => setIsLoading(true)}
                        >
                            <FaFacebook size={18} />
                        </a>

                        <a
                            href={`${BACKEND_URL}/oauth2/authorization/google`}
                            className="h-10 rounded-lg border border-grayDarker bg-grayDarker flex items-center justify-center text-white hover:bg-grayDarkest transition"
                            onClick={() => setIsLoading(true)}
                        >
                            <FaGoogle size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

const SignIn = () => {
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
                <SignInContent />
            </Suspense>
        </div>

    )
}

export default SignIn
