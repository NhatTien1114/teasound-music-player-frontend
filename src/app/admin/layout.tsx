import React from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen overflow-hidden bg-[#0a0a0a]">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Topbar */}
                <AdminTopbar />
                
                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-[#0a0a0a] p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
