import {
    Home,
    Music2,
    Users,
    MonitorPlay,
    SlidersHorizontal,
    LucideIcon,
} from "lucide-react";

export const commonClassNames = {
    status:
        "border border-current rounded-md font-medium px-3 py-1 text-xs whitespace-nowrap",
    action:
        "size-8 rounded-md border flex items-center justify-center p-2 text-gray-500 hover:border-gray-500/80 dark:bg-transparent dark:border-gray-200/10 dark:hover:border-gray-200/20",
    paginationButton:
        "size-10 rounded-md borderDarkMode bgDarkMode border flex items-center justify-center hover:border-primary transition-all hover:text-primary",
};

export const menuItems: {
    id: string,
    url: string,
    title: string,
    icon: LucideIcon
}[] = [
        {
            id: 'home',
            url: '/',
            title: 'Trang chủ',
            icon: Home,
        },
        {
            id: 'music',
            url: '/music',
            title: 'Nhạc',
            icon: Music2,
        },
        {
            id: 'artists',
            url: '/artists',
            title: 'Nghệ sĩ',
            icon: Users,
        },
        {
            id: 'videos',
            url: '/videos',
            title: 'Video',
            icon: MonitorPlay,
        },
        {
            id: 'equalizer',
            url: '/equalizer',
            title: 'Bộ chỉnh âm',
            icon: SlidersHorizontal,
        },
    ]