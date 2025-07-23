'use client';
import React, { useState } from 'react';
import AppHeader from '@/layout/AppHeader';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';

interface IAccommodation {
    name: string;
    code: string;
}

const Page = () => {
    const [selectAccommodation, setSelectAccommodation] = useState<IAccommodation | null>(null);
    const [selectLocation, setSelectLocation] = useState<IAccommodation | null>(null);

    const accommodation: IAccommodation[] = [
        { name: 'آپارتمان', code: 'apartment' },
        { name: 'ویلا', code: 'villa' },
        { name: 'دفترکار', code: 'office' },
        { name: 'مغازه', code: 'market' },
        { name: 'کلنگی', code: 'old' },
        { name: 'باغ', code: 'garden' }
    ];

    const locations: IAccommodation[] = [
        { name: 'شمال', code: 'north' },
        { name: 'جنوب', code: 'south' },
        { name: 'شرق', code: 'east' },
        { name: 'غرب', code: 'west' },
        { name: 'مرکز', code: 'center' }
    ];

    return (
        <>
            <AppHeader />
            <div className="flex flex-column pt-4 px-4 lg:px-8 overflow-hidden lg:block carousel-custom">
                <div className="grid">
                    <div className="col-12">
                        <div className="card p-fluid" style={{ backgroundColor: '#f3f3f3' }}>
                            <h5>جستجوی پیشرفته</h5>
                            <div className="flex flex-col gap-5">
                                <div className="field">
                                    <label htmlFor="name2">نوع ملک</label>
                                    <MultiSelect
                                        value={selectAccommodation}
                                        onChange={(e) => setSelectAccommodation(e.value)}
                                        options={accommodation}
                                        optionLabel="name"
                                        display="chip"
                                        placeholder="انتخاب کنید"
                                        maxSelectedLabels={3}
                                        className="w-full "
                                    />
                                </div>
                                <div className="field">
                                    <label htmlFor="name2">موقعیت</label>
                                    <MultiSelect value={selectLocation} onChange={(e) => setSelectLocation(e.value)} options={locations} optionLabel="name" display="chip" placeholder="انتخاب کنید" maxSelectedLabels={3} className="w-full " />
                                </div>
                                <div className="field">
                                    <label htmlFor="name2">مشخصه</label>
                                    <MultiSelect
                                        value={selectAccommodation}
                                        onChange={(e) => setSelectAccommodation(e.value)}
                                        options={accommodation}
                                        optionLabel="name"
                                        display="chip"
                                        placeholder="انتخاب کنید"
                                        maxSelectedLabels={3}
                                        className="w-full "
                                    />
                                </div>
                                <div className="field">
                                    <label htmlFor="name2">امکانات</label>
                                    <MultiSelect
                                        value={selectAccommodation}
                                        onChange={(e) => setSelectAccommodation(e.value)}
                                        options={accommodation}
                                        optionLabel="name"
                                        display="chip"
                                        placeholder="انتخاب کنید"
                                        maxSelectedLabels={3}
                                        className="w-full "
                                    />
                                </div>
                                <div className="field">
                                    <label htmlFor="firstname1">متراژ </label>
                                    <InputText id="firstname1" type="text" placeholder="" />
                                </div>
                                <div className="field">
                                    <label htmlFor="lastname1"> متراژ</label>
                                    <InputText id="lastname1" type="text" placeholder="" />
                                </div>
                                <div className="field">
                                    <label htmlFor="lastname1">زیر بنا</label>
                                    <InputText id="lastname1" type="text" placeholder="از" />
                                </div>
                                <div className="field">
                                    <label htmlFor="lastname1">زیر بنا</label>
                                    <InputText id="lastname1" type="text" placeholder="تا" />
                                </div>
                                <div className="field">
                                    <label htmlFor="firstname1"> قیمت</label>
                                    <InputText id="priceMin" type="text" placeholder="حداقل قیمت (تومان)" />
                                </div>
                                <div className="field">
                                    <label htmlFor="priceMax">قیمت</label>
                                    <InputText id="priceMax" type="text" placeholder="حداکثر قیمت (تومان)" />
                                </div>
                                <div className="field">
                                    <label htmlFor="dateFrom">از تاریخ</label>
                                    <InputText id="dateFrom" type="text" placeholder="____/__/__" />
                                </div>
                                <div className="field">
                                    <label htmlFor="dateTo">تا تاریخ</label>
                                    <InputText id="dateTo" type="text" placeholder="____/__/__" />
                                </div>
                                <div className="field">
                                    <label htmlFor="depositMin">ودیعه </label>
                                    <InputText id="depositMin" type="text" placeholder="از" />
                                </div>
                                <div className="field">
                                    <label htmlFor="depositMax">ودیعه </label>
                                    <InputText id="depositMax" type="text" placeholder="تا" />
                                </div>
                                <div className="field">
                                    <label htmlFor="rentMin">اجاره (متری) </label>
                                    <InputText id="rentMin" type="text" placeholder="از" />
                                </div>
                                <div className="field">
                                    <label htmlFor="rentMax">اجاره (متری) </label>
                                    <InputText id="rentMax" type="text" placeholder="تا" />
                                </div>
                                <div className="field">
                                    <label htmlFor="roomCountMin">تعداد اتاق </label>
                                    <InputText id="roomCountMin" type="text" placeholder="از" />
                                </div>
                                <div className="field">
                                    <label htmlFor="roomCountMax">تعداد اتاق </label>
                                    <InputText id="roomCountMax" type="text" placeholder="تا" />
                                </div>
                                <div className="field">
                                    <label htmlFor="floorCountMin">تعداد طبقات </label>
                                    <InputText id="floorCountMin" type="text" placeholder="از" />
                                </div>
                                <div className="field">
                                    <label htmlFor="floorCountMax">تعداد طبقات </label>
                                    <InputText id="floorCountMax" type="text" placeholder="تا" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-left mt-4">
                        <Button raised label="جستجو" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Page;
