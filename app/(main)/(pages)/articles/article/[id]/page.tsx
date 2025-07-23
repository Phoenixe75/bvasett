'use client';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { PageParams } from '@/types/layout';
import { IArticle } from '@/app/dashboard/admin/articles/(models)/article';
import { useRouter } from 'next/navigation';
import { getArticle } from '@/app/dashboard/admin/articles/(services)/article.service';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import AppHeader from '@/layout/AppHeader';
import AppFooter from '@/layout/AppFooter';
import AppCopyRight from '@/layout/AppCopyRight';

const ArticlePage: FC<PageParams> = ({ params }: any) => {
    const [article, setArticle] = useState<IArticle | null>(null);
    const [isLoading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const loadAds = useCallback(async () => {
        setLoading(true);
        try {
            const getData: IArticle = await getArticle(+params.id);
            setArticle(getData);
        } catch (error) {
            console.error('Failed to load article', error);
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        loadAds();
    }, [loadAds]);

    const back = (): void => {
        router.push('../');
    };

    if (isLoading) {
        return <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />;
    }

    return (
        <>
            <AppHeader />
            <div className="card detailsData" style={{ minHeight: 'calc(100vh - 405px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                    <h4>{article?.title || ''}</h4>
                    <div className="card grid p-fluid mt-6">
                        <div className="col-12 lineCustom">
                            <div dangerouslySetInnerHTML={{ __html: article?.body || '' }} />
                        </div>
                    </div>
                </div>
                <div className="flex justify-content-end">
                    <Button raised label="بازگشت" className="bg-gray-300 text-color border-0 mt-2" onClick={back} />
                </div>
            </div>
            <div className="py-4 px-8 md:absolute md:bottom-0 w-full header_footer_background" >
                <AppFooter />
                <AppCopyRight />
            </div>
        </>
    );
};

export default ArticlePage;
