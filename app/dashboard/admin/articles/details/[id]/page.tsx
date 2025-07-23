'use client';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { PageParams } from '@/types/layout';
import { IArticles } from '../../(models)/article';
import { useRouter } from 'next/navigation';
import { getArticle } from '../../(services)/article.service';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';

const DetailsArticlePage: FC<PageParams> = ({ params }: any) => {
    const [article, setArticle] = useState<IArticles | null>(null);
    const [isLoading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const loadAds = useCallback(async () => {
        setLoading(true);
        try {
            const getData: IArticles = await getArticle(+params.id);
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
        <div className="card detailsData">
            <h5>مشاهده مقاله {article?.title || ''}</h5>
            <hr />
            <div className="grid p-fluid mt-6">
                <div className="col-12">
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText type="text" name="title" value={article?.title || ''} readOnly />
                            <label htmlFor="title">عنوان</label>
                        </span>
                    </div>
                </div>
                <div className="field col-12">
                    <span className="p-float-label">
                        <InputTextarea name="body" value={article?.body || ''} style={{ minHeight: 320 }} readOnly />
                        <label htmlFor="body">متن مقاله</label>
                    </span>
                </div>
            </div>
            <div>
                <Button raised label="بازگشت" className="bg-gray-300 text-color border-0 mt-2" onClick={back} />
            </div>
        </div>
    );
};

export default DetailsArticlePage;
