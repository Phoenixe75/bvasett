'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Password as PrimePassword } from 'primereact/password';
import { IChangePasswordProps, IFormProps } from '../(models)/password';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { toast } from 'react-toastify';
import { changePassword } from '@/app/dashboard/admin/users/(services)/users.service';
import { useUserContext } from '@/layout/context/usercontext';
import { useRouter } from 'next/navigation';

const RecoveryPasswordForm = () => {
    const { user } = useUserContext();
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [oldPassword, setOldPassword] = useState<string>('');
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
        const data: IChangePasswordProps = { id, newPassword: password, oldPassword: oldPassword };

        try {
            loading.current = true;
            await changePassword(data);
            toast.success('رمز عبور تغییر کرد');
            router.push('../');
        } catch (error) {
            toast.error('تغییر پسورد با خطا مواجعه شد');
            console.error('Failed to create password:', error);
        } finally {
            loading.current = false;
        }
    };

    return (
        <div className="card detailsData">
            <h5>بازیابی رمز عبور</h5>
            <hr />
            <form onSubmit={submitForm} className="grid p-fluid mt-6">
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <PrimePassword type="text" id="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} toggleMask autoComplete="current-password" />
                        <label htmlFor="oldPassword">رمز عبور فعلی</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <PrimePassword id="newPassword" value={password} onChange={(e) => setPassword(e.target.value)} toggleMask autoComplete="new-password" />
                        <label htmlFor="newPassword">رمز عبور جدید</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <PrimePassword id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} toggleMask autoComplete="new-password" />
                        <label htmlFor="confirmPassword">تکرار عبور جدید</label>
                    </span>
                </div>
                <div className="field col-12 md:col-1">
                    <Button raised label="بروزرسانی" className="bg-blue-700 text-white" type="submit" loading={loading.current} disabled={loading.current} />
                </div>
            </form>
        </div>
    );
};

export default RecoveryPasswordForm;
