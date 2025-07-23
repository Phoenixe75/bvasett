'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IArticle } from '../(models)/article';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Editor } from 'primereact/editor';
import { createArticle } from '../(services)/article.service';
import { Dropdown } from 'primereact/dropdown';
import { activeOption } from '../../ads/constant/converter';

const CreateArticlePage = () => {
    const [formData, setFormData] = useState<IArticle>({
        active: null,
        title: '',
        body: '',
        ordering: 0
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

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.title || !formData.body) {
            toast.error('لطفاً تمام فیلدها را پر کنید');
            return;
        }

        loading.current = true;
        try {
            await createArticle(formData);
            toast.success('مقاله ثبت شد');
            router.push('./');
        } catch (error) {
            toast.error('ثبت مقاله با خطا روبرو شد');
            console.error('Failed to create article:', error);
        } finally {
            loading.current = false;
        }
    };

    const back = (): void => {
        router.push('./');
    };

    return (
        <div className="card detailsData">
            <h5>ثبت مقاله</h5>
            <hr />
            <form onSubmit={submitForm} className="grid p-fluid mt-6">
                <div className="col-12 flex">
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText type="text" ref={inputRef} name="title" id="title" autoComplete="off" value={formData.title ?? ''} onChange={(e) => setValue('title', e.target.value)} required />
                            <label htmlFor="title">عنوان</label>
                        </span>
                    </div>
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <Dropdown value={activeOption.find((option) => option.code === formData.active)} onChange={(e) => setValue('active', e.value.code)} options={activeOption} optionLabel="name" placeholder="انتخاب کنید" className="w-full" />
                            <label htmlFor="active">وضعیت مقاله</label>
                        </span>
                    </div>
                    {/* <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText type="text" name="slug" id="slug" autoComplete="off" value={formData.slug || ''} onChange={(e) => setValue('slug', e.target.value)} required />
                            <label htmlFor="slug">شناسه</label>
                        </span>
                    </div> */}
                </div>
                <div className="col-12">
                    <div className="field col-12">
                        <label htmlFor="body">متن مقاله</label>
                        <Editor dir="ltr" value={formData.body || ''} onTextChange={(e) => setValue('body', e.htmlValue)} style={{ minHeight: '320px' }} required />
                    </div>
                </div>
                <div className="col-12">
                    <div className="field flex col-12 md:col-2 ">
                        <Button raised type="submit" label="ثبت" className="bg-green-500 text-white border-0 mt-2 ml-2" disabled={loading.current} loading={loading.current} />
                        <Button raised label="بازگشت" type="button" className="bg-gray-300 text-color border-0 mt-2" onClick={back} />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateArticlePage;
