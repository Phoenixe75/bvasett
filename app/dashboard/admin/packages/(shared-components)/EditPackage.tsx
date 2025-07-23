'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { IPackages } from '../(models)/packages';
import { InputNumber } from 'primereact/inputnumber';
import { updatePackage } from '../(services)/packages.service';
import { toast } from 'react-toastify';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';
import { purposeOption } from '../../ads/constant/converter';

const EditPackage: React.FC<any> = ({ visible, onHide, packageData, refreshData }) => {
    const [formData, setFormData] = useState<IPackages>({
        id: packageData?.id || 0,
        ad_purpose: packageData?.ad_purpose || 0,
        with_inquiry_price: packageData?.with_inquiry_price || '',
        without_inquiry_price: packageData?.without_inquiry_price || 0
    });
    const [loading, setLoading] = useState<boolean>(false);

    const setValue = (fieldName: string, fieldValue: any) => {
        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: fieldValue
        }));
    };

    useEffect(() => {
        if (packageData) {
            setFormData({
                id: packageData.id,
                ad_purpose: packageData.ad_purpose,
                with_inquiry_price: packageData.with_inquiry_price,
                without_inquiry_price: packageData.without_inquiry_price
            });
        }
    }, [packageData]);

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (formData.id) {
                await updatePackage(formData.id, formData);
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
    const handlePurposeChange = (e: any) => {
        const selectedPurposeCode = e.value ? e.value.code : null;
        setFormData({ ...formData, ad_purpose: selectedPurposeCode });
    };
    if (loading) {
        return <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />;
    }

    return (
        <Dialog header="ویرایش قیمت‌گذاری" visible={visible} onHide={onHide}>
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
                        <InputNumber value={Number(formData.with_inquiry_price)} required name="with_inquiry_price" id="with_inquiry_price" onValueChange={(e) => setValue('with_inquiry_price', e.value)} />
                        <label htmlFor="with_inquiry_price">قیمت با استعلام</label>
                    </span>
                </div>
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputNumber value={Number(formData.without_inquiry_price)} required name="without_inquiry_price" id="without_inquiry_price" onChange={(e) => setValue('without_inquiry_price', e.value)} />
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

export default EditPackage;
