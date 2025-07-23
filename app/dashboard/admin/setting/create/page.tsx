'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Dropdown } from 'primereact/dropdown';
import { activeOption } from '../../ads/constant/converter';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FileUpload, FileUploadHeaderTemplateOptions, FileUploadSelectEvent, ItemTemplateOptions } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import Image from 'next/image';
import defaultImage from '../../../../../public/images/def.png';
import { ISetting } from '../(models)/setting';
import { createSetting } from '../(services)/setting.service';

const CreateSettingPage = () => {
    const [formData, setFormData] = useState<ISetting>({
        site_name: '',
        active: null,
        ordering: 1,
        logo: null,
        favicon: null,
        phone_number: '',
        contact_email: '',
        address: ''
    });
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef<FileUpload>(null);
    const favUploadRef = useRef<FileUpload>(null);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const loading = useRef(false);

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    const setValue = useCallback((fieldName: string, fieldValue: any) => {
        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: fieldValue
        }));
    }, []);

    const onTemplateSelect = (e: FileUploadSelectEvent, field: 'logo' | 'favicon') => {
        const file = e.files[0];
        if (file) {
            setValue(field, file);
        }
    };

    const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
        const { className, chooseButton } = options;
        const value = totalSize / 10000;
        return (
            <div className={className} style={{ display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }} />
            </div>
        );
    };

    const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
        const file = inFile as File;
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
            </div>
        );
    };

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            loading.current = true;

            if (formData.site_name && formData.logo) {
                const formDataToSend = new FormData();
                formDataToSend.append('active', formData.active ? formData.active.toString() : 'null');
                formDataToSend.append('ordering', formData.ordering?.toString() ?? '');
                formDataToSend.append('site_name', formData.site_name);
                formDataToSend.append('address', formData.address ?? ''); // Provide default value
                formDataToSend.append('contact_email', formData.contact_email ?? ''); // Provide default value
                formDataToSend.append('phone_number', formData.phone_number ?? ''); // Provide default value

                // Ensure logo and favicon are not null before appending
                if (formData.logo) {
                    formDataToSend.append('logo', formData.logo);
                }
                if (formData.favicon) {
                    formDataToSend.append('favicon', formData.favicon);
                }

                await createSetting(formDataToSend);
                router.push('./');
            } else {
                toast.error('لوگو سایت و نام سایت اجباری است');
            }
        } catch (error) {
            toast.error('ثبت تنظیمات با خطا روبرو شد');
            console.error('Failed to create setting:', error);
        } finally {
            loading.current = false;
        }
    };

    const back = (): void => {
        router.push('./');
    };

    return (
        <div className="card detailsData">
            <h5>افزودن تنظیمات</h5>
            <hr />
            <form onSubmit={submitForm} className="grid p-fluid mt-6">
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" ref={inputRef} name="site_name" id="site_name" autoComplete="off" value={formData.site_name ?? ''} onChange={(e) => setValue('site_name', e.target.value)} required />
                        <label htmlFor="site_name">نام سایت</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="contact_email" id="contact_email" autoComplete="off" value={formData.contact_email ?? ''} onChange={(e) => setValue('contact_email', e.target.value)} />
                        <label htmlFor="contact_email">ایمیل</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="phone_number" id="phone_number" autoComplete="off" value={formData.phone_number ?? ''} onChange={(e) => setValue('phone_number', e.target.value)} />
                        <label htmlFor="phone_number">شماره تماس</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown value={activeOption.find((option) => option.code === formData.active)} onChange={(e) => setValue('active', e.value.code)} options={activeOption} optionLabel="name" placeholder="انتخاب کنید" className="w-full" />
                        <label htmlFor="active">وضعیت تنظیمات</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputTextarea name="address" value={formData.address ?? ''} onChange={(e) => setValue('address', e.target.value)} />
                        <label htmlFor="address">آدرس</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4"></div>
                <div className="field col-12 md:col-4">
                    <label htmlFor="logo">لوگو سایت</label>
                    <FileUpload ref={fileUploadRef} name="logo" accept="image/*" maxFileSize={1000000} onSelect={(e) => onTemplateSelect(e, 'logo')} headerTemplate={headerTemplate} itemTemplate={itemTemplate} />
                    <div style={{ marginTop: '10px' }}>
                        <Image src={formData.logo ? (typeof formData.logo === 'string' ? formData.logo : URL.createObjectURL(formData.logo)) : defaultImage} alt="Preview" width={500} height={200} style={{ objectFit: 'cover' }} />
                    </div>
                </div>
                <div className="field col-12 md:col-4">
                    <label htmlFor="favicon">نماد سایت</label>
                    <FileUpload ref={favUploadRef} name="favicon" accept="image/*" maxFileSize={1000000} onSelect={(e) => onTemplateSelect(e, 'favicon')} headerTemplate={headerTemplate} itemTemplate={itemTemplate} />
                    <div style={{ marginTop: '10px' }}>
                        <Image src={formData.favicon ? (typeof formData.favicon === 'string' ? formData.favicon : URL.createObjectURL(formData.favicon)) : defaultImage} alt="Preview" width={500} height={200} style={{ objectFit: 'cover' }} />
                    </div>
                </div>
                <div className="col-12">
                    <div className="field flex col-12 md:col-2">
                        <Button raised type="submit" label="ثبت" className="bg-green-500 text-white border-0 mt-2 ml-2" disabled={loading.current} loading={loading.current} />
                        <Button raised label="بازگشت" type="button" className="bg-gray-300 text-color border-0 mt-2" onClick={back} />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateSettingPage;
