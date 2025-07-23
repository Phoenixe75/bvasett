'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { IQuestions } from '../../(models)/questions';
import { useRouter } from 'next/navigation';
import { getUser } from '../../../users/(services)/users.service';
import moment from 'jalali-moment';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { getQuestion } from '../../(services)/questions.service';
import { Dropdown } from 'primereact/dropdown';
import { activeOption } from '../../../ads/constant/converter';

const QuestionDetailPage = ({ params }: any) => {
    const [data, setData] = useState<IQuestions | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [username, setUsername] = useState<string>('');
    const [approvedName, setApprovedName] = useState<string>('');
    const [answeredName, setAnsweredName] = useState<string>('');
    const router = useRouter();

    const fetchData = useCallback(async () => {
        try {
            const response: IQuestions = await getQuestion(+params.id);
            setData(response);

            if (response.approved_by) {
                const userId: number = response.approved_by;
                const getUsername = await getUser(userId);
                setApprovedName(getUsername.mobile);
            }
            if (response.answered_by) {
                const userId: number = response.answered_by;
                const getUsername = await getUser(userId);
                setAnsweredName(getUsername.mobile);
            }
            if (response.user) {
                const userId: number = response.user;
                const getUsername = await getUser(userId);
                setUsername(getUsername.mobile);
            } else {
                console.warn('User ID is undefined in the response');
            }
        } catch (error) {
            console.error('Failed to fetch question data:', error);
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const back = (): void => {
        router.push('../');
    };

    const formatDate = (dateString: string) => {
        return moment(dateString).format('jYYYY/jM/jD - HH:mm');
    };

    if (loading) return <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />;

    return (
        <div className="card detailsData">
            <h5>مشاهده سوال </h5>
            <hr />
            <div className="grid p-fluid mt-6">
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputTextarea name="body" value={data?.body || ''} readOnly />
                        <label htmlFor="body">متن سوال</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputTextarea name="answer" value={data?.answer || ''} readOnly />
                        <label htmlFor="answer">متن پاسخ</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="approved_by" value={approvedName} readOnly />
                        <label htmlFor="approved_by">تایید کننده</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="answered_by" value={answeredName} readOnly />
                        <label htmlFor="answered_by">پاسخ دهنده</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="created" value={data?.created ? formatDate(data.created) : ''} readOnly />
                        <label htmlFor="created">تاریخ ایجاد</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="modified" value={data?.modified ? formatDate(data.modified) : ''} readOnly />
                        <label htmlFor="modified">تاریخ ویرایش</label>
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
                        <InputText type="text" name="approved_at" value={data?.approved_at ? formatDate(data.approved_at) : ''} readOnly />
                        <label htmlFor="approved_at">زمان تایید</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown type="text" name="active" id="active" value={activeOption.find((option) => option.code === data?.active) || null} options={activeOption} optionLabel="name" placeholder="انتخاب کنید" className="w-full" readOnly />
                        <label htmlFor="active">وضعیت سوال</label>
                    </span>
                </div>
            </div>
            <div>
                <Button raised label="بازگشت" className="bg-gray-300 text-color border-0 mt-2" onClick={back} />
            </div>
        </div>
    );
};

export default QuestionDetailPage;
