'use client';
import React, { useState } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { IFilterUsers } from './(models)/filterUsers';

interface FilterUsersProps {
    onFilterSubmit: (formData: IFilterUsers) => void;
}

const FilterUsers: React.FC<FilterUsersProps> = ({ onFilterSubmit }) => {
    const [formData, setFormData] = useState<IFilterUsers>({
        mobile: '',
        first_name: '',
        last_name: '',
        national_id: ''
    });
    const [hasFilters, setHasFilters] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prevFormData) => {
            const updatedFormData = { ...prevFormData, [id]: value };
            setHasFilters(Object.values(updatedFormData).some((filter) => filter !== ''));
            return updatedFormData;
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onFilterSubmit(formData);
    };

    const resetFilters = () => {
        setFormData({
            first_name: '',
            last_name: '',
            mobile: '',
            national_id: ''
        });
        setHasFilters(false);
        onFilterSubmit({ first_name: '', last_name: '', mobile: '', national_id: '' });
    };

    return (
        <Accordion>
            <AccordionTab
                header={
                    <>
                        <i className="pi pi-search"></i> جستجوی کاربر
                    </>
                }
            >
                <div className="grid p-4">
                    <form className="col-12 md:col-12" onSubmit={handleSubmit}>
                        <div className="p-fluid">
                            <div className="formgrid grid">
                                <div className="field col-12 md:col-3">
                                    <label htmlFor="first_name">نام</label>
                                    <InputText id="first_name" value={formData.first_name || ''} onChange={handleChange} />
                                </div>
                                <div className="field col-12 md:col-3">
                                    <label htmlFor="last_name">نام خانوادگی</label>
                                    <InputText id="last_name" value={formData.last_name || ''} onChange={handleChange} />
                                </div>
                                <div className="field col-12 md:col-3">
                                    <label htmlFor="mobile">شماره موبایل</label>
                                    <InputText id="mobile" value={formData.mobile || ''} onChange={handleChange} />
                                </div>
                                <div className="field col-12 md:col-3">
                                    <label htmlFor="national_id">کد ملی</label>
                                    <InputText id="national_id" value={formData.national_id || ''} onChange={handleChange} />
                                </div>
                                <div className={`field col-12 md:col-${hasFilters ? '2' : '3'}`}></div>
                                <div className="field col-12 md:col-1">
                                    <Button raised type="submit" label="جستجو" icon="pi pi-search" className="mt-4" />
                                </div>
                                {hasFilters && (
                                    <div className="field col-12 md:col-1">
                                        <Button raised type="button" label="انصراف" icon="pi pi-times" className="mt-4 p-button-danger" onClick={resetFilters} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </AccordionTab>
        </Accordion>
    );
};

export default FilterUsers;
