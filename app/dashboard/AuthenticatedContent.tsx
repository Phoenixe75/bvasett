'use client';

import React from 'react';
import { useUserContext } from '@/layout/context/usercontext';
import { useRouter } from 'next/navigation';
import { ProgressSpinner } from 'primereact/progressspinner';

const AuthenticatedContent = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useUserContext();
    const router = useRouter();

    if (loading) {
        return <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />;
    }

    return user ? (
        <>{children}</>
    ) : (
        <div>
            وارد حساب کاربری خود شوید.
            <span onClick={() => router.push('/')} className="text-blue-400 mr-2 cursor-pointer">
                بازگشت به صفحه اصلی
            </span>
        </div>
    );
};

export default AuthenticatedContent;
