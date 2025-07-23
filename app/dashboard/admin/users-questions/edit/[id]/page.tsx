'use client';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { PageParams } from '@/types/layout';
import { useRouter } from 'next/navigation';
import { IQuestions } from '../../(models)/questions';
import { getQuestion, updateQuestion } from '../../(services)/questions.service';
import { getUser } from '../../../users/(services)/users.service';
import { toast } from 'react-toastify';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { activeOption, approvedOption } from '../../../ads/constant/converter';
import { Button } from 'primereact/button';

const QuestionEditPage: FC<PageParams> = ({ params }: any) => {
    const [formData, setFormData] = useState<IQuestions>({
        active: false,
        approved: false,
        body: '',
        answer: '',
        user: 0
    });
    const [username, setUsername] = useState<string>('');
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
                    const data = await getQuestion(+params.id);
                    setFormData(data);
                    const userId: number = data.user;
                    const getUsername = await getUser(userId);
                    setUsername(getUsername.mobile);
                } else {
                    console.warn('question ID is undefined or null');
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

        try {
            loading.current = true;
            await updateQuestion(+params.id, formData);
            toast.success('بروز‌رسانی شد');
            router.push('../');
        } catch (error) {
            toast.error('بروز‌رسانی با خطا روبرو شد: ');
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
            <h5>ویرایش سوال</h5>
            <hr />
            <form onSubmit={submitForm} className="grid p-fluid mt-6">
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" ref={inputRef} name="body" id="body" value={formData.body} onChange={(e) => setValue('body', e.target.value)} />
                        <label htmlFor="body">متن تیکت</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="answer" id="floors" value={formData.answer || ''} onChange={(e) => setValue('answer', e.target.value)} />
                        <label htmlFor="answer">پاسخ</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="user" value={username || ''} readOnly />
                        <label htmlFor="user">کاربر</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown
                            type="text"
                            name="active"
                            id="active"
                            value={activeOption.find((option) => option.code === formData.active)}
                            onChange={(e) => setValue('active', e.value.code)}
                            options={activeOption}
                            optionLabel="name"
                            placeholder="انتخاب کنید"
                            className="w-full"
                        />
                        <label htmlFor="active">وضعیت سوال</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown
                            type="text"
                            name="approved"
                            id="approved"
                            value={approvedOption.find((option) => option.code === formData.approved)}
                            onChange={(e) => setValue('approved', e.value.code)}
                            options={approvedOption}
                            optionLabel="name"
                            placeholder="انتخاب کنید"
                            className="w-full"
                        />
                        <label htmlFor="approved">وضعیت تایید</label>
                    </span>
                </div>
                <div className="field flex col-12 md:col-2">
                    <Button raised type="submit" label="بروز‌رسانی" className="bg-green-500 text-white border-0 mt-2 ml-2" disabled={loading.current} loading={loading.current} />
                    <Button raised label="بازگشت" type="button" className="bg-gray-300 text-color border-0 mt-2" onClick={back} />
                </div>
            </form>
        </div>
    );
};

export default QuestionEditPage;
