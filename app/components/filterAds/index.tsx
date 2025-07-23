'use client';
import React, { useState } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { IFilterAds } from './(models)/filterAds';

interface FilterAdsProps {
    onFilterSubmit: (formData: IFilterAds) => void;
}

const FilterAds: React.FC<FilterAdsProps> = ({ onFilterSubmit }) => {
    const [formData, setFormData] = useState({ title: '', slug: '' });
    const [hasFilters, setHasFilters] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prevFormData) => {
            const updatedFormData = { ...prevFormData, [id]: value };
            setHasFilters(updatedFormData.title !== '' || updatedFormData.slug !== '');
            return updatedFormData;
        });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onFilterSubmit(formData);
    };

    const resetFilters = () => {
        setFormData({ title: '', slug: '' });
        setHasFilters(false);
        onFilterSubmit({ title: '', slug: '' });
    };

    return (
        <Accordion>
            <AccordionTab
                header={
                    <>
                        <i className="pi pi-search"></i> جستجوی آگهی
                    </>
                }
            >
                <div className="grid p-4">
                    <form className="col-12 md:col-12" onSubmit={handleSubmit}>
                        <div className="p-fluid">
                            <div className="formgrid grid">
                                <div className="field col-12 md:col-3">
                                    <label htmlFor="title">عنوان</label>
                                    <InputText id="title" value={formData.title} onChange={handleChange} />
                                </div>
                                <div className="field col-12 md:col-3">
                                    <label htmlFor="slug">شناسه یکتا</label>
                                    <InputText id="slug" value={formData.slug} onChange={handleChange} />
                                </div>
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
export default FilterAds;
