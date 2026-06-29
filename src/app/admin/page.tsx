import React from 'react'
import { Users, Music, ListMusic, PlayCircle, TrendingUp, MoreHorizontal } from 'lucide-react'
import AdminChart from '@/components/admin/AdminChart'

export default function AdminDashboardPage() {
    // Mock data for metrics
    const metrics = [
        { title: "Total Users", value: "12,453", change: "+12%", isPositive: true, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: "Total Songs", value: "45,210", change: "+5%", isPositive: true, icon: Music, color: "text-purple-500", bg: "bg-purple-500/10" },
        { title: "Playlists", value: "3,210", change: "+18%", isPositive: true, icon: ListMusic, color: "text-pink-500", bg: "bg-pink-500/10" },
        { title: "Total Plays", value: "2.4M", change: "-2%", isPositive: false, icon: PlayCircle, color: "text-orange-500", bg: "bg-orange-500/10" },
    ];

    // Mock data for recent activities
    const activities = [
        { id: 1, user: "John Doe", action: "created a new playlist", target: "Summer Vibes 2024", time: "2 hours ago" },
        { id: 2, user: "Admin", action: "uploaded a new song", target: "Blinding Lights", time: "4 hours ago" },
        { id: 3, user: "Jane Smith", action: "registered an account", target: "", time: "5 hours ago" },
        { id: 4, user: "Mike Johnson", action: "liked the playlist", target: "Top 100 Billboard", time: "1 day ago" },
    ];

    // Mock data for top songs
    const topSongs = [
        { id: 1, title: "Shape of You", artist: "Ed Sheeran", plays: "125K" },
        { id: 2, title: "Blinding Lights", artist: "The Weeknd", plays: "98K" },
        { id: 3, title: "Dance Monkey", artist: "Tones and I", plays: "85K" },
        { id: 4, title: "Someone You Loved", artist: "Lewis Capaldi", plays: "72K" },
        { id: 5, title: "Watermelon Sugar", artist: "Harry Styles", plays: "65K" },
    ];

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
                <p className="text-grayDark">Welcome back, Admin! Here is what&apos;s happening today.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                        <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:bg-white/10 transition-colors duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${metric.bg}`}>
                                    <Icon className={`w-6 h-6 ${metric.color}`} />
                                </div>
                                <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${metric.isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {metric.change}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-grayDark text-sm font-medium mb-1">{metric.title}</h3>
                                <p className="text-3xl font-bold text-white">{metric.value}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Growth Chart */}
                <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <div>
                            <h2 className="text-xl font-bold text-white">Platform Growth</h2>
                            <p className="text-sm text-grayDark">User registrations and play counts over time.</p>
                        </div>
                    </div>
                    <AdminChart />
                </div>

                {/* Top Songs */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">Top Songs</h2>
                        <TrendingUp className="w-5 h-5 text-grayDark" />
                    </div>
                    <div className="space-y-4">
                        {topSongs.map((song, index) => (
                            <div key={song.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 text-center text-grayDark font-medium group-hover:text-primary transition-colors">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-white line-clamp-1">{song.title}</h4>
                                        <p className="text-xs text-grayDark">{song.artist}</p>
                                    </div>
                                </div>
                                <div className="text-sm text-grayDark">
                                    {song.plays}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">Recent Activities</h2>
                        <button className="text-primary text-sm font-medium hover:underline">View All</button>
                    </div>
                    <div className="space-y-6">
                        {activities.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-secondary/80 flex items-center justify-center flex-shrink-0 text-white font-bold">
                                    {activity.user.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-300">
                                        <span className="font-semibold text-white">{activity.user}</span> {activity.action} <span className="font-semibold text-white">{activity.target}</span>
                                    </p>
                                    <p className="text-xs text-grayDark mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Status */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6">System Status</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-sm text-gray-300">Server Load</span>
                            <span className="text-sm text-green-400 font-medium">Normal (24%)</span>
                        </div>
                        <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-sm text-gray-300">Database Storage</span>
                            <span className="text-sm text-yellow-400 font-medium">Warning (82%)</span>
                        </div>
                        <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-sm text-gray-300">Active Sessions</span>
                            <span className="text-sm text-white font-medium">1,204</span>
                        </div>
                        <div className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-sm text-gray-300">Next Backup</span>
                            <span className="text-sm text-white font-medium">In 2 hours</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
