'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ITickets } from '../(models)/tickets';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { createMyTicket } from '@/app/dashboard/user/my-tickets/(services)/my-ticket.service';

const CreateTikectPage = () => {
    const [formData, setFormData] = useState<ITickets>({
        active: true,
        ordering: 1,
        subject: '',
        body: '',
        answer: null,
        user: 0,
        answered_by: null
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
        try {
            loading.current = true;
            await createMyTicket(formData);
            toast.success('تیکت ثبت شد');
            router.push('./');
        } catch (error) {
            toast.error('ثبت تیکت با خطا روبرو شد');
            console.error('Failed to create Ticket:', error);
        } finally {
            loading.current = false;
        }
    };

    const back = (): void => {
        router.push('./');
    };

    return (
        <div className="card detailsData">
            <h5>ثبت آگهی</h5>
            <hr />
            <form onSubmit={submitForm} className="grid p-fluid mt-6">
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" ref={inputRef} name="subject" id="subject" value={formData.subject} onChange={(e) => setValue('subject', e.target.value)} required />
                        <label htmlFor="subject">موضوع</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="body" id="body" value={formData.body} onChange={(e) => setValue('body', e.target.value)} />
                        <label htmlFor="body">متن تیکت</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4"></div>
                <div className="field col-12 md:col-4"></div>
                <div className="field flex col-12 md:col-2">
                    <Button raised type="submit" label="ثبت" className="bg-green-500 text-white border-0 mt-2 ml-2" disabled={loading.current} loading={loading.current} />
                    <Button raised label="بازگشت" type="button" className="bg-gray-300 text-color border-0 mt-2" onClick={back} />
                </div>
            </form>
        </div>
    );
};

export default CreateTikectPage;
