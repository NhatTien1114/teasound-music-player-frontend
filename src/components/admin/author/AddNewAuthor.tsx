"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Save, Image as ImageIcon } from "lucide-react";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import { toast } from "sonner";
import { AuthorService } from "@/services/AuthorService";
import { revalidatePath } from "next/cache";


const formSchema = z.object({
    name: z.string().min(2, { message: "Tên tác giả phải có ít nhất 2 ký tự" }),
    bio: z.string().optional(),
    avatar: z.string().optional(),
});

function AddNewAuthor() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            avatar: "",
            bio: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            const res = await AuthorService.createAuthor({
                data: values
            });
            if (res?.success) {
                toast.success(res?.message);
                form.reset();
                revalidatePath('/admin/authors')
            } else {
                toast.error(res?.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    const inputClasses = "bg-grayDarkest border-grayDark/20 text-white placeholder:text-grayDark/50 focus-visible:ring-primary focus-visible:border-primary/50 transition-all";
    const imageWatch = useWatch({
        control: form.control,
        name: 'avatar'
    });
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
                                            placeholder="Một vài lời về bài hát này..."
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
                                        Ảnh bìa (Thumbnail URL)
                                    </FormLabel>
                                    <FormControl>
                                        <div className="flex justify-center outline-none h-40 rounded-md font-medium px-3 w-full text-sm border border-grayDark/20 focus:border-primary! transition-all bg-grayDarkest relative">
                                            {!imageWatch ? (
                                                <UploadButton
                                                    endpoint="imageUploader"
                                                    onClientUploadComplete={(res) => {
                                                        // Do something with the response
                                                        console.log("Files: ", res);
                                                        field.onChange(res[0].url);
                                                    }}
                                                    onUploadError={(error: Error) => {
                                                        // Do something with the error.
                                                        console.error(`ERROR! ${error.message}`);
                                                    }}
                                                />
                                            ) : (
                                                <div className="relative w-full h-full">
                                                    <Image
                                                        alt="Thumbnail"
                                                        src={imageWatch}
                                                        fill
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        className="absolute top-2 right-2 h-8 px-3"
                                                        onClick={() => form.setValue("avatar", "")}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-400 text-xs" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="pt-6 flex justify-end border-t border-grayDark/10 mt-8">
                        <Button
                            isLoading={isSubmitting}
                            type="submit"
                            className="bg-primary hover:bg-primary/90 text-white min-w-[150px] gap-2"
                            disabled={isSubmitting}
                        >
                            <Save className="w-4 h-4" />
                            Lưu tác giả
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default AddNewAuthor;