'use client';
import React, { useCallback, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useUserContext } from '@/layout/context/usercontext';
import { ITickets } from '@/app/dashboard/admin/users-tickets/(models)/tickets';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { toast } from 'react-toastify';
import { createMyTicket } from '@/app/dashboard/user/my-tickets/(services)/my-ticket.service';

export default function Ticket() {
    const { user } = useUserContext();
    const [formData, setFormData] = useState<ITickets>({
        ordering: 1,
        subject: '',
        body: '',
        answer: '',
        user: user?.id || null
    });
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const setValue = useCallback((fieldName: string, fieldValue: any) => {
        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: fieldValue
        }));
    }, []);

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user) {
            toast.error('جهت ثبت تیکت لطفا وارد حساب کاربری خود شوید');
            setTimeout(() => {
                router.push('/auth/login');
            }, 3000);
            return;
        }

        const ticketData = {
            ...formData,
            user: user.id
        };

        try {
            await createMyTicket(ticketData);
            toast.success('تیکت ارسال شد در اسرع وقت پاسخ داده میشود');
        } catch (error) {
            console.error('Error creating ticket:', error);
            toast.error('بروز‌رسانی با خطا روبرو شد');
        } finally {
            setLoading(false);
        }
    };

    // style={{ backgroundColor: '#fed978' }}
    return (
        <form onSubmit={submitForm} className=" p-4 border-round shadow-2 w-full mt-2 customBox">
            <div className="field grid">
                <label htmlFor="subject" className="col-12 text-sm font-medium mb-2 text-800">
                    عنوان
                </label>
                <div className="col-12">
                    <InputText id="subject" name="subject" type="text" value={formData.subject || ''} onChange={(e) => setValue('subject', e.target.value)} required className="w-full p-inputtext" />
                </div>
            </div>
            <div className="field grid">
                <label htmlFor="body" className="col-12 text-sm font-medium mb-2 text-800">
                    متن تیکت
                </label>
                <div className="col-12">
                    <InputTextarea id="body" name="body" value={formData.body || ''} onChange={(e) => setValue('body', e.target.value)} required className="w-full p-inputtextarea" rows={6} />
                </div>
            </div>
            <div className="grid">
                <div className="col-12 flex justify-content-end">
                    <Button raised type="submit" label={loading ? 'در حال ارسال...' : 'ارسال تیکت'} className="customBtn w-auto border-0" disabled={loading} />
                </div>
            </div>
        </form>
    );
}
