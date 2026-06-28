import NowPlayingBar from '@/components/layouts/NowPlayingBar'
import SideBar from '@/components/layouts/SideBar'
import TopBar from '@/components/layouts/TopBar'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <div className="relative flex flex-col h-screen overflow-hidden bg-grayDarkest">
                {/* Ambient glow effects */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/15 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />

                {/* TopBar Full Width */}
                <TopBar />

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <SideBar />

                    {/* Main Content Area */}
                    <div className="flex flex-col flex-1 overflow-hidden my-2 mr-2 rounded-2xl bg-white/2 border border-white/5">
                        <main className="flex-1 overflow-y-auto px-6 pb-6">
                            {children}
                        </main>
                        <NowPlayingBar />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default layout