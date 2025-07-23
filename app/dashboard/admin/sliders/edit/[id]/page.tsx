'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import Image from 'next/image';
import defaultImage from '../../../../../../public/images/def.png';
import { ISlider } from '../../(models)/sliders';
import { getSliderDetails, updateSlider } from '../../(services)/sliders.service';
import { activeOption } from '../../../ads/constant/converter';
import { Checkbox } from 'primereact/checkbox';

const EditSliderPage = ({ params }: { params: { id: number } }) => {
    const [initDataImage, setInitDataImage] = useState<any>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | File | null>(null);
    const [formData, setFormData] = useState<ISlider>({
        id: 0,
        active: null,
        ordering: 1,
        title: '',
        description: '',
        image: initDataImage,
        link: '',
        mobile: false,
    });
    const router = useRouter();
    const loading = useRef(false);

    const loadSliderData = useCallback(async () => {
        loading.current = true;
        try {
            const getData: ISlider = await getSliderDetails(+params.id);
            setFormData(getData);
            setImagePreviewUrl(getData?.image);
        } catch (error) {
            toast.error('خطا در دریافت جزئیات اسلایدر');
        } finally {
            loading.current = false;
        }
    }, [params.id]);

    useEffect(() => {
        loadSliderData();
    }, [loadSliderData]);

    const setValue = useCallback((fieldName: string, fieldValue: any) => {
        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: fieldValue
        }));
    }, []);

    const onTemplateSelect = (e: FileUploadSelectEvent) => {
        const file = e.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setFormData((prevState) => ({
                ...prevState,
                image: file
            }));
            setImagePreviewUrl(previewUrl);
        } else {
            toast.error('تصویری انتخاب نشده است!');
        }
    };

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            loading.current = true;
            const formDataToSend = new FormData();
            formDataToSend.append('active', formData.active?.toString() || '');
            formDataToSend.append('ordering', formData.ordering?.toString() || '');
            formDataToSend.append('title', formData.title || '');
            formDataToSend.append('description', formData.description || '');
            formDataToSend.append('link', formData.link || '');
            formDataToSend.append('mobile', formData.mobile?.toString() || '');

            if (formData.image instanceof File) {
                formDataToSend.append('image', formData.image);
            } else {
                console.error('image is not a valid file');
            }

            for (const pair of formDataToSend.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }

            await updateSlider(params.id, formDataToSend);
            toast.success('اسلایدر با موفقیت بروزرسانی شد');
            router.push('../');
        } catch (error) {
            toast.error('بروز رسانی اسلایدر با خطا روبرو شد');
            console.error('Error updating slider:', error);
        } finally {
            loading.current = false;
        }
    };

    const back = () => {
        router.push('../');
    };

    return (
        <div className="card detailsData">
            <h5>ویرایش اسلایدر</h5>
            <hr />
            <form onSubmit={submitForm} className="grid p-fluid mt-6" encType="multipart/form-data">
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="title" autoComplete="off" value={formData.title ?? ''} onChange={(e) => setValue('title', e.target.value)} />
                        <label htmlFor="title">عنوان</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="link" autoComplete="off" value={formData.link ?? ''} onChange={(e) => setValue('link', e.target.value)} />
                        <label htmlFor="link">لینک</label>
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
                <div className="field col-12 md:col-4">
                    <label htmlFor="image">تصویر اسلایدر</label>
                    <FileUpload name="image" accept="image/*" maxFileSize={1000000} onSelect={onTemplateSelect} />
                    <div className="mt-2">
                        <Image src={typeof imagePreviewUrl === 'string' ? imagePreviewUrl : defaultImage} alt="Preview" width={500} height={200} style={{ objectFit: 'cover' }} />
                    </div>
                </div>
                <div className="col-12">
                    <div className="field flex col-12 md:col-2">
                        <Button raised type="submit" label="بروز‌رسانی" className="bg-green-500 text-white border-0 mt-2 ml-2" disabled={loading.current} loading={loading.current} />
                        <Button raised label="بازگشت" type="button" className="bg-gray-300 text-color border-0 mt-2" onClick={back} />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditSliderPage;
