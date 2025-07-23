'use client';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { PageParams } from '@/types/layout';
import { useRouter } from 'next/navigation';
import { IReplayPageTicket } from '../../(models)/tickets';
import { toast } from 'react-toastify';
import { getTicket, replayTicket } from '../../(services)/tickets.service';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { getUser } from '../../../users/(services)/users.service';
import { InputTextarea } from 'primereact/inputtextarea';

const ReplayPage: FC<PageParams> = ({ params }: any) => {
    const [ticket, setTicket] = useState<any>({
        subject: '',
        body: ''
    });
    const [formData, setFormData] = useState<IReplayPageTicket>({
        answer: '',
        user: 0
    });
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const setValue = useCallback((fieldName: string, fieldValue: any) => {
        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: fieldValue
        }));
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                if (params.id) {
                    const data = await getTicket(+params.id);
                    setTicket(data);

                    const userId: number = data.user;
                    const getUsername = await getUser(userId);

                    setFormData({
                        answer: data.answer || '',
                        user: getUsername.id
                    });
                } else {
                    console.warn('ticket ID is undefined or null');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('خطا در بارگذاری اطلاعات');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [params.id]);

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await replayTicket(+params.id, formData);
            toast.success('پاسخ ثبت شد');
            router.push('../');
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('پاسخ شما با خطا روبرو شد');
        } finally {
            setLoading(false);
        }
    };

    const back = () => {
        router.push('../');
    };

    if (loading) {
        return <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />;
    }

    return (
        <div className="card detailsData">
            <h5>پاسخ به تیکت {ticket.subject}</h5>
            <hr />
            <form onSubmit={submitForm} className="grid p-fluid mt-6">
                <div className="col-12">
                    <div className="field col-12 md:col-6">
                        <span className="p-float-label">
                            <InputText type="text" name="title" id="title" value={ticket.subject} readOnly />
                            <label htmlFor="title">موضوع</label>
                        </span>
                    </div>
                </div>
                <div className="col-12">
                    <div className="field col-12 md:col-6">
                        <span className="p-float-label">
                            <InputTextarea name="body" id="body" value={ticket.body} readOnly rows={6} />
                            <label htmlFor="body">متن تیکت</label>
                        </span>
                    </div>
                </div>
                <div className="col-12">
                    <div className="field col-12 md:col-6">
                        <span className="p-float-label">
                            <InputTextarea name="answer" id="answer" value={formData.answer || ''} onChange={(e) => setValue('answer', e.target.value)} rows={6} required />
                            <label htmlFor="answer">پاسخ</label>
                        </span>
                    </div>
                </div>
                <div className="field flex col-12 md:col-2"></div>
                <div className="field flex col-12 md:col-2"></div>
                <div className="col-12"></div>
                <div className="field flex col-12 md:col-2">
                    <Button raised type="submit" label="بروز‌رسانی" className="bg-green-500 text-white border-0 mt-2 ml-2" disabled={loading} loading={loading} />
                    <Button raised label="بازگشت" type="button" className="bg-gray-300 text-color border-0 mt-2" onClick={back} />
                </div>
            </form>
        </div>
    );
};

export default ReplayPage;
