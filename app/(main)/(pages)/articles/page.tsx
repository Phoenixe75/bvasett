'use client';
import { IArticles } from '@/app/dashboard/admin/articles/(models)/article';
import { getArticles } from '@/app/dashboard/admin/articles/(services)/article.service';
import moment from 'jalali-moment';
import { ProgressSpinner } from 'primereact/progressspinner';
import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import AppHeader from '@/layout/AppHeader';
import AppFooter from '@/layout/AppFooter';
import AppCopyRight from '@/layout/AppCopyRight';
import Link from 'next/link';

const ArticlePage = () => {
    const [articles, setArticles] = useState<IArticles[]>([]);
    const [isLoading, setLoading] = useState<boolean>(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getArticles();
            setArticles(response);
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

    if (isLoading) {
        return <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />;
    }

    return (
        <>
            <AppHeader />
            <div style={{minHeight:'70dvh'}} id="CardCell" className="pb-4 pt-4 px-4 lg:px-8 mt-2 mx-0 lg:mx-8">
                <div className="grid justify-content-center">
                    <div className="col-12 text-center mt-6 mb-4">
                        {articles.length === 0 ? <h2 className="text-900 font-normal mb-2">مقاله‌ای یافت نشد</h2> :
                        <h2 className="text-900 font-normal mb-2">آخرین مقالات ثبت شده</h2>}
                    </div>
                    {articles?.map((item,index) => {
                        const { date, time } = convertDateTime(item.created);

                        const safeHtml = DOMPurify.sanitize(item.body ?? '');

                        return (
                            <div key={item.id} className="col-12 p-3">
                                <Link href={`/articles/article/${item.id ??index }`}>
                                    <div className="h-full p-3 border-round shadow-2">
                                        <div className="flex align-items-center justify-content-start mb-3 text-900">
                                            <h5>{item.title}</h5>
                                        </div>
                                        <div className="flex align-items-center justify-content-start">
                                            <span className="text-700 p-1 text-md" dangerouslySetInnerHTML={{ __html: safeHtml }} />
                                        </div>
                                        <span className="mb-2 text-600 text-xs">
                                            <div className="flex align-items-center justify-content-end">
                                                تاریخ انتشار: {date} - {time}
                                            </div>
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="py-4 px-8 header_footer_background" >
                <AppFooter />
                <AppCopyRight />
            </div>
        </>
    );
};

export default ArticlePage;
