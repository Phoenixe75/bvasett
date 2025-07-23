'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ISlider } from '../(models)/sliders';
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
import { createSlider } from '../(services)/sliders.service';
import { Checkbox } from 'primereact/checkbox';

const CreateSliderPage = () => {
    const [formData, setFormData] = useState<ISlider>({
        active: null,
        ordering: 1,
        title: '',
        description: '',
        image: null,
        link: '',
        mobile: false,
    });
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef<FileUpload>(null);
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

    const onTemplateSelect = (e: FileUploadSelectEvent) => {
        const file = e.files[0];
        if (file) {
            setFormData((prevState) => ({
                ...prevState,
                image: file
            }));
        }
    };

    const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
        const { className, chooseButton } = options;
        const value = totalSize / 10000;
        return (
            <div className={className} style={{ display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
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

            if (formData.image) {
                const formDataToSend = new FormData();
                formDataToSend.append('active', formData.active ? formData.active.toString() : 'null');
                formDataToSend.append('ordering', formData.ordering?.toString() ?? '');
                formDataToSend.append('title', formData.title ?? '');
                formDataToSend.append('description', formData.description ?? '');
                formDataToSend.append('link', formData.link ?? '');
                formDataToSend.append('image', formData.image);
                formDataToSend.append('mobile', formData.mobile?.toString())
                await createSlider(formDataToSend);
                router.push('./');
            } else {
                toast.error('تصویر اسلایدر اجباری است');
            }
        } catch (error) {
            toast.error('ثبت اسلایدر با خطا روبرو شد');
            console.error('Failed to create slider:', error);
        } finally {
            loading.current = false;
        }
    };

    const back = (): void => {
        router.push('./');
    };

    return (
        <div className="card detailsData">
            <h5>افزودن اسلاید</h5>
            <hr />
            <form onSubmit={submitForm} className="grid p-fluid mt-6">
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" ref={inputRef} name="title" id="title" autoComplete="off" value={formData.title ?? ''} onChange={(e) => setValue('title', e.target.value)} />
                        <label htmlFor="title">عنوان</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="area" id="area" autoComplete="off" value={formData.link ?? ''} onChange={(e) => setValue('link', e.target.value)} />
                        <label htmlFor="area">لینک</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown value={activeOption.find((option) => option.code === formData.active)} onChange={(e) => setValue('active', e.value.code)} options={activeOption} optionLabel="name" placeholder="انتخاب کنید" className="w-full" />
                        <label htmlFor="active">وضعیت اسلایدر</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputTextarea name="description" value={formData.description ?? ''} onChange={(e) => setValue('description', e.target.value)} />
                        <label htmlFor="description">توضیحات</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="flex align-items-center gap-2">
                        <Checkbox name="mobile" onChange={e =>  setValue('mobile', e.checked)} checked={formData.mobile} />
                        <label htmlFor="mobile">اسلایدر در موبایل استفاده شود؟</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4"/>
                <div className="field col-12 md:col-4">
                    <label htmlFor="active">تصویر اسلایدر</label>
                    <span className="text-xs"> ( ابعاد پیشنهادی 1600 * 600 )</span>
                    <FileUpload ref={fileUploadRef} name="image" accept="image/*" maxFileSize={1000000} onSelect={onTemplateSelect} headerTemplate={headerTemplate} itemTemplate={itemTemplate} />
                    <div style={{ marginTop: '10px' }}>
                        <Image src={formData.image ? (typeof formData.image === 'string' ? formData.image : URL.createObjectURL(formData.image)) : defaultImage} alt="Preview" width={500} height={200} style={{ objectFit: 'cover' }} />
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

export default CreateSliderPage;
