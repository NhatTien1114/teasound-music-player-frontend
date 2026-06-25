import React from 'react'
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { FaApple, FaGoogle } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import IconUser from '@/components/icons/IconUser'
import IconLock from '@/components/icons/IconLock'
const SignIn = () => {
    return (
        <>
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
                    <div
                        className="
                                    h-130
                                    w-120
                                    rounded-3xl
                                    bg-white/5
                                    backdrop-blur-4xl
                                    border border-white/10
                                    shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.15)]
  "
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
                            <h4 className="flex justify-center items-center text-gray-300 text-sm mt-2 gap-1">Bạn chưa có tài khoản? <Link href="/sign-up" className="text-white hover:text-secondary hover:font-bold">Đăng ký!</Link></h4>
                        </div>

                        {/* Login */}
                        <div className="flex justify-center items-center p-5 mt-4">
                            <FieldGroup>
                                <Field>
                                    <div className="relative">
                                        <IconUser
                                            className="absolute z-10 left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4"
                                        />
                                        <Input
                                            id="fieldgroup-name"
                                            placeholder="Tên đăng nhập"
                                            autoComplete="off"
                                            className="pl-10 text-white bg-white/5 border border-white/10 h-10 backdrop-blur-4xl"
                                        />
                                    </div>
                                </Field>
                                <Field>
                                    <div className="relative">
                                        <IconLock className="absolute z-10 left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4"></IconLock>
                                        <Input
                                            id="fieldgroup-password"
                                            type="password"
                                            placeholder="Mật khẩu"
                                            className="pl-10 text-white bg-white/5 border border-white/10 h-10 backdrop-blur-4xl"
                                            autoComplete="new-password"
                                        />
                                    </div>

                                </Field>
                                <Field orientation="horizontal">
                                    <Button type="submit" className="w-full h-10 mt-5 bg-primary">Đăng nhập</Button>
                                </Field>
                            </FieldGroup>
                        </div>

                        <div className="flex items-center mx-5 mt-2">
                            <div className="flex-1 border-t border-grayDarkest"></div>

                            <span className="px-3 text-sm text-gray-500">
                                Hoặc
                            </span>

                            <div className="flex-1 border-t border-grayDarkest"></div>
                        </div>

                        {/* OAuth2 */}
                        <div className="grid grid-cols-3 gap-4 m-5">
                            <button className="h-10 rounded-lg border border-grayDarker bg-grayDarker flex items-center justify-center text-white hover:bg-grayDarkest transition">
                                <FaApple size={18} />
                            </button>

                            <button className="h-10 rounded-lg border border-grayDarker bg-grayDarker flex items-center justify-center text-white hover:bg-grayDarkest transition">
                                <FaGoogle size={18} />
                            </button>

                            <button className="h-10 rounded-lg border border-grayDarker bg-grayDarker flex items-center justify-center text-white hover:bg-grayDarkest transition">
                                <FaXTwitter size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignIn
