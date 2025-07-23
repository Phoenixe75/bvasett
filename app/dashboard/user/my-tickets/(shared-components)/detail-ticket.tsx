'use client';
import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

const DetailTicket: React.FC<any> = ({ visible, onHide, dataDetail }) => {
    const back = () => {
        onHide();
    };

    return (
        <Dialog header="نمایش تیکت" visible={visible} onHide={onHide}>
            <div className="grid p-fluid mt-6 detailsData">
                <div className="field col-12 md:col-12">
                    <span className="p-float-label">
                        <InputText type="text" name="subject" id="subject" value={dataDetail?.subject} readOnly />
                        <label htmlFor="subject">موضوع</label>
                    </span>
                </div>
                <div className="field col-12 md:col-12">
                    <span className="p-float-label">
                        <InputTextarea name="body" id="body" value={dataDetail?.body} rows={5} readOnly />
                        <label htmlFor="body">متن تیکت</label>
                    </span>
                </div>
                <div className="field col-12 md:col-12">
                    <span className="p-float-label">
                        <InputTextarea name="answer" id="answer" value={dataDetail?.answer} rows={5} readOnly />
                        <label htmlFor="answer">پاسخ</label>
                    </span>
                </div>
                <div className="field flex col-12 md:col-4">
                    <Button raised label="بازگشت" type="button" className="bg-gray-300 text-color border-0 mt-2" onClick={back} />
                </div>
            </div>
        </Dialog>
    );
};

export default DetailTicket;
