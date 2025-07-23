'use client';
import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { getPurposeLabel } from '../../ads/constant/converter';
import { Checkbox } from 'primereact/checkbox';

const DetailPackage: React.FC<any> = ({ visible, onHide, packageData }) => {
    const back = () => {
        onHide();
    };
    return (
        <Dialog header="جزئیات اشتراک" visible={visible} onHide={onHide}>
            <div className="grid p-fluid mt-6 detailsData">
            <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputText value={packageData?.name} required name="name" id="name"/>
                        <label htmlFor="name">نام اشتراک</label>
                    </span>
                </div>
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputText value={packageData?.description} required name="description" id="description"  />
                        <label htmlFor="description">توضیحات</label>
                    </span>
                </div>
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputNumber value={packageData?.duration_days}  required name="duration_days" id="duration_days"  />
                        <label htmlFor="duration_days">مدت اشتراک</label>
                    </span>
                </div>
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputNumber value={Number(packageData?.price)}  required name="price" id="price" />
                        <label htmlFor="price">قیمت</label>
                    </span>
                </div>
                <div className="field col-12 md:col-6">
                    <span className="flex align-items-center">
                    <Checkbox  checked={packageData?.active}></Checkbox>
                        <label className='mr-2' htmlFor="active">فعال</label>
                    </span>
                </div>
                <div className="field flex col-12 md:col-4">
                    <Button raised label="بازگشت" type="button" className="bg-gray-300 text-color border-0 mt-2" onClick={back} />
                </div>
            </div>
        </Dialog>
    );
};

export default DetailPackage;
