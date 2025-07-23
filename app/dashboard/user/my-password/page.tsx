'use client';
import React from 'react';
import RecoveryPasswordForm from './(shared-components)/recovery-password';
import SetPasswordForm from './(shared-components)/set-password';
import { useUserContext } from '@/layout/context/usercontext';

const PasswordPage = () => {
    const { user } = useUserContext();

    return <>{user && user.has_password === false ? <SetPasswordForm /> : <RecoveryPasswordForm />}</>;
};

export default PasswordPage;
