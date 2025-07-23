import { Metadata } from 'next';
import AppConfig from '../../layout/AppConfig';
import React from 'react';
import { UserProvider } from '@/layout/context/usercontext';

interface SimpleLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'بی‌واسط',
    description: 'فروش فایل بی‌واسط'
};

export default function SimpleLayout({ children }: SimpleLayoutProps) {
    return (
        <React.Fragment>
            <UserProvider>
                {children}
                <AppConfig simple />
            </UserProvider>
        </React.Fragment>
    );
}
