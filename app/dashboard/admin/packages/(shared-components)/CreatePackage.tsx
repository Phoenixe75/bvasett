import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import React, { useCallback, useState } from 'react';
import { IPackages } from '../(models)/packages';
import { createPackage } from '../(services)/packages.service';
import { toast } from 'react-toastify';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { purposeOption } from '../../ads/constant/converter';

const CreatePackage: React.FC<any> = ({ visible, onHide, refreshData }) => {
    const [formData, setFormData] = useState<IPackages>({
        ad_purpose: 1,
        with_inquiry_price: '',
        without_inquiry_price: ''
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
            toast.success('قیمت‌گذاری ثبت شد');
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
    const handlePurposeChange = (e: any) => {
        const selectedPurposeCode = e.value ? e.value.code : null;
        setFormData({ ...formData, ad_purpose: selectedPurposeCode });
    };
    return (
        <Dialog header="ایجاد قیمت‌گذاری جدید" visible={visible} onHide={onHide}>
            <form onSubmit={submitForm} className="grid p-fluid mt-6 detailsData">
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                    <Dropdown
                            type="text"
                            name="purpose"
                            id="purpose"
                            value={purposeOption.find((option) => option.code === formData.ad_purpose) || null}
                            onChange={handlePurposeChange}
                            options={purposeOption}
                            optionLabel="name"
                            placeholder="انتخاب کنید"
                            className="w-full"
                            required
                        />
                        <label htmlFor="purpose">
                            نوع معامله <span className="text-red-500">*</span>
                        </label>
                    </span>
                </div>
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputNumber required name="with_inquiry_price" id="with_inquiry_price" onValueChange={(e) => setValue('with_inquiry_price', e.value)} />
                        <label htmlFor="with_inquiry_price">قیمت با استعلام</label>
                    </span>
                </div>
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputNumber required name="without_inquiry_price" id="without_inquiry_price" onChange={(e) => setValue('without_inquiry_price', e.value)} />
                        <label htmlFor="without_inquiry_price">قیمت بدون استعلام</label>
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
