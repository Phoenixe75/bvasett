'use client';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { PageParams } from '@/types/layout';
import { IArticles } from '../../(models)/article';
import { useRouter } from 'next/navigation';
import { getArticle, updateArticle } from '../../(services)/article.service';
import { toast } from 'react-toastify';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const EditArticlePage: FC<PageParams> = ({ params }: any) => {
    const [formData, setFormData] = useState<IArticles>({
        id: 0,
        title: '',
        body: null,
        ordering: null
    });
    const inputRef = useRef<HTMLInputElement>(null);
    const loading = useRef(false);
    const router = useRouter();

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    const setValue = useCallback((fieldName: string, fieldValue: any) => {
        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: fieldValue
        }));
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                loading.current = true;
                if (params.id != null) {
                    const data = await getArticle(+params.id);
                    setFormData(data);
                } else {
                    console.warn('Article ID is undefined or null');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Error fetching data');
            } finally {
                loading.current = false;
            }
        };

        fetchInitialData();
    }, [params.id]);

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        loading.current = true;

        try {
            if (formData.id) {
                await updateArticle(formData.id, formData);
                toast.success('بروز‌رسانی شد');
            }
        } catch (error) {
            console.error('Error updating package:', error);
            toast.error('بروز‌رسانی با خطا روبرو شد');
        } finally {
            loading.current = false;
        }
    };

    const back = () => {
        router.push('../');
    };

    if (loading.current) {
        return <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />;
    }

    return (
        <div className="card detailsData">
            <h5>ویرایش مقاله</h5>
            <hr />
            <form onSubmit={submitForm} className="grid p-fluid mt-6">
                <div className="col-12">
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText type="text" ref={inputRef} name="title" id="title" autoComplete="off" value={formData.title || ''} onChange={(e) => setValue('title', e.target.value)} />
                            <label htmlFor="title">عنوان</label>
                        </span>
                    </div>
                </div>
                <div className="field col-12">
                    <span className="p-float-label">
                        <InputTextarea autoComplete="off" value={formData.body || ''} onChange={(e) => setValue('body', e.target.value)} style={{ minHeight: 320 }} />
                        <label htmlFor="body">متن مقاله</label>
                    </span>
                </div>
                <div className="col-12">
                    <div className="field flex col-12 md:col-2">
                        <Button raised type="submit" label="بروز‌رسانی" className="bg-green-500 text-white border-0 mt-2 ml-2" disabled={loading.current} loading={loading.current} />
                        <Button raised label="بازگشت" type="button" className="bg-gray-300 text-color border-0 mt-2" onClick={back} />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditArticlePage;
