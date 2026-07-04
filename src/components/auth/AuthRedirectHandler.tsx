"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserService } from "@/services/UserService";
import LoginLoadingSkeleton from "@/components/auth/LoginLoadingSkeleton";

/**
 * Handles the post-login flow:
 * 1. Detects `?login=success` query param
 * 2. Shows skeleton loading screen
 * 3. Fetches user profile to determine role
 * 4. Redirects: ADMIN → /admin, USER → /
 * 5. Shows success toast
 */
const AuthRedirectContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isAuthLoading, setIsAuthLoading] = useState(false);

    useEffect(() => {
        const loginParam = searchParams.get("login");

        if (loginParam === "success") {
            setIsAuthLoading(true);

            // Clean up the URL immediately
            window.history.replaceState({}, "", window.location.pathname);

            const handlePostLogin = async () => {
                try {
                    // Simulate a minimum loading time for UX polish (at least 1.5s)
                    const [userProfile] = await Promise.all([
                        UserService.getCurrentUser(),
                        new Promise((resolve) => setTimeout(resolve, 1500)),
                    ]);

                    if (userProfile && userProfile.authenticated) {
                        // Dispatch auth-change event so SideBar updates
                        window.dispatchEvent(new Event("auth-change"));

                        const displayName =
                            userProfile.name || userProfile.email || "bạn";

                        if (userProfile.role === "ADMIN") {
                            toast.success(
                                `Chào mừng quản trị viên ${displayName}!`
                            );
                            router.replace("/admin");
                        } else {
                            toast.success(`Đăng nhập thành công! Xin chào ${displayName}`);
                            router.replace("/");
                        }
                    } else {
                        // Authentication failed — redirect back to sign-in
                        toast.error("Phiên đăng nhập không hợp lệ. Vui lòng thử lại.");
                        router.replace("/sign-in");
                    }
                } catch (error) {
                    console.error("Error during post-login redirect:", error);
                    toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
                    router.replace("/sign-in");
                } finally {
                    // Small delay before hiding skeleton to allow navigation to start
                    setTimeout(() => setIsAuthLoading(false), 300);
                }
            };

            handlePostLogin();
        }
    }, [searchParams, router]);

    if (isAuthLoading) {
        return (
            <div className="fixed inset-0 z-[9999]">
                <LoginLoadingSkeleton />
            </div>
        );
    }

    return null;
};

export default function AuthRedirectHandler() {
    return (
        <Suspense fallback={null}>
            <AuthRedirectContent />
        </Suspense>
    );
}
