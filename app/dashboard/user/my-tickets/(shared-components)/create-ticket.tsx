'use client';
import React, { useCallback, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { toast } from 'react-toastify';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ITickets } from '@/app/dashboard/admin/users-tickets/(models)/tickets';
import { useUserContext } from '@/layout/context/usercontext';
import { InputTextarea } from 'primereact/inputtextarea';
import { createMyTicket } from '../(services)/my-ticket.service';

const CreateTicket: React.FC<any> = ({ visible, onHide, refreshData }) => {
    const { user } = useUserContext();
    const [formData, setFormData] = useState<ITickets>({
        ordering: 1,
        subject: '',
        body: '',
        answer: '',
        user: user?.id!
    });
    const [loading, setLoading] = useState<boolean>(false);

    const setValue = useCallback((fieldName: string, fieldValue: any) => {
        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: fieldValue
        }));
    }, []);

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createMyTicket(formData);
            toast.success('تیکت ارسال شد در اسرع وقت پاسخ داده میشود');
            onHide();
            refreshData();
        } catch (error) {
            console.error('Error creating ticket:', error);
            toast.error('بروز‌رسانی با خطا روبرو شد');
        } finally {
            setLoading(false);
        }
    };

    const back = () => {
        onHide();
    };

    return (
        <Dialog header="ارسال تیکت جدید" visible={visible} onHide={onHide}>
            <form onSubmit={submitForm} className="grid p-fluid mt-6 detailsData">
                <div className="field col-12 md:col-12">
                    <span className="p-float-label">
                        <InputText name="subject" id="subject" onChange={(e) => setValue('subject', e.target.value)} />
                        <label htmlFor="subject">عنوان</label>
                    </span>
                </div>
                <div className="field col-12 md:col-12">
                    <span className="p-float-label">
                        <InputTextarea name="body" id="body" onChange={(e) => setValue('body', e.target.value)} rows={5} />
                        <label htmlFor="body">متن تیکت</label>
                    </span>
                </div>
                <div className="field flex col-12 ">
                    <Button raised type="submit" label="ثبت" className="bg-green-500 text-white border-0 mt-2 ml-2" disabled={loading} loading={loading} />
                    <Button raised label="بازگشت" type="button" className="bg-gray-300 text-color border-0 mt-2" onClick={back} />
                </div>
            </form>
        </Dialog>
    );
};

export default CreateTicket;
