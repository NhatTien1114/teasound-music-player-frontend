"use client";

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

const ToastHandler = () => {
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get('login') === 'success') {
            toast.success('Đăng nhập thành công!');
            
            // Tùy chọn: Xóa query param khỏi URL để tránh hiện lại toast khi refresh
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }
    }, [searchParams]);

    return null;
}

export default function LoginToast() {
    return (
        <Suspense fallback={null}>
            <ToastHandler />
        </Suspense>
    )
}
