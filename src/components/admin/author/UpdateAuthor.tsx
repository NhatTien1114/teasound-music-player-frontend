"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Save, Image as ImageIcon, Loader2, ArrowLeft } from "lucide-react";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import { toast } from "sonner";
import { AuthorService } from "@/services/AuthorService";

const formSchema = z.object({
    name: z.string().min(2, { message: "Tên tác giả phải có ít nhất 2 ký tự" }),
    bio: z.string().optional(),
    avatar: z.string().optional(),
});

const UpdateAuthor = ({ authorId }: { authorId: string }) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            avatar: "",
            bio: "",
        },
    });

    const imageWatch = useWatch({
        control: form.control,
        name: 'avatar'
    });

    useEffect(() => {
        const fetchAuthor = async () => {
            setIsLoading(true);
            try {
                const res = await AuthorService.getAuthorById({ id: Number(authorId) });
                if (res.success && res.data) {
                    form.reset({
                        name: res.data.name || "",
                        bio: res.data.bio || "",
                        avatar: res.data.avatar || "",
                    });
                } else {
                    toast.error("Không tìm thấy thông tin tác giả");
                }
            } catch (error: any) {
                toast.error("Lỗi khi tải thông tin tác giả");
            } finally {
                setIsLoading(false);
            }
        };

        if (authorId) {
            fetchAuthor();
        }
    }, [authorId, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            const res = await AuthorService.updateAuthor({
                id: Number(authorId),
                data: values
            });
            if (res?.success) {
                toast.success(res?.message || "Cập nhật tác giả thành công");
                router.push("/admin/authors");
                router.refresh();
            } else {
                toast.error(res?.message || "Cập nhật thất bại");
            }
        } catch (error: any) {
            toast.error(error.message || "Có lỗi xảy ra");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return (
            <div className="bg-grayDarker rounded-xl shadow-sm border border-grayDark/20 p-12 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                <span className="ml-3 text-grayDark">Đang tải thông tin tác giả...</span>
            </div>
        );
    }

    const inputClasses = "bg-grayDarkest border-grayDark/20 text-white placeholder:text-grayDark/50 focus-visible:ring-primary focus-visible:border-primary/50 transition-all";

    return (
        <div className="bg-grayDarker rounded-xl shadow-sm border border-grayDark/20 p-6 md:p-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* Basic Info */}
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-grayDark">Tên tác giả <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input className={inputClasses + " h-12 text-lg"} placeholder="Nhập tên tác giả..." {...field} />
                                    </FormControl>
                                    <FormMessage className="text-red-400 text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-grayDark">Tiểu sử</FormLabel>
                                    <FormControl>
                                        <textarea
                                            className={`w-full rounded-md px-3 py-3 text-sm outline-none ${inputClasses} resize-none h-24`}
                                            placeholder="Một vài lời về tác giả này..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400 text-xs" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="w-full h-[1px] bg-grayDark/10 my-8"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <FormField
                            control={form.control}
                            name="avatar"
                            render={({ field }) => (
                                <FormItem className="col-span-1 md:col-span-2">
                                    <FormLabel className="text-grayDark flex items-center gap-1.5">
                                        <ImageIcon className="w-4 h-4" />
                                        Ảnh đại diện (Avatar URL)
                                    </FormLabel>
                                    <FormControl>
                                        <div className="flex justify-center outline-none h-44 rounded-md font-medium px-3 w-full text-sm border border-grayDark/20 focus:border-primary! transition-all bg-grayDarkest relative">
                                            {!imageWatch ? (
                                                <div className="flex flex-col items-center justify-center gap-2 p-4">
                                                    <UploadButton
                                                        endpoint="imageUploader"
                                                        onClientUploadComplete={(res) => {
                                                            if (res && res[0]?.url) {
                                                                field.onChange(res[0].url);
                                                            }
                                                        }}
                                                        onUploadError={(error: Error) => {
                                                            toast.error(`Lỗi upload ảnh: ${error.message}`);
                                                        }}
                                                    />
                                                    <span className="text-xs text-grayDark/60">Hoặc dán trực tiếp đường link ảnh bên dưới</span>
                                                </div>
                                            ) : (
                                                <div className="relative w-full h-full">
                                                    <Image
                                                        alt="Avatar"
                                                        src={imageWatch}
                                                        fill
                                                        unoptimized
                                                        className="w-full h-full object-cover rounded-md"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        className="absolute top-2 right-2 h-8 px-3"
                                                        onClick={() => form.setValue("avatar", "")}
                                                    >
                                                        Xóa ảnh
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </FormControl>
                                    <Input
                                        className={inputClasses + " mt-2 h-10 text-sm"}
                                        placeholder="Hoặc nhập/dán URL ảnh đại diện..."
                                        value={field.value || ""}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    <FormMessage className="text-red-400 text-xs" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="pt-6 flex justify-end items-center gap-3 border-t border-grayDark/10 mt-8">
                        <Link href="/admin/authors">
                            <Button
                                type="button"
                                variant="outline"
                                className="text-grayDark hover:text-white border-grayDark/20 gap-1.5"
                                disabled={isSubmitting}
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Quay lại
                            </Button>
                        </Link>
                        <Button
                            isLoading={isSubmitting}
                            type="submit"
                            className="bg-primary hover:bg-primary/90 text-white min-w-[150px] gap-2"
                            disabled={isSubmitting}
                        >
                            <Save className="w-4 h-4" />
                            Cập nhật tác giả
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default UpdateAuthor;