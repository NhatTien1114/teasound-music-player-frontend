"use client";

import { useEffect, useState } from 'react';
import { UserService } from '@/services/UserService';
import { TUserProfileResponse } from '@/types';

const useUser = () => {
    const [userData, setUserData] = useState<TUserProfileResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchUserData = async () => {
        setIsLoading(true);
        try {
            const user = await UserService.getCurrentUser();
            setUserData(user);
        } catch (error) {
            console.error('Lỗi khi lấy thông tin user:', error);
            setUserData(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return {
        user: userData,
        userData,
        isLoading,
        refetch: fetchUserData,
    };
};

export default useUser;
