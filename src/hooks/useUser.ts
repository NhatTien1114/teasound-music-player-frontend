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
        const checkAuth = async () => {
            setIsLoading(true);
            try {
                const userProfile = await UserService.getCurrentUser();

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
            } catch (error) {
                setIsLoggedIn(false);
                setUserData(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
        window.addEventListener("auth-change", checkAuth);
        return () => window.removeEventListener("auth-change", checkAuth);
    }, []);

    return {
        user: userData,
        isLoggedIn,
        isLoading,
    };
};

export default useUser;
