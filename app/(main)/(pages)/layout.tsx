import { Metadata } from 'next';
import React from 'react';
import { UserProvider } from '@/layout/context/usercontext';
import AppConfig from '@/layout/AppConfig';

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
                <div className='body'>
                    {children}
                </div>
                <AppConfig simple />
            </UserProvider>
        </React.Fragment>
    );
}
