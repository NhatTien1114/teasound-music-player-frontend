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

export const typeOfMusic: {
    value: string,
    label: string,
    className?: string
}[] = [
        {
            "value": "POP",
            "label": "Pop",
            "className": "text-blue-500"
        }, {
            "value": "ROCK",
            "label": "Rock",
            "className": "text-red-500"
        }, {
            "value": "HIPHOP",
            "label": "Hip Hop",
            "className": "text-yellow-500"
        }, {
            "value": "RNB",
            "label": "R&B",
            "className": "text-pink-500"
        }, {
            "value": "EDM",
            "label": "EDM",
            "className": "text-purple-500"
        }, {
            "value": "JAZZ",
            "label": "Jazz",
            "className": "text-cyan-500"
        }, {
            "value": "CLASSICAL",
            "label": "Classical",
            "className": "text-orange-500"
        }, {
            "value": "LOFI",
            "label": "Lofi",
            "className": "text-amber-500"
        }, {
            "value": "KPOP",
            "label": "K-Pop",
            "className": "text-rose-500"
        }, {
            "value": "VPOP",
            "label": "V-Pop",
            "className": "text-fuchsia-500"
        }, {
            "value": "ACOUSTIC",
            "label": "Acoustic",
            "className": "text-green-500"
        }, {
            "value": "INDIE",
            "label": "Indie",
            "className": "text-lime-500"
        }, {
            "value": "REMIX",
            "label": "Remix",
            "className": "text-indigo-500"
        }, {
            "value": "OTHER",
            "label": "Other",
            "className": "text-slate-500"
        }]