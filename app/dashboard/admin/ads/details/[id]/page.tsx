'use client';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { PageParams } from '@/types/layout';
import {useParams, useRouter, useSearchParams} from 'next/navigation';

// models
import { IAdsBase, ICity, INeighborhoods } from '../../(models)/ads';

// primereact
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';

// services
import { getAdsDetails, getCitiesByState, getDistrict, getNeighborhoodsByDistrict, getState } from '../../(services)/ads.service';

// converter
import { directionsOption, getLocationLabel, getPurposeLabel, getTypeLabel } from '../../constant/converter';
import { InputTextarea } from 'primereact/inputtextarea';

const AdsDetailsPage: FC<PageParams> = ({ params }: any) => {
    const [ads, setAds] = useState<IAdsBase | null>(null);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [stateName, setStateName] = useState<string>('');
    const [cities, setCities] = useState<ICity[]>([]);
    const [districtName, setDistrictName] = useState<string>('');
    const [neighborhoods, setNeighborhoods] = useState<INeighborhoods[]>([]);
    const router = useRouter();

    const loadAds = useCallback(async () => {
        setLoading(true);
        try {
            const getData: IAdsBase = await getAdsDetails(+params.id);
            getData.location_label = getLocationLabel(getData.location);
            getData.purpose_label = getPurposeLabel(getData.purpose);
            getData.type_label = getTypeLabel(getData.type);
            getData.directions = getData.directions
                ? getData.directions
                      .map((direction) => {
                          const found = directionsOption.find((option) => option.code === direction);
                          return found ? found.name : null;
                      })
                      .filter((name): name is string => name !== null)
                : null;
            if (getData.state !== null) {
                const fetchedCities = await getCitiesByState(getData.state);
                setCities(fetchedCities);
            } else {
                console.warn('State is null');
                setCities([]);
            }
            if (getData.district !== null) {
                const fetchedNeighborhoods = await getNeighborhoodsByDistrict(getData.district);
                setNeighborhoods(fetchedNeighborhoods);
            } else {
                console.warn('District is null');
                setNeighborhoods([]);
            }
            setAds(getData);
        } catch (error) {
            console.error('Failed to load ads', error);
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        loadAds();
    }, [loadAds]);

    useEffect(() => {
        const fetchStateName = async () => {
            if (ads?.state) {
                const name: any = await getState(ads.state);
                const state_label = name?.name;
                setStateName(state_label || '');
            }
            if (ads?.district) {
                const name: any = await getDistrict(ads.district);
                const district_label = name?.name;
                setDistrictName(district_label || '');
            }
        };
        fetchStateName();
    }, [ads?.state, ads?.district]);

    const back = (): void => {
        router.push('../?page=' + params.page);
    };

    const formatNumber = (value: any) => {
        const num = Number(String(value).replace(/,/g, ''));
        return num.toLocaleString();
    };

    if (isLoading) {
        return <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />;
    }

    return (
        <div className="card detailsData">
            <h5>مشاهده آگهی {ads?.title || ''}</h5>
            <hr />
            <div className="grid p-fluid mt-6">
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="title" value={ads?.title || ''} readOnly />
                        <label htmlFor="title">عنوان</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="purpose_label" value={ads?.purpose_label || ''} readOnly />
                        <label htmlFor="purpose_label">نوع معامله</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="location_label" value={ads?.location_label || ''} readOnly />
                        <label htmlFor="location_label">موقعیت ملک</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="directions" value={ads?.directions ? ads.directions.join(' - ') : ''} readOnly />
                        <label htmlFor="directions">جهت ملک</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="slug" value={ads?.slug || ''} readOnly />
                        <label htmlFor="slug">شناسه یکتا</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="area" value={ads?.area || ''} readOnly />
                        <label htmlFor="area">متراژ (متر)</label>
                    </span>
                </div>
                <div className={`field col-12 md:col-4 ${ads?.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" name="floors" value={ads?.floors || 0} readOnly />
                        <label htmlFor="floors">تعداد طبقات</label>
                    </span>
                </div>
                <div className={`field col-12 md:col-4 ${ads?.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" name="units_per_floor" value={ads?.units_per_floor || 0} readOnly />
                        <label htmlFor="units_per_floor">تعداد واحد در هر طبقه</label>
                    </span>
                </div>
                <div className={`field col-12 md:col-4 ${ads?.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputText name="age" value={ads?.age === '0' ? 'جدید' : ads?.age ? ads.age : ''} readOnly />
                        <label htmlFor="age">سن بنا</label>
                    </span>
                </div>
                <div className={`field col-12 md:col-4 ${ads?.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber name="rooms" value={ads?.rooms} readOnly />
                        <label htmlFor="rooms">تعداد اتاق خواب</label>
                    </span>
                </div>
                <div className={`field col-12 md:col-4 ${ads?.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber name="warehouses" value={ads?.warehouses} readOnly />
                        <label htmlFor="warehouses">تعداد انباری</label>
                    </span>
                </div>
                <div className={`field col-12 md:col-4 ${ads?.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber name="parking" value={ads?.parking} readOnly />
                        <label htmlFor="parking">تعداد پارکینگ</label>
                    </span>
                </div>
                <div className={`field col-12 md:col-4 ${ads?.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber name="elevators" value={ads?.elevators} readOnly />
                        <label htmlFor="elevators">تعداد آسانسور</label>
                    </span>
                </div>
                <div className={`field col-12 md:col-4 ${ads?.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber name="squat_toilets" value={ads?.squat_toilets} readOnly />
                        <label htmlFor="squat_toilets">تعداد سرویس ایرانی</label>
                    </span>
                </div>
                <div className={`field col-12 md:col-4 ${ads?.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber name="sitting_toilets" value={ads?.sitting_toilets} readOnly />
                        <label htmlFor="sitting_toilets">تعداد سرویس فرنگی</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="address" value={ads?.address} readOnly />
                        <label htmlFor="address">آدرس</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputNumber name="plate_number" value={ads?.plate_number} readOnly />
                        <label htmlFor="plate_number">شماره پلاک</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="owner_phone" value={ads?.owner_phone} readOnly />
                        <label htmlFor="owner_phone">شماره تماس</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="owner_phone2" value={ads?.owner_phone2 || ''} readOnly />
                        <label htmlFor="owner_phone2">شماره تماس</label>
                    </span>
                </div>
                <div className={`field col-12 md:col-4 ${ads?.purpose === 1 || ads?.purpose === 5 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputText type="text" name="rent_pre_paid_amount" value={formatNumber(ads?.rent_pre_paid_amount) + ' تومان '} readOnly />
                        <label htmlFor="rent_pre_paid_amount">ودیعه اجاره</label>
                    </span>
                </div>
                <div className={`field col-12 md:col-4 ${ads?.purpose === 1 || ads?.purpose === 4 || ads?.purpose === 5 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputText type="text" name="rent_price" value={formatNumber(ads?.rent_price) + ' تومان '} readOnly />
                        <label htmlFor="rent_price">مبلغ اجاره</label>
                    </span>
                </div>
                <div className={`field col-12 md:col-4 ${ads?.purpose === 2 || ads?.purpose === 3 || ads?.purpose === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputText type="text" name="unit_price" value={formatNumber(ads?.unit_price) + ' تومان '} readOnly />
                        <label htmlFor="unit_price">قیمت متری</label>
                    </span>
                </div>
                <div className={`field col-12 md:col-4 ${ads?.purpose === 2 || ads?.purpose === 3 || ads?.purpose === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputText type="text" name="total_price" value={formatNumber(ads?.total_price) + ' تومان '} readOnly />
                        <label htmlFor="total_price">قیمت کل</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="type_label" value={getTypeLabel(ads?.type!)} readOnly />
                        <label htmlFor="type_label">نوع ملک</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="stateName" value={stateName ?? ''} readOnly />
                        <label htmlFor="stateName">استان</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown type="text" name="city" id="city" value={cities.find((option) => option.id === ads?.city) || null} options={cities} optionLabel="name" placeholder="انتخاب کنید" className="w-full" readOnly />
                        <label htmlFor="city">شهر</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="district" value={districtName ?? ''} readOnly />
                        <label htmlFor="district">منطقه شهرداری</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown
                            type="text"
                            name="neighborhood"
                            id="neighborhood"
                            value={neighborhoods.find((option) => option.id === ads?.neighborhood) || null}
                            options={neighborhoods}
                            optionLabel="name"
                            placeholder="انتخاب کنید"
                            className="w-full"
                            readOnly
                        />
                        <label htmlFor="neighborhood">محله</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputTextarea name="description" value={ads?.description || ''} readOnly />
                        <label htmlFor="description">توضیحات</label>
                    </span>
                </div>
            </div>
            <div>
                <Button raised label="بازگشت" className="bg-gray-300 text-color border-0 mt-2" onClick={back} />
            </div>
        </div>
    );
};

export default AdsDetailsPage;
