"use client";

import { useEffect, useState } from 'react';
import { UserService } from '@/services/UserService';
import { TUserProfileResponse } from '@/types';

export type TUser = TUserProfileResponse & {
    id?: number;
    username?: string;
    name?: string;
    email?: string;
    avatar?: string;
    avatarUrl?: string;
    role?: string;
    plan?: string;
    createdAt?: string | number[] | Date;
};

const useUser = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState<TUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let revision = 0;
        const checkAuth = async () => {
            const request = ++revision;
            const token = localStorage.getItem("token");
            if (!token) {
                setIsLoggedIn(false);
                setUserData(null);
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                const userProfile = await UserService.getCurrentUser();

                if (request !== revision || localStorage.getItem("token") !== token) return;
                if (userProfile && userProfile.authenticated) {
                    setIsLoggedIn(true);
                    setUserData({
                        ...userProfile,
                        id: userProfile.id,
                        username: userProfile.name || userProfile.email || "Tea User",
                        name: userProfile.name || userProfile.email || "Tea User",
                        email: userProfile.email,
                        avatar: userProfile.avatarUrl,
                        avatarUrl: userProfile.avatarUrl,
                        role: userProfile.role,
                        createdAt: userProfile.createdAt,
                        plan: userProfile.role === 'ADMIN' ? 'Quản trị viên' : (userProfile.role ? 'Người dùng' : 'Khách'),
                    });
                } else {
                    setIsLoggedIn(false);
                    setUserData(null);
                }
            } catch {
                if (request !== revision) return;
                setIsLoggedIn(false);
                setUserData(null);
            } finally {
                if (request === revision) setIsLoading(false);
            }
        };
        checkAuth();
        window.addEventListener("auth-change", checkAuth);
        const onStorage = (event: StorageEvent) => {
            if (event.key === "token" || event.key === null) void checkAuth();
        };
        window.addEventListener("storage", onStorage);
        return () => {
            revision++;
            window.removeEventListener("auth-change", checkAuth);
            window.removeEventListener("storage", onStorage);
        };
    }, []);

    return {
        user: userData,
        isLoggedIn,
        isLoading,
    };
};

export default useUser;
