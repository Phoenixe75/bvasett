'use client';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { PageParams } from '@/types/layout';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useRouter } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { activeOption } from '../../../ads/constant/converter';
import Image from 'next/image';
import defaultImage from '../../../../../../public/images/def.png';
import { Button } from 'primereact/button';
import { ISetting } from '../../(models)/setting';
import { getSettingDetails } from '../../(services)/setting.service';

const DetailSettingPage: FC<PageParams> = ({ params }: any) => {
    const [setting, setSetting] = useState<ISetting | null>(null);
    const [isLoading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const loadAds = useCallback(async () => {
        setLoading(true);
        try {
            const getData: ISetting = await getSettingDetails(+params.id);
            setSetting(getData);
        } catch (error) {
            console.error('Failed to load setting', error);
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        loadAds();
    }, [loadAds]);

    const back = (): void => {
        router.push('../');
    };

    if (isLoading) {
        return <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />;
    }

    return (
        <div className="card detailsData">
            <h5>مشاهده اسلاید {setting?.site_name || ''}</h5>
            <hr />
            <div className="grid p-fluid mt-6">
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="title" value={setting?.site_name || ''} readOnly />
                        <label htmlFor="title">عنوان</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="link" value={setting?.contact_email || ''} readOnly />
                        <label htmlFor="link">لینک</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown type="text" name="active" id="active" value={activeOption.find((option) => option.code === setting?.active)} options={activeOption} optionLabel="name" placeholder="انتخاب کنید" className="w-full" readOnly />
                        <label htmlFor="active">وضعیت آگهی</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputTextarea name="description" value={setting?.address || ''} readOnly />
                        <label htmlFor="description">آدرس</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <label htmlFor="description">لوگو سایت</label>
                    <span className="p-float-label">
                        <Image src={setting?.logo && typeof setting?.logo === 'string' ? setting?.logo : defaultImage} alt="Preview" width={400} height={200} style={{ objectFit: 'cover' }} />
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <label htmlFor="description">نماد سایت</label>
                    <span className="p-float-label">
                        <Image src={setting?.favicon && typeof setting?.favicon === 'string' ? setting?.favicon : defaultImage} alt="Preview" width={400} height={200} style={{ objectFit: 'cover' }} />
                    </span>
                </div>
                <div className="field col-12 flex" style={{ flexDirection: 'row-reverse' }}>
                    <div className="col-1">
                        <Button raised label="بازگشت" type="button" className="bg-gray-300 text-color border-0 mt-2" onClick={back} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailSettingPage;
