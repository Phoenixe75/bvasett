'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { ITickets } from '../../(models)/tickets';
import { getTicket } from '../../(services)/tickets.service';
import { useRouter } from 'next/navigation';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { getUser } from '../../../users/(services)/users.service';
import { InputNumber } from 'primereact/inputnumber';
import moment from 'jalali-moment';

const TicketDetailPage = ({ params }: any) => {
    const [data, setData] = useState<ITickets | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [username, setUsername] = useState<string>('');
    const router = useRouter();

    const fetchData = useCallback(async () => {
        try {
            const response: ITickets = await getTicket(+params.id);
            setData(response);
            if (response.user != null) {
                const userId: number = response.user;
                const getUsername = await getUser(userId);
                setUsername(getUsername.mobile);
            } else {
                console.warn('User ID is null, cannot fetch username.');
            }
        } catch (error) {
            console.error('Failed to fetch ticket data:', error);
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
            <h5>مشاهده تیکت: {data?.subject || ''}</h5>
            <hr />
            <div className="grid p-fluid mt-6">
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="subject" value={data?.subject || ''} readOnly />
                        <label htmlFor="subject">موضوع</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputTextarea name="body" value={data?.body || ''} readOnly />
                        <label htmlFor="body">متن تیکت</label>
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
                        <InputText type="text" name="answered_at" value={data?.answered_at || ''} readOnly />
                        <label htmlFor="answered_at">تاریخ پاسخ</label>
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
                        <InputNumber type="text" name="answered_by" value={data?.answered_by} readOnly />
                        <label htmlFor="answered_by">پاسخ دهنده</label>
                    </span>
                </div>
            </div>
            <div>
                <Button raised label="بازگشت" className="bg-gray-300 text-color border-0 mt-2" onClick={back} />
            </div>
        </div>
    );
};

export default TicketDetailPage;
