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
    // "minimum_selected_ads": number;
    // "percentage": number;
    // "fixed_amount": number;
    return (
        <Dialog header="جزئیات تخفیف" visible={visible} onHide={onHide}>
            <div className="grid p-fluid mt-6 detailsData">
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputText type="text" name="minimum_selected_ads" id="minimum_selected_ads" value={getPurposeLabel(packageData?.ad_purpose)} />
                        <label htmlFor="minimum_selected_ads">حداقل آگهی انتخابی</label>
                    </span>
                </div>
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputNumber type="text" name="percentage" id="percentage" value={packageData?.percentage} />
                        <label htmlFor="percentage">درصد تخفیف</label>
                    </span>
                </div>
                <div className="field col-12 md:col-6">
                    <span className="p-float-label">
                        <InputNumber type="text" name="fixed_amount" id="fixed_amount" value={packageData?.fixed_amount} />
                        <label htmlFor="fixed_amount">تخفیف ثابت</label>
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
