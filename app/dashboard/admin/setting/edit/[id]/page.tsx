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
import { activeOption } from '../../../ads/constant/converter';
import { ISetting } from '../../(models)/setting';
import { getSettingDetails, updateSetting } from '../../(services)/setting.service';

const EditSettingPage = ({ params }: { params: { id: number } }) => {
    const [initDataLogo, setInitDataLogo] = useState<any>(null);
    const [initDataFavicon, setInitDataFavicon] = useState<any>(null);
    const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | undefined>(); // Ensure the state is properly typed
    const [favPreviewUrl, setFavPreviewUrl] = useState<string | undefined>(); // Ensure the state is properly typed
    const [formData, setFormData] = useState<ISetting>({
        id: 0,
        active: null,
        ordering: 1,
        site_name: '',
        address: '',
        logo: initDataLogo,
        favicon: initDataFavicon,
        contact_email: '',
        phone_number: ''
    });
    const loading = useRef(false);
    const router = useRouter();

    const loadAds = useCallback(async () => {
        loading.current = true;
        try {
            const getData: ISetting = await getSettingDetails(+params.id);
            setFormData(getData);
            setInitDataLogo(getData?.logo);
            setInitDataFavicon(getData?.favicon);
        } catch (error) {
            toast.error('خطا در دریافت جزئیات تنظیمات');
        } finally {
            loading.current = false;
        }
    }, [params.id]);

    useEffect(() => {
        loadAds();
    }, [loadAds]);

    const setValue = useCallback((fieldName: string, fieldValue: any) => {
        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: fieldValue
        }));
    }, []);

    const onTemplateSelect = (e: FileUploadSelectEvent, type: 'logo' | 'favicon') => {
        const file = e.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setFormData((prevState) => ({
                ...prevState,
                [type]: file
            }));
            if (type === 'logo') {
                setLogoPreviewUrl(previewUrl);
            } else {
                setFavPreviewUrl(previewUrl);
            }
        } else {
            toast.error('تصویری انتخاب نشده است!');
        }
    };

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            loading.current = true;
            const formDataToSend = new FormData();
            formDataToSend.append('active', formData.active ? formData.active.toString() : 'null');
            formDataToSend.append('ordering', formData.ordering?.toString() ?? '');
            formDataToSend.append('site_name', formData.site_name ?? '');
            formDataToSend.append('address', formData.address ?? '');
            formDataToSend.append('contact_email', formData.contact_email ?? '');
            formDataToSend.append('phone_number', formData.phone_number ?? '');

            if (formData.logo instanceof File) {
                formDataToSend.append('logo', formData.logo);
            } else {
                console.error('Logo is not a valid file');
            }

            if (formData.favicon instanceof File) {
                formDataToSend.append('favicon', formData.favicon);
            } else {
                console.error('Favicon is not a valid file');
            }

            for (const pair of formDataToSend.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }

            await updateSetting(params.id, formDataToSend);
            toast.success('تنظیمات با موفقیت بروزرسانی شد');
            router.push('../');
        } catch (error) {
            toast.error('بروز رسانی تنظیمات با خطا روبرو شد');
            console.error('Error updating setting:', error);
        } finally {
            loading.current = false;
        }
    };

    const back = () => {
        router.push('../');
    };

    return (
        <div className="card detailsData">
            <h5>ویرایش تنظیمات</h5>
            <hr />
            <form onSubmit={submitForm} className="grid p-fluid mt-6" encType="multipart/form-data">
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="site_name" id="site_name" autoComplete="off" value={formData.site_name ?? ''} onChange={(e) => setValue('site_name', e.target.value)} />
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
                    <FileUpload name="logo" accept="image/*" maxFileSize={1000000} onSelect={(e) => onTemplateSelect(e, 'logo')} />
                    <div style={{ marginTop: '10px' }}>
                        <Image src={logoPreviewUrl || (formData.logo ? (typeof formData.logo === 'string' ? formData.logo : URL.createObjectURL(formData.logo)) : defaultImage)} alt="Preview" width={500} height={200} style={{ objectFit: 'cover' }} />
                    </div>
                </div>
                <div className="field col-12 md:col-4">
                    <label htmlFor="favicon">نماد سایت</label>
                    <FileUpload name="favicon" accept="image/*" maxFileSize={1000000} onSelect={(e) => onTemplateSelect(e, 'favicon')} />
                    <div style={{ marginTop: '10px' }}>
                        <Image
                            src={favPreviewUrl || (formData.favicon ? (typeof formData.favicon === 'string' ? formData.favicon : URL.createObjectURL(formData.favicon)) : defaultImage)}
                            alt="Preview"
                            width={500}
                            height={200}
                            style={{ objectFit: 'cover' }}
                        />
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

export default EditSettingPage;
