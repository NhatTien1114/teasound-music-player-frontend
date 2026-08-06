"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthService } from "@/services/AuthService";
import { UserService } from "@/services/UserService";
import LoginLoadingSkeleton from "@/components/auth/LoginLoadingSkeleton";

/**
 * Handles the post-login flow for Google OAuth2:
 * 1. Detects `?login=success` query param from Google OAuth2 redirect
 * 2. Calls AuthService.exchangeOAuth2Token() to exchange HttpOnly cookie for JWT
 * 3. Stores token in localStorage securely (URL never contained the token!)
 * 4. Fetches user profile to determine role
 * 5. Redirects: ADMIN → /admin, USER → /
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
                    // Exchange HttpOnly cookie for JWT token & fetch profile in parallel with min loading time
                    const [authData] = await Promise.all([
                        AuthService.exchangeOAuth2Token(),
                        new Promise((resolve) => setTimeout(resolve, 1200)),
                    ]);

                    if (authData && authData.token) {
                        // Dispatch auth-change event so UI updates immediately
                        window.dispatchEvent(new Event("auth-change"));

                        const displayName = authData.name || authData.email || "bạn";

                        if (authData.role === "ADMIN") {
                            toast.success(`Chào mừng quản trị viên ${displayName}!`);
                            router.replace("/admin");
                        } else {
                            toast.success(`Đăng nhập thành công! Xin chào ${displayName}`);
                            router.replace("/");
                        }
                    } else {
                        // Fallback: try fetching current user if token was already set
                        const userProfile = await UserService.getCurrentUser();
                        if (userProfile && userProfile.authenticated) {
                            window.dispatchEvent(new Event("auth-change"));
                            router.replace("/");
                        } else {
                            toast.error("Phiên đăng nhập không hợp lệ. Vui lòng thử lại.");
                            router.replace("/sign-in");
                        }
                    }
                } catch (error) {
                    console.error("Error during token exchange:", error);
                    toast.error("Đăng nhập bằng Google không thành công. Vui lòng thử lại.");
                    router.replace("/sign-in");
                } finally {
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
