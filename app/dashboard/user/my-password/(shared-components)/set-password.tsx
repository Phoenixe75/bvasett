'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { toast } from 'react-toastify';
import { Password as PrimePassword } from 'primereact/password';
import { setPasswordUser } from '@/app/dashboard/admin/users/(services)/users.service';
import { useUserContext } from '@/layout/context/usercontext';
import { useRouter } from 'next/navigation';
import { ISetPasswordProps } from '../(models)/password';

const SetPasswordForm = () => {
    const { user } = useUserContext();
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);
    const loading = useRef(false);
    const router = useRouter();
    const userId = user?.id;

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const id: number | null = userId !== undefined ? userId : null;
        const data: ISetPasswordProps = { id, newPassword: password };

        try {
            if (userId !== null) {
                if (password === confirmPassword) {
                    loading.current = true;
                    await setPasswordUser(data);
                    toast.success('رمز عبور ثبت شد');
                    router.push('../');
                } else {
                    toast.error('رمز عبور یکسان نیست');
                }
            }
        } catch (error) {
            toast.error('ثبت رمز با خطا روبرو شد');
            console.error('Failed to create Ticket:', error);
        } finally {
            loading.current = false;
        }
    };

    return (
        <div className="card detailsData">
            <h5>ثبت رمز عبور</h5>
            <hr />
            <form onSubmit={submitForm} className="grid p-fluid mt-6">
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <PrimePassword id="password" value={password} onChange={(e) => setPassword(e.target.value)} toggleMask autoComplete="new-password" />
                        <label htmlFor="password">رمز عبور </label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <PrimePassword id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} toggleMask autoComplete="confirm-password" />
                        <label htmlFor="confirmPassword">تکرار عبور جدید</label>
                    </span>
                </div>
                <div className="field col-12 md:col-2">
                    <Button raised label="ثبت رمز عبور" className="bg-blue-700 text-white " type="submit" />
                </div>
            </form>
        </div>
    );
};

export default SetPasswordForm;
