'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { toast } from 'react-toastify';
import { authenticateStage1 } from '../../api/api';
import { ICheckUser } from '../../(main)/auth/login/(models)/login';
import {useRouter} from 'next/navigation';

const MOBILE_REGEX = /^.{8,20}$/;

interface IProps {
    setFormState: any;
    userData: any;
    setUserData: any;
}

const CheckUser = ({ setFormState, userData, setUserData }: IProps) => {
    const mobileRef = useRef<HTMLInputElement>(null);
    const [mobile, setMobile] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isValidUn, setIsValidUn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        mobileRef.current?.focus();
    }, []);

    useEffect(() => {
        setIsValidUn(MOBILE_REGEX.test(userData));
    }, [userData]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data: ICheckUser = { mobile };

        setLoading(true);
        try {
            const response = await authenticateStage1(data);

            if ([200, 202, 406].includes(response.status)) {
                toast.success('کد ورود ارسال شد');
                setUserData(mobile);
                setFormState(2);
            } else {
                toast.error('خطا در احراز هویت. لطفا دوباره تلاش کنید.');
            }
        } catch (error: any) {
            if (error.response && error.response.status === 406) {
                toast.success('کد ورود ارسال شد)');
                setUserData(mobile);
                setFormState(2);
            } else {
                const errorMessage = error.response?.data?.message || 'خطا در احراز هویت. لطفا دوباره تلاش کنید.';
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '12px', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}>
                <div className="text-center mb-5">
                    <img src="/demo/images/login/default.png" alt="Image" height="50" className="mb-3" />
                    <div className="text-900 text-3xl font-medium mb-3">احراز هویت</div>
                </div>

                <div className="w-full">
                    <label htmlFor="phone-number" className="block text-900 text-md font-medium mb-2">
                        لطفا شماره موبایل خود را وارد کنید
                    </label>
                    <InputText ref={mobileRef} value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="09" className="w-full mb-5 text-left" style={{ padding: '1rem' }} required />
                    <Button raised type="submit" disabled={mobile.length !== 11} className="w-full p-3 text-xl text-center" label="ورود" loading={loading} />
                </div>
              <div className="w-full mt-3">
                ثبت نام در این پلتفرم به منزله پذیرش <Button type="button"
                                                             text
                                                             onClick={() => router.push('/rules_and_regulations')}
                                                             color="primary" className="mx-1 px-1 py-0 d-inline-block">قوانین و مقررات</Button> میباشد
              </div>
            </div>
        </form>
    );
};

export default CheckUser;
