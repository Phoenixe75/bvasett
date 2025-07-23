import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import React, { useCallback, useState } from 'react';
import {PostSubscriptionPlan } from '../(models)/planManager.models';
import { createPackage } from '../(services)/packages.service';
import { toast } from 'react-toastify';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { purposeOption } from '../../ads/constant/converter';
import { Checkbox } from 'primereact/checkbox';

const CreatePackage: React.FC<any> = ({ visible, onHide, refreshData }) => {
    const [formData, setFormData] = useState<PostSubscriptionPlan>({
        active: false,
        description: '',
        duration_days: 0,
        name: "",
        price: ''
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
            await createPackage(formData);
            toast.success('اشتراک ثبت شد');
            onHide();
            refreshData();
        } catch (error) {
            console.error('Error creating package:', error);
            toast.error('بروز‌رسانی با خطا روبرو شد');
        } finally {
            setLoading(false);
        }
    };

    const back = () => {
        onHide();
    };
    
    return (
        <Dialog header="ایجاد اشتراک جدید" visible={visible} onHide={onHide}>
            <form onSubmit={submitForm} className="grid p-fluid mt-6 detailsData">
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputText value={formData.name} required name="name" id="name" onChange={(e) => setValue('name', e.target.value)} />
                        <label htmlFor="name">نام اشتراک</label>
                    </span>
                </div>
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputText value={formData.description} required name="description" id="description" onChange={(e) => setValue('description', e.target.value)} />
                        <label htmlFor="description">توضیحات</label>
                    </span>
                </div>
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputNumber value={formData.duration_days}  required name="duration_days" id="duration_days" onValueChange={(e) => setValue('duration_days', e.value)} />
                        <label htmlFor="duration_days">مدت اشتراک</label>
                    </span>
                </div>
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputNumber value={Number(formData.price)}  required name="price" id="price" onChange={(e) => setValue('price', e.value)} />
                        <label htmlFor="price">قیمت</label>
                    </span>
                </div>
                <div className="field col-12 md:col-6">
                    <span className="flex align-items-center">
                    <Checkbox onChange={e => setValue('active',e.checked)} checked={formData.active}></Checkbox>
                        <label className='mr-2' htmlFor="active">فعال</label>
                    </span>
                </div>
                <div className="field flex col-12 md:col-4">
                    <Button raised type="submit" label="ثبت" className="bg-green-500 text-white border-0 mt-2 ml-2" disabled={loading} loading={loading} />
                    <Button raised label="بازگشت" type="button" className="bg-gray-300 text-color border-0 mt-2" onClick={back} />
                </div>
            </form>
        </Dialog>
    );
};

export default CreatePackage;
