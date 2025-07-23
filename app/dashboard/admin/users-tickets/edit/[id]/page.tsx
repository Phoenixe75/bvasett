'use client';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { PageParams } from '@/types/layout';
import { useRouter } from 'next/navigation';
import { ITickets } from '../../(models)/tickets';
import { toast } from 'react-toastify';
import { getTicket, updateTickets } from '../../(services)/tickets.service';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { getUser } from '../../../users/(services)/users.service';
import { activeOption } from '../../../ads/constant/converter';
import { Dropdown } from 'primereact/dropdown';

const TicketEditPage: FC<PageParams> = ({ params }: any) => {
    const [formData, setFormData] = useState<ITickets>({
        active: null,
        subject: '',
        body: '',
        answer: '',
        user: 0
    });
    const [username, setUsername] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
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
                setLoading(true);
                if (params.id != null) {
                    const data = await getTicket(+params.id);
                    setFormData(data);
                    const userId: number = data.user;
                    const getUsername = await getUser(userId);
                    setUsername(getUsername.mobile);
                } else {
                    console.warn('ticket ID is undefined or null');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [params.id]);

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setLoading(true);
            await updateTickets(+params.id, formData);
            toast.success('بروز‌رسانی شد');
            router.push('../');
        } catch (error) {
            toast.error('بروز‌رسانی با خطا روبرو شد: ');
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
            <h5>ویرایش تیکت {formData?.subject}</h5>
            <hr />
            <form onSubmit={submitForm} className="grid p-fluid mt-6">
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" ref={inputRef} name="title" id="title" value={formData.subject} onChange={(e) => setValue('subject', e.target.value)} />
                        <label htmlFor="title">موضوع</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="body" id="body" value={formData.body} onChange={(e) => setValue('body', e.target.value)} />
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
                        <label htmlFor="active">وضعیت تیکت</label>
                    </span>
                </div>
                <div className="field flex col-12 md:col-2"></div>
                <div className="field flex col-12 md:col-2"></div>
                <div className="field flex col-12 md:col-2">
                    <Button raised type="submit" label="بروز‌رسانی" className="bg-green-500 text-white border-0 mt-2 ml-2" disabled={loading} loading={loading} />
                    <Button raised label="بازگشت" type="button" className="bg-gray-300 text-color border-0 mt-2" onClick={back} />
                </div>
            </form>
        </div>
    );
};

export default TicketEditPage;
