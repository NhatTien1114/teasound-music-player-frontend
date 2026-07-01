"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { TAuthorResponse, TSongResponse } from "@/types";
import { AuthorService } from "@/services/AuthorService";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Save, Image as ImageIcon, Link as LinkIcon, Clock, Headphones, Play } from "lucide-react";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import { SongService } from "@/services/SongService";
import { toast } from "sonner";


const SONG_TYPES = [
    "POP", "ROCK", "HIPHOP", "RNB", "EDM", "JAZZ",
    "CLASSICAL", "LOFI", "KPOP", "VPOP", "ACOUSTIC",
    "INDIE", "REMIX", "OTHER"
] as const;

const formSchema = z.object({
    name: z.string().min(2, { message: "Tên bài hát phải có ít nhất 2 ký tự" }),
    description: z.string().optional(),
    type: z.enum(SONG_TYPES, {
        error: "Vui lòng chọn thể loại",
    }),
    author: z.string().min(1, { message: "Vui lòng chọn nghệ sĩ" }),
    videoUrl: z.string().optional(),
    audioUrl: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    duration: z.string().optional(),
});

function AddNewSong() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [authors, setAuthors] = useState<TAuthorResponse[]>([]);

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const res = await AuthorService.getAllAuthors();
                if (res.success && res.data) {
                    setAuthors(res.data);
                }
            } catch (error) {
                console.error("Error fetching authors:", error);
            }
        };
        fetchAuthors();
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            type: undefined,
            author: "",
            videoUrl: "",
            audioUrl: "",
            thumbnailUrl: "",
            duration: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsSubmitting(true);
            const payload = {
                ...values,
                author: { id: parseInt(values.author) }
            };
            const response = await SongService.createSong({ data: payload as unknown as TSongResponse });
            if (response.success) {
                toast.success(response.message);
                form.reset();
            } else {
                toast.error(response.message);
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
        name: 'thumbnailUrl'
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
                                    <FormLabel className="text-grayDark">Tên bài hát <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input className={inputClasses + " h-12 text-lg"} placeholder="Nhập tên bài hát..." {...field} />
                                    </FormControl>
                                    <FormMessage className="text-red-400 text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-grayDark">Mô tả ngắn</FormLabel>
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

                    {/* Media Type Selection */}
                    <div className="flex flex-cols-2">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem className="w-full mr-5">
                                    <FormLabel className="text-grayDark mb-3">Thể loại</FormLabel>

                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className={`${inputClasses} h-12 w-full text-sm`}>
                                                <SelectValue placeholder="Chọn thể loại" />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            {SONG_TYPES.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <FormMessage className="text-red-400 text-xs" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="author"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-grayDark mb-3">Nghệ sĩ</FormLabel>

                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className={`${inputClasses} h-12 w-full text-sm`}>
                                                <SelectValue placeholder="Chọn nghệ sĩ" />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            {authors.map((author) => (
                                                <SelectItem key={author.id} value={author.id?.toString() || ""}>
                                                    {author.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <FormMessage className="text-red-400 text-xs" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <FormField
                            control={form.control}
                            name="thumbnailUrl"
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
                                                        form.setValue("thumbnailUrl", res[0].url);
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
                                                        onClick={() => form.setValue("thumbnailUrl", "")}
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

                        <FormField
                            control={form.control}
                            name="audioUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-grayDark flex items-center gap-1.5">
                                        <Headphones className="w-4 h-4" />
                                        Audio URL
                                    </FormLabel>
                                    <FormControl>
                                        <Input className={inputClasses} placeholder="https://..." {...field} />
                                    </FormControl>
                                    <FormMessage className="text-red-400 text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="videoUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-grayDark flex items-center gap-1.5">
                                        <Play className="w-4 h-4" />
                                        Video URL
                                    </FormLabel>
                                    <FormControl>
                                        <Input className={inputClasses} placeholder="https://..." {...field} />
                                    </FormControl>
                                    <FormMessage className="text-red-400 text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-grayDark flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        Thời lượng
                                    </FormLabel>
                                    <FormControl>
                                        <Input className={inputClasses} placeholder="VD: 03:45" {...field} />
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
                            Lưu bài hát
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default AddNewSong;