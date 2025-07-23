'use client';
import React from 'react';
import Head from 'next/head';
import AppHeader from '@/layout/AppHeader';
import AppFooter from '@/layout/AppFooter';
import AppCopyRight from '@/layout/AppCopyRight';

const About = () => {
    return (
        <>
            <AppHeader />
            <div className="flex flex-column pt-4 px-4 lg:px-8 overflow-hidden lg:block">
                <div
                    id="Carousel"
                    className="flex flex-column pt-4 px-4 lg:px-8 overflow-hidden lg:block mb-8"
                    style={{
                        maxWidth: '1600px',
                        margin: '0 auto'
                    }}
                >
                    <div className="p-d-flex p-dir-column p-ai-center p-jc-center p-mt-5">
                        <Head>
                            <title>درباره ما</title>
                            <meta name="description" content="درباره ما در شرکت املاک" />
                        </Head>

                        <main className="p-p-3 p-max-w-800 p-shadow-2 p-border-round">
                            <h1 className="p-text-2xl p-mb-4">درباره ما</h1>
                            <div className="w-full flex justify-content-center">
                                <h1>به نام خدا</h1>
                            </div>
                            <h4 className="p-text-lg p-mb-3 text-bold">
                                ما بی واسط هستیم... (<p style={{ color: 'red', display: 'inline' }}>دلال</p> نیستیم)
                            </h4>
                            <h5 style={{ color: 'red' }}> حذف کمیسیون, ارتباط مستقیم بین خریدار,مستاجر و مالک,قیمت واقعی</h5>
                            <p>
                                تیم بی واسط در راستای هدف گذاری به جهت صاحبین ملک,خریداران و مستاجران محترم به منظور کارایی و اعتماد بیشتر بر آن شدیم با تحقیق و بررسی فراوان راهکاری اتخاذ کنیم تحت عنوان استارتاپ بی واسط که با حذف کمیسیون,قیمت واقعی و
                                عکس های واقعی توسط سایت و اپلیکیشن بی واسط جهت تسهیل خانه دار شدن شما عزیزان.
                            </p>
                            <p>هدف ما ارتباط مستقیم بین خریدار و فروشنده,موجر و مستاجر بدون پرداخت کمیسیون با قیمت واقعی و ارسال عکس های واقعی توسط مالکین به مصرف کنندگان میباشد.</p>
                            <p>این تیم با طراحی مراحل ساده و جای گذاری فیلتر های مختلف برای تنظیم موارد علاقه ی شما برای پیدا کردن خانه ی جدید به نزدیک ترین حالت به سلیقه ی شما عزیزان در کناره شماست.</p>

                            <h2 className="p-text-xl p-mt-5">خدمات سایت </h2>
                            <ul className="p-list-none p-mt-2 p-p-0">
                                <li className="p-text-lg p-mb-2">ارتباط مستقیم مشتری با مالکین
                                </li>
                                <li className="p-text-lg p-mb-2">ثبت آگهی رایگان</li>
                                <li className="p-text-lg p-mb-2">تایید و احراز مالکیت از طریق سامانه </li>
                                <li className="p-text-lg p-mb-2">استعلام به لحظه موجودیت ملک
                                </li>
                                <li className="p-text-lg p-mb-2">جست و جوی آسان ملک با فیلتر های شخصی و مورد نظر</li>
                                <li className="p-text-lg p-mb-2">بارگذاری اطلاعات و مقالات عمومی و تخصصی</li>
                                <li className="p-text-lg p-mb-2">ارائه اخبار روز مسکن</li>
                                </ul>
                        </main>
                    </div>
                </div>
            </div>
            <div className="py-4 px-8 header_footer_background">
                <AppFooter />
                <AppCopyRight />
            </div>
        </>
    );
};

export default About;
