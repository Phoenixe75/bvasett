'use client';
import React, { useCallback, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { toast } from 'react-toastify';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { IQuestions } from '@/app/dashboard/admin/users-questions/(models)/questions';
import { createQuestion } from '../(services)/question.service';

const CreateQuestion: React.FC<any> = ({ visible, onHide, refreshData }) => {
    const [formData, setFormData] = useState<IQuestions>({
        active: true,
        ordering: 1,
        body: '',
        answer: '',
        approved: false
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');

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
            await createQuestion(formData);
            toast.success('سوال ارسال شد در اسرع وقت پاسخ داده میشود');
            onHide();
            refreshData();
        } catch (error) {
            console.error('Error creating question:', error);
            toast.error('بروز‌رسانی با خطا روبرو شد');
        } finally {
            setLoading(false);
        }
    };

    const back = () => {
        onHide();
    };

    return (
        <Dialog header="ارسال سوال جدید" visible={visible} onHide={onHide}>
            <form onSubmit={submitForm} className="grid p-fluid mt-6 detailsData">
                <div className="field col-12 md:col-12">
                    <span className="p-float-label">
                        <InputText name="subject" id="subject" onChange={(e) => setTitle(e.target.value)} />
                        <label htmlFor="subject">عنوان</label>
                    </span>
                </div>
                <div className="field col-12 md:col-12">
                    <span className="p-float-label">
                        <InputTextarea name="body" id="body" onChange={(e) => setValue('body', e.target.value)} rows={5} />
                        <label htmlFor="body">متن سوال</label>
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

export default CreateQuestion;
