import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import React, { useCallback, useState } from 'react';
import { Discount } from '../(models)/discounts';
import { createDiscount } from '../(services)/packages.service';
import { toast } from 'react-toastify';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { purposeOption } from '../../ads/constant/converter';

const CreatePackage: React.FC<any> = ({ visible, onHide, refreshData }) => {
    const [formData, setFormData] = useState<Discount>({
        fixed_amount: 0,
        minimum_selected_ads: 0,
        percentage: 0
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
            await createDiscount(formData);
            toast.success('تخفیف ثبت شد');
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
        <Dialog header="ایجاد تخفیف جدید" visible={visible} onHide={onHide}>
            <form onSubmit={submitForm} className="grid p-fluid mt-6 detailsData">
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputNumber required name="minimum_selected_ads" id="minimum_selected_ads" onValueChange={(e) => setValue('minimum_selected_ads', e.value)} />
                        <label htmlFor="minimum_selected_ads">حداقل آگهی انتخابی</label>
                    </span>
                </div>
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputNumber name="percentage" id="percentage" onValueChange={(e) => setValue('percentage', e.value)} />
                        <label htmlFor="percentage">درصد تخفیف اعمالی</label>
                    </span>
                </div>
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputNumber  name="fixed_amount" id="fixed_amount" onChange={(e) => setValue('fixed_amount', e.value)} />
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

export default CreatePackage;
