import { cn } from '@/lib/utils';
import { Music2, LucideProps } from 'lucide-react'
import React from 'react'

const AdminHeader = ({ icon, title, description }: { icon: React.ComponentType<LucideProps>; title: string; description: string }) => {
    const Icon = icon;
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
                <div className={cn("p-2.5 rounded-xl bg-linear-to-br from-sky-500/20 to-blue-600/20 border border-sky-500/20")}>
                    <Icon className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
                    <p className="text-sm text-grayDark mt-0.5">{description}</p>
                </div>
            </div>
        </div>
    )
}

export default AdminHeader