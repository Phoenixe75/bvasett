'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Discount } from '../(models)/discounts';
import { InputNumber } from 'primereact/inputnumber';
import { updateDiscount } from '../(services)/packages.service';
import { toast } from 'react-toastify';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';
import { purposeOption } from '../../ads/constant/converter';

const EditPackage: React.FC<any> = ({ visible, onHide, packageData, refreshData }) => {
    const [formData, setFormData] = useState<Discount>({
        id: packageData?.id || 0,
        fixed_amount: packageData?.fixed_amount || 0,
        minimum_selected_ads: packageData?.minimum_selected_ads || '',
        percentage: packageData?.percentage || 0
    });
    const [loading, setLoading] = useState<boolean>(false);

    const setValue = (fieldName: string, fieldValue: any) => {
        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: fieldValue
        }));
    };

    useEffect(() => {
        console.log({packageData})
        if (packageData) {
            setFormData({
                id: packageData.id,
                minimum_selected_ads: packageData.minimum_selected_ads,
                fixed_amount: packageData.fixed_amount,
                percentage: packageData.percentage
            });
        }
    }, [packageData]);

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (formData.id) {
                await updateDiscount(formData.id, formData);
                toast.success('بروز‌رسانی شد');
                onHide();
                refreshData();
            }
        } catch (error) {
            console.error('Error updating package:', error);
            toast.error('بروز‌رسانی با خطا روبرو شد');
        } finally {
            setLoading(false);
        }
    };

    const back = () => {
        onHide();
    };
    if (loading) {
        return <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />;
    }

    return (
        <Dialog header="ویرایش قیمت‌گذاری" visible={visible} onHide={onHide}>
              <form onSubmit={submitForm} className="grid p-fluid mt-6 detailsData">
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputNumber value={formData.minimum_selected_ads} required name="minimum_selected_ads" id="minimum_selected_ads" onValueChange={(e) => setValue('minimum_selected_ads', e.value)} />
                        <label htmlFor="minimum_selected_ads">حداقل آگهی انتخابی</label>
                    </span>
                </div>
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputNumber value={formData.percentage} name="percentage" id="percentage" onValueChange={(e) => setValue('percentage', e.value)} />
                        <label htmlFor="percentage">درصد تخفیف اعمالی</label>
                    </span>
                </div>
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputNumber value={formData.fixed_amount} name="fixed_amount" id="fixed_amount" onChange={(e) => setValue('fixed_amount', e.value)} />
                        <label htmlFor="fixed_amount">تخفیف ثابت</label>
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

export default EditPackage;
