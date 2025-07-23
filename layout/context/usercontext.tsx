'use client';
import React, { useState, createContext, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { axiosApi } from '@/app/api/api';
import { IUserProps, ChildContainerProps, UserContextProps } from '@/types';

export const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: ChildContainerProps) => {
    const [user, setUser] = useState<IUserProps | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUserData = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = Cookies.get('authToken');
            const response = await axiosApi.get<IUserProps>('/api/users/me/', {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            setUser(response.data);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'خطا در بارگذاری اطلاعات کاربر.');
        } finally {
            setLoading(false);
        }
    };

    const updateAuthToken = (newToken: string) => {
        Cookies.set('authToken', newToken, { expires: 7 });
        fetchUserData();
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return <UserContext.Provider value={{ user, loading, error, fetchUserData, updateAuthToken }}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};
