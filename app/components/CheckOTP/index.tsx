'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { toast } from 'react-toastify';
import { IVerifyOtp } from '@/app/(main)/auth/login/(models)/login';
import { authenticateStage2 } from '@/app/api/api';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/layout/context/usercontext';

interface IProps {
    setFormState: any;
    userData: any;
    onlyForm?: boolean;
}

const CheckOTP = ({ setFormState, userData,onlyForm }: IProps) => {
    const codeRef = useRef<InputNumber>(null);
    const [otp, setOtp] = useState<any>(null);
    const router = useRouter();
    const { updateAuthToken } = useUserContext();

    useEffect(() => {
        codeRef.current?.focus();
    }, []);

    const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data: IVerifyOtp = { mobile: userData, code: otp! };

        try {
            const response = await authenticateStage2(data);
            const { token } = response.data;

            // Cookies.set('authToken', token, { expires: 7 });

            updateAuthToken(token);
            toast.success('خوش آمدید');
            if (!onlyForm) {
                router.push('/');
            }
        } catch (error) {
            toast.error('کد تایید نادرست است');
        }
    };

    return (
        <form onSubmit={handleOtpSubmit}>
            <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '12px', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}>
                <div className="text-center mb-5">
                    <img src="/demo/images/login/default.png" alt="Image" height="50" className="mb-3" />
                    <div className="text-900 text-3xl font-medium mb-3">احراز هویت</div>
                </div>

                <div className="w-full">
                    <label htmlFor="otp" className="block text-900 text-md font-medium mb-2">
                        لطفا کد تایید را وارد کنید
                    </label>
                    <label>کد تایید برای شماره {userData} پیامک شد</label>

                    <InputNumber
                        id="otp"
                        ref={codeRef}
                        value={otp}
                        onValueChange={(e: InputNumberValueChangeEvent) => setOtp(e.value)}
                        placeholder="کد تایید را وارد کنید"
                        className="w-full mb-2 text-left px-0"
                        style={{ padding: '1rem' }}
                        useGrouping={false}
                        required
                    />
                    <Button raised type="submit" label="تایید" className="w-full text-center mb-4" />
                </div>
                <label onClick={() => setFormState(3)} className="font-medium no-underline mt-2 text-right cursor-pointer text-blue-500">
                    ورود با رمز عبور
                </label>
                {" "}
                {!onlyForm && <label onClick={() => setFormState(1)} className="font-medium no-underline mt-2 text-right cursor-pointer text-blue-500 block">
                    اصلاح شماره
                </label>}
            </div>
        </form>
    );
};

export default CheckOTP;
