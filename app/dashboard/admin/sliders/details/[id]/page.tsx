'use client';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { PageParams } from '@/types/layout';
import { ISlider } from '../../(models)/sliders';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useRouter } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import { getSliderDetails } from '../../(services)/sliders.service';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { activeOption } from '../../../ads/constant/converter';
import Image from 'next/image';
import defaultImage from '../../../../../../public/images/def.png';
import { Button } from 'primereact/button';

const DetailSliderPage: FC<PageParams> = ({ params }: any) => {
    const [slider, setSlider] = useState<ISlider | null>(null);
    const [isLoading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const loadAds = useCallback(async () => {
        setLoading(true);
        try {
            const getData: ISlider = await getSliderDetails(+params.id);
            setSlider(getData);
        } catch (error) {
            console.error('Failed to load slider', error);
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
            <h5>مشاهده اسلاید {slider?.title || ''}</h5>
            <hr />
            <div className="grid p-fluid mt-6">
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="title" value={slider?.title || ''} readOnly />
                        <label htmlFor="title">عنوان</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="link" value={slider?.link || ''} readOnly />
                        <label htmlFor="link">لینک</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown type="text" name="active" id="active" value={activeOption.find((option) => option.code === slider?.active)} options={activeOption} optionLabel="name" placeholder="انتخاب کنید" className="w-full" readOnly />
                        <label htmlFor="active">وضعیت آگهی</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputTextarea name="description" value={slider?.description || ''} readOnly />
                        <label htmlFor="description">توضیحات</label>
                    </span>
                </div>
                <div className="field col-12 ">
                    <label htmlFor="description">تصویر</label>
                    <span className="p-float-label">
                        <Image src={slider?.image && typeof slider?.image === 'string' ? slider?.image : defaultImage} alt="Preview" width={400} height={200} style={{ objectFit: 'cover' }} />
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

export default DetailSliderPage;
