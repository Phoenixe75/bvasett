'use client';
import { IArticles } from '@/app/dashboard/admin/articles/(models)/article';
import{ getArticles } from '@/app/dashboard/admin/articles/(services)/article.service';
import moment from 'jalali-moment';
import { ProgressSpinner } from 'primereact/progressspinner';
import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import AppHeader from '@/layout/AppHeader';
import AppFooter from '@/layout/AppFooter';
import AppCopyRight from '@/layout/AppCopyRight';
import Link from 'next/link';
import InfoDetail from './(components)/infoDetail/InfoDetail';
import styles from "./subscriptions.module.scss"
import { classNames } from 'primereact/utils';
import { getSubscriptionPlans } from './(services)/subscriptions.service';
import { SubscriptionPlanItem } from './(models)/subscription.model';
import LoadingPage from '@/app/components/LoadingPage';
import SubscrptionCard from './(components)/SubscrptionCard/SubscrptionCard';
const initialData:SubscriptionPlanItem = {
active:true,
created: '',
description: ['قابل استفاده برای کاربران جدید', 'قابلیت مشاهده 7 فایل انتخابی به صورت رایگان', 'فعال بر روی تمامی معاملات خرید و فروش / رهن / اجاره'],
duration_days: 0,
id: 0,
name: 'معمولی',
ordering: 0,
price: 'رایگان'
}

const SubscriptonsPage = () => {
    const [subscrptionPlans, setSubscriptionPlans] = useState<SubscriptionPlanItem[]>([]);
    const [isLoading, setLoading] = useState<boolean>(false);
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getSubscriptionPlans();
            setSubscriptionPlans([initialData,...response]);
        } catch (error) {
            console.error('Error retrieving articles:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const convertDateTime = (dateString: string | null | undefined) => {
        if (!dateString) {
            return { date: 'Invalid Date', time: 'Invalid Time' };
        }

        const jalaaliDate = moment(dateString);
        const date = jalaaliDate.format('jYYYY/jM/jD');
        const time = jalaaliDate.format('HH:mm');
        return { date, time };
    };


    return (
        <LoadingPage isLoading={isLoading}>
            <AppHeader />
            <div style={{minHeight:'80dvh'}} className={classNames(styles.wrapper,"flex justify-content-center aling-items-center")}>
              <InfoDetail />
              <div className='flex-1 flex flex-column align-items-center justify-content-center p-5'>
                 <h1>با <span>بی واسط</span> ، به مالک وصل شو، نه به واسطه!</h1>
                 <h4>
                 بدون حضور واسطه‌ها، با امکان ثبت مستقیم ملک توسط مالکین.
                 </h4>
                 <div style={{gap:"53px"}} className='flex-1 w-full flex justify-content-center flex-no-wrap mt-4'>
                    {subscrptionPlans.map((item,index) => <SubscrptionCard data={item} key={index}/>)}
                 </div>
              </div>
            </div>
            <div className="py-4 px-8 header_footer_background" >
                <AppFooter />
                <AppCopyRight />
            </div>
        </LoadingPage>
    );
};

export default SubscriptonsPage;
