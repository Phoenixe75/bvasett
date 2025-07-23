'use client';
import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { getPurposeLabel } from '../../ads/constant/converter';

const DetailPackage: React.FC<any> = ({ visible, onHide, packageData }) => {
    const back = () => {
        onHide();
    };
    // ad_purpose: 1,
    // with_inquiry_price: '',
    // without_inquiry_price: ''
    return (
        <Dialog header="جزئیات قیمت‌گذاری" visible={visible} onHide={onHide}>
            <div className="grid p-fluid mt-6 detailsData">
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputText type="text" name="count" id="count" value={getPurposeLabel(packageData?.ad_purpose)} />
                        <label htmlFor="count">نوع معامله</label>
                    </span>
                </div>
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputNumber type="text" name="with_inquiry_price" id="with_inquiry_price" value={packageData?.with_inquiry_price} />
                        <label htmlFor="with_inquiry_price">قیمت با‌استعلام</label>
                    </span>
                </div>
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputNumber type="text" name="without_inquiry_price" id="without_inquiry_price" value={packageData?.without_inquiry_price} />
                        <label htmlFor="without_inquiry_price">قیمت بدون استعلام</label>
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
