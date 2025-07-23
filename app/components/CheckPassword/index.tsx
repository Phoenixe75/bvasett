'use client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { IAuthenticatePassword } from '@/app/(main)/auth/login/(models)/login';
import { authenticateWithPassword } from '@/app/api/api';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/layout/context/usercontext';

interface IProps {
    setFormState: any;
    userData: any;
    onlyForm?: boolean;
}

const CheckPassword = ({ setFormState, userData, onlyForm }: IProps) => {
    const [password, setPassword] = useState<string>('');
    const router = useRouter();
    const { updateAuthToken } = useUserContext();

    const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data: IAuthenticatePassword = { mobile: userData, password };

        try {
            const response = await authenticateWithPassword(data);
            const { token } = response.data;

            // Cookies.set('authToken', token, { expires: 7 });
            updateAuthToken(token);
            toast.success('خوش آمدید');
            if (!onlyForm) {
                router.push('/');
            }
        } catch (error) {
            toast.error('اطلاعات ورود نادرست است');
        }
    };

    return (
        <form onSubmit={handlePasswordSubmit}>
            <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '12px', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}>
                <div className="text-center mb-5">
                    <img src="/demo/images/login/default.png" alt="Image" height="50" className="mb-3" />
                    <div className="text-900 text-3xl font-medium mb-3">احراز هویت</div>
                </div>

                <div className="w-full">
                    <label htmlFor="otp" className="block text-900 text-md font-medium mb-2">
                        لطفا رمز عبور را وارد کنید
                    </label>
                    <Password type="password" value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} tabIndex={1} className="w-full mb-2 text-right px-0" />
                    <Button raised label="ورود" type="submit" className="w-full border-none ml-5 font-light line-height-2 bg-blue-500 text-white mb-2" />
                    <Button raised label="بازگشت" text className="w-full border-1 border-blue-500 ml-5 font-light line-height-2 bg-white text-blue-500 mb-2" onClick={() => setFormState(1)} />
                </div>
            </div>
        </form>
    );
};

export default CheckPassword;
