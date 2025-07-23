/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import successImg from '../../../../demo/images/success.jpg';
import errorImg from '../../../../demo/images/asset-error.svg';
import Image from 'next/image';
import { ISetting } from '@/app/dashboard/admin/setting/(models)/setting';
import { getActiveSettings } from '@/app/dashboard/admin/setting/(services)/setting.service';
import { ProgressSpinner } from 'primereact/progressspinner';
import defaultImage from '../../../../public/images/def.png';
import { getVerifyBuy } from './(services)/verify.service';
import { toast } from 'react-toastify';
import { IOrderBuyResponse, IVerifyResponse } from '../filterResult/(models)/orderBuy';
import Styles from './verify.module.scss';
const AccessDeniedPage = () => {
    const [data, setData] = useState<ISetting>();
    const [verify, setVerify] = useState<IVerifyResponse>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
    const router = useRouter();
    const searchParams = useSearchParams()
    const Authority = searchParams.get('Authority') || '';
    const Status = searchParams.get('Status') || '';
    
    const fetchLogo = async () => {
        setIsLoading(true);
        try {
            const res = await getActiveSettings();
            setData(res);
        } catch (error) {
            console.log('خطا در دریافت تنظیمات');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchData = async () => {
        setIsDataLoading(true);
        try {
            const res = await getVerifyBuy({Authority,Status});
            setVerify(res);
        } catch (error) {
            toast.error('خطا در دریافت اطلاعات پرداخت');
        } finally {
            setIsDataLoading(false);
        }
    };

    useEffect(() => {
        fetchLogo();
        fetchData();
    }, []);
    const isAd = verify?.type === 'ad';
    const onGoToDashboardClick = () => {
        if(isAd) {
           router.push('/dashboard/user/my-payments')
        }else {
           router.push('/dashboard/user/my-subscriptions')
        }
    }
    if (isLoading || isDataLoading) return <ProgressSpinner style={{ width: '50px', height: '50px' }} />;
 
    return (
        <div className="surface-ground flex align-items-center justify-content-center min-h-screen overflow-hidden">
            <div className="flex flex-column align-items-center justify-content-center">
                <Image src={data?.logo && typeof data?.logo === 'string' ? data?.logo : defaultImage} alt="logo" width={50} height={50} style={{ objectFit: 'cover' }} />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: verify?.status === 1 ? 'linear-gradient(180deg, rgb(66, 175, 60) 10%, rgba(247, 149, 48, 0) 30%)' : 'linear-gradient(180deg, rgb(255, 0, 0) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center" style={{ borderRadius: '53px' }}>
                        {verify?.status === 1 ? (
                            <>
                                <div className="flex justify-content-center align-items-center">
                                    <Image src={successImg} alt="success" width={100} height={100} className="mb-5" />
                                </div>
                                <h1 className="text-900 font-bold text-5xl mb-6">پرداخت با موفقیت انجام شد</h1>
                                {isAd ?<> <div className="text-600 mb-5">کارشناسان ما پس از بررسی فایل‌های شما آن را تایید کرده</div>
                                    <div className="text-600 mb-5"> و شما می‌توانید از قسمت پنل کاربری بخش سفارشات آنها را مشاهده نمایید</div>
                                </> : <> 
                                    <div className="text-600 mb-5">  شما می‌توانید از قسمت پنل کاربری بخش اشتراک‌ها آنها را مشاهده نمایید</div>
                                </> }
                            </>
                        ) : (
                            <>
                                <div className="flex justify-content-center align-items-center bg-red-500 border-circle" style={{ height: '3.2rem', width: '3.2rem' }}>
                                    <i className="pi pi-fw pi-exclamation-circle text-2xl text-white"></i>
                                </div>
                                <h1 className="text-900 font-bold text-5xl mb-6">خطا در عملیات پرداخت</h1>
                                <div className="text-600 mb-5">متاسفانه پرداخت شما انجام نشد</div>
                                <Image src={errorImg} alt="error" width={200} height={90} className="mb-5" />
                            </>
                        )}
                        <Button raised className={Styles.desktop} icon="pi pi-arrow-left mr-2" label={isAd ? "بازگشت به صفحه سفارشات" : 'بازگشت به صفحه اشتراک‌ها'} iconPos="right" text onClick={onGoToDashboardClick} />
                        <Button raised className={Styles.mobile} icon="pi pi-arrow-left mr-2" label="بازگشت به اپلیکیشن" iconPos="right" text onClick={() =>  window.location.href = 'deeplink://amlak'} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessDeniedPage;
