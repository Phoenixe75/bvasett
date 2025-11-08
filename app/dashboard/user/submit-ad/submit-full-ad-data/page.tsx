'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

// primereact
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';

// models
import { createAds, getCitiesByState, getDistricts, getNeighborhoodsByDistrict, getStates } from '@/app/dashboard/admin/ads/(services)/ads.service';
import { DirectionEnum, IAdsBase, ICity, IDirection, IDistricts, INeighborhoods, IState } from '@/app/dashboard/admin/ads/(models)/ads';

// converter
import { activeOption, ageOption, completeOption, directionsOption, locationOption, purposeOption, TypeOption } from '@/app/dashboard/admin/ads/constant/converter';
import { InputTextarea } from 'primereact/inputtextarea';
import InitialData from './components/initialData';

const NewAds = () => {
    const [directionsState, setDirectionsState] = useState<IDirection[]>([]);
    const [formData, setFormData] = useState<IAdsBase>({
        active: null,
        complete: null,
        ordering: 1,
        title: '',
        slug: '',
        location: null,
        directions: [],
        area: '',
        floors: null,
        units_per_floor: null,
        age: null,
        rooms: null,
        warehouses: null,
        parking: null,
        elevators: null,
        squat_toilets: null,
        sitting_toilets: null,
        district: null,
        neighborhood: null,
        address: '',
        plate_number: null,
        owner_name: '',
        owner_phone: '',
        owner_phone2: null,
        description: null,
        purpose: null,
        rent_pre_paid_amount: '',
        rent_price: '',
        unit_price: '',
        total_price: '',
        sold: false,
        type: 0,
        state: 0,
        city: 0
    });

    const [states, setStates] = useState<IState[]>([]);
    const [cities, setCities] = useState<ICity[]>([]);
    const [districtsState, setDistrictsState] = useState<IDistricts[]>([]);
    const [neighborhoodsState, setNeighborhoodsState] = useState<INeighborhoods[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const loading = useRef(false);
    const router = useRouter();
    const params = useSearchParams();
    
    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    useEffect(() => {
        setFormData((prevState: IAdsBase) => ({
            ...prevState,
            directions: directionsState.map((direction: IDirection) => direction.code as DirectionEnum)
        }));
    }, [directionsState]);

    const setValue = useCallback((fieldName: string, fieldValue: any) => {
        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: fieldValue
        }));
    }, []);

    const submitForm = async (e: any) => {
        e.preventDefault();
        try {
            loading.current = true;

            const filterNullValues = (data: IAdsBase) => {
                return Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== null && value !== ''));
            };

            const filteredData = {...filterNullValues(formData), related_property:params.get("id")} as Record<string,any>;
            await createAds(filteredData);
            toast.success('آگهی ثبت شد');
            router.back();
            if (filteredData.purpose === 1 || filteredData.purpose === 5) {
                if (filteredData.type === 1 || filteredData.type === 2 || filteredData.type === 3 || filteredData.type === 5) {
                    await createAds(filteredData);
                    toast.success('آگهی ثبت شد');
                    router.back();
                } else if (filteredData.type === 4) {
                    await createAds(filteredData);
                    toast.success('آگهی ثبت شد');
                    router.back();
                }
            } else if (filteredData.purpose === 2 || filteredData.purpose === 3) {
                if (filteredData.type === 1 || filteredData.type === 2 || filteredData.type === 3 || filteredData.type === 5) {
                    await createAds(filteredData);
                    toast.success('آگهی ثبت شد');
                    router.back();
                } else if (filteredData.type === 4) {
                    await createAds(filteredData);
                    toast.success('آگهی ثبت شد');
                    router.back();
                }
            } else if (filteredData.purpose === 4) {
                if (filteredData.type === 1 || filteredData.type === 2 || filteredData.type === 3 || filteredData.type === 5) {
                    await createAds(filteredData);
                    toast.success('آگهی ثبت شد');
                    router.back();
                } else if (filteredData.type === 4) {
                    await createAds(filteredData);
                    toast.success('آگهی ثبت شد');
                    router.back();
                }
            }
        } catch (error) {
            toast.error('ثبت آگهی با خطا روبرو شد');
            console.error('Failed to create ad:', error);
        } finally {
            loading.current = false;
        }
    };

    const back = (): void => {
        router.back();
    };

    const handleLocationChange = (e: any) => {
        const selectedLocationCode = e.value ? e.value.code : null;
        setFormData({ ...formData, location: selectedLocationCode });
    };

    const handleAgeChange = (e: any) => {
        const selectedAgeCode = e.value ? e.value.code : null;
        setFormData({ ...formData, age: selectedAgeCode });
    };

    const handlePurposeChange = (e: any) => {
        const selectedPurposeCode = e.value ? e.value.code : null;
        setFormData({ ...formData, purpose: selectedPurposeCode });
    };

    const handleTypeChange = (e: any) => {
        const selectedTypeCode = e.value ? e.value.code : null;
        setFormData({ ...formData, type: selectedTypeCode });
    };

    const handleStateDropdownFocus = async () => {
        try {
            const fetchedStates = await getStates();
            setStates(fetchedStates);
        } catch (error) {
            console.error('Failed to fetch states:', error);
        }
    };

    const handleDistrictDropdownFocus = async () => {
        try {
            const fetchedDistricts = await getDistricts();
            setDistrictsState(fetchedDistricts);
        } catch (error) {
            console.error('Failed to fetch Districts:', error);
        }
    };

    const handleStateChange = async (e: any) => {
        const selectedStateId = e.value.id;
        setValue('state', selectedStateId);
        try {
            const fetchedCities = await getCitiesByState(selectedStateId);
            setCities(fetchedCities);
        } catch (error) {
            console.error('Failed to fetch cities:', error);
        }
    };

    const handleDistrictChange = async (e: any) => {
        const selectedDistrictId = e.value.id;
        setValue('district', selectedDistrictId);
        try {
            const fetchedNeighborhoods = await getNeighborhoodsByDistrict(selectedDistrictId);
            setNeighborhoodsState(fetchedNeighborhoods);
        } catch (error) {
            console.error('Failed to fetch Neighborhoods:', error);
        }
    };

    const formatNumber = (value: any) => {
        const num = Number(String(value).replace(/,/g, ''));
        return num.toLocaleString();
    };

    const parseNumber = (value: string) => {
        return Number(value.replace(/,/g, ''));
    };

    return (
        <div className="card detailsData">
            <h5>ثبت آگهی</h5>
            <hr />
            <h5>اطلاعات اولیه</h5>
            <InitialData />
            <hr />
            <h5>اطلاعات تکمیلی آگهی</h5>
            <hr />
            <form onSubmit={submitForm} className="grid p-fluid mt-6">
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" ref={inputRef} name="title" id="title" autoComplete="off" value={formData.title} onChange={(e) => setValue('title', e.target.value)} required />
                        <label htmlFor="title">عنوان</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown
                            type="text"
                            name="purpose"
                            id="purpose"
                            value={purposeOption.find((option) => option.code === formData.purpose) || null}
                            onChange={handlePurposeChange}
                            options={purposeOption}
                            optionLabel="name"
                            placeholder="انتخاب کنید"
                            className="w-full"
                            required
                        />
                        <label htmlFor="purpose">
                            نوع معامله <span className="text-red-500">*</span>
                        </label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown type="text" name="type" id="type" value={TypeOption.find((option) => option.code === formData.type)} onChange={handleTypeChange} options={TypeOption} optionLabel="name" placeholder="انتخاب کنید" required />
                        <label htmlFor="type">
                            نوع ملک <span className="text-red-500">*</span>
                        </label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown
                            type="text"
                            name="location"
                            id="location"
                            value={locationOption.find((option) => option.code === formData.location) || null}
                            onChange={handleLocationChange}
                            options={locationOption}
                            optionLabel="name"
                            placeholder="انتخاب کنید"
                            required
                        />
                        <label htmlFor="location">موقعیت ملک</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <MultiSelect name="directions" id="directions" value={directionsState} onChange={(e: MultiSelectChangeEvent) => setDirectionsState(e.value)} options={directionsOption} optionLabel="name" placeholder="انتخاب کنید" required />
                        <label htmlFor="directions">جهت ملک</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="slug" id="slug" autoComplete="off" value={formData.slug} onChange={(e) => setValue('slug', e.target.value)} />
                        <label htmlFor="slug">شناسه یکتا</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="area" id="area" autoComplete="off" value={formData.area} onChange={(e) => setValue('area', e.target.value)} required />
                        <label htmlFor="area">
                            متراژ (متر) <span className="text-red-500">*</span>
                        </label>
                    </span>
                </div>
                <div className={`field col-12 md:col-4 ${formData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="floors" value={formData.floors} onChange={(e) => setValue('floors', e.value)} disabled={formData.type === 4} required={formData.type !== 4} />
                        <label htmlFor="floors">
                            تعداد طبقات <span className="text-red-500">*</span>
                        </label>
                    </span>
                </div>
                <div className={`field col-12 md:col-4 ${formData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="units_per_floor" value={formData.units_per_floor} onChange={(e) => setValue('units_per_floor', e.value)} disabled={formData.type == 4} required={formData.type !== 4} />
                        <label htmlFor="units_per_floor">
                            تعداد واحد در هر طبقه <span className="text-red-500">*</span>
                        </label>
                    </span>
                </div>
                <div className={`field col-12 md:col-4 ${formData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <Dropdown
                            type="text"
                            name="age"
                            id="age"
                            value={ageOption.find((option) => option.code === formData.age) || null}
                            onChange={handleAgeChange}
                            options={ageOption}
                            optionLabel="name"
                            placeholder="انتخاب کنید"
                            disabled={formData.type == 4}
                            required={formData.type !== 4}
                        />
                        <label htmlFor="age">
                            سن بنا <span className="text-red-500">*</span>
                        </label>
                    </span>
                </div>
                <div className={`field col-12 md:col-4 ${formData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="rooms" value={formData.rooms} onChange={(e) => setValue('rooms', e.value)} disabled={formData.type == 4} required={formData.type !== 4} />
                        <label htmlFor="rooms">
                            تعداد اتاق خواب <span className="text-red-500">*</span>
                        </label>
                    </span>
                </div>
                <div className={`field col-12 md:col-4 ${formData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="warehouses" value={formData.warehouses} onChange={(e) => setValue('warehouses', e.value)} disabled={formData.type == 4} required={formData.type !== 4} />
                        <label htmlFor="warehouses">
                            تعداد انباری <span className="text-red-500">*</span>
                        </label>
                    </span>
                </div>
                <div className={`field col-12 md:col-4 ${formData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="parking" value={formData.parking} onChange={(e) => setValue('parking', e.value)} disabled={formData.type == 4} required={formData.type !== 4} />
                        <label htmlFor="parking">
                            تعداد پارکینگ <span className="text-red-500">*</span>
                        </label>
                    </span>
                </div>
                <div className={`field col-12 md:col-4 ${formData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="elevators" value={formData.elevators} onChange={(e) => setValue('elevators', e.value)} disabled={formData.type == 4} required={formData.type !== 4} />
                        <label htmlFor="elevators">
                            تعداد آسانسور <span className="text-red-500">*</span>
                        </label>
                    </span>
                </div>
                <div className={`field col-12 md:col-4 ${formData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="squat_toilets" value={formData.squat_toilets} onChange={(e) => setValue('squat_toilets', e.value)} disabled={formData.type == 4} required={formData.type !== 4} />
                        <label htmlFor="squat_toilets">
                            تعداد سرویس ایرانی <span className="text-red-500">*</span>
                        </label>
                    </span>
                </div>
                <div className={`field col-12 md:col-4 ${formData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="sitting_toilets" value={formData.sitting_toilets} onChange={(e) => setValue('sitting_toilets', e.value)} disabled={formData.type == 4} required={formData.type !== 4} />

                        <label htmlFor="sitting_toilets">
                            تعداد سرویس فرنگی <span className="text-red-500">*</span>
                        </label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" autoComplete="off" id="address" value={formData.address} onChange={(e) => setValue('address', e.target.value)} required />
                        <label htmlFor="address">
                            آدرس <span className="text-red-500">*</span>
                        </label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputNumber type="text" id="plate_number" value={formData.plate_number} onChange={(e) => setValue('plate_number', e.value)} required />
                        <label htmlFor="plate_number">
                            شماره پلاک <span className="text-red-500">*</span>
                        </label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="owner_name" id="owner_name" autoComplete="off" value={formData.owner_name} onChange={(e) => setValue('owner_name', e.target.value)} required />
                        <label htmlFor="owner_name">
                            نام مالک <span className="text-red-500">*</span>
                        </label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="owner_phone" id="owner_phone" autoComplete="off" value={formData.owner_phone} onChange={(e) => setValue('owner_phone', e.target.value)} required />
                        <label htmlFor="owner_phone">
                            شماره تماس مالک <span className="text-red-500">*</span>
                        </label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="owner_phone2" id="owner_phone2" autoComplete="off" value={formData.owner_phone2 ?? ''} onChange={(e) => setValue('owner_phone2', e.target.value)} />
                        <label htmlFor="owner_phone2">شماره تماس مالک</label>
                    </span>
                </div>

                <div className={`field col-12 md:col-4 ${formData.purpose === 1 || formData.purpose === 5 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputText type="text" autoComplete="off" id="rent_pre_paid_amount" value={formatNumber(formData.rent_pre_paid_amount)} onChange={(e) => setValue('rent_pre_paid_amount', parseNumber(e.target.value))} />
                        <label htmlFor="rent_pre_paid_amount">
                            ودیعه اجاره <span className="text-red-500">*</span>
                        </label>
                    </span>
                </div>
                <div className={`field col-12 md:col-4 ${formData.purpose === 1 || formData.purpose === 4 || formData.purpose === 5 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputText type="text" autoComplete="off" id="rent_price" value={formatNumber(formData.rent_price)} onChange={(e) => setValue('rent_price', parseNumber(e.target.value))} />
                        <label htmlFor="rent_price">
                            مبلغ اجاره <span className="text-red-500">*</span>
                        </label>
                    </span>
                </div>
                <div className={`field col-12 md:col-4 ${formData.purpose === 2 || formData.purpose === 3 || formData.purpose === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputText type="text" autoComplete="off" id="unit_price" value={formatNumber(formData.unit_price)} onChange={(e) => setValue('unit_price', parseNumber(e.target.value))} />
                        <label htmlFor="unit_price">
                            قیمت <span className="text-red-500">*</span>
                        </label>
                    </span>
                </div>

                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown
                            type="text"
                            name="state"
                            id="state"
                            value={states.find((option) => option.id === formData.state) || null}
                            onChange={handleStateChange}
                            options={states}
                            optionLabel="name"
                            placeholder="انتخاب کنید"
                            className="w-full"
                            onFocus={handleStateDropdownFocus}
                            filter
                        />
                        <label htmlFor="state">استان</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown
                            type="text"
                            name="city"
                            id="city"
                            value={cities.find((option) => option.id === formData.city) || null}
                            onChange={(e) => setValue('city', e.value.id)}
                            options={cities}
                            optionLabel="name"
                            placeholder="انتخاب کنید"
                            className="w-full"
                            disabled={states.length === 0}
                            filter
                        />
                        <label htmlFor="city">شهر</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown
                            type="text"
                            name="district"
                            id="district"
                            value={districtsState.find((option) => option.id === formData.district) || null}
                            onChange={handleDistrictChange}
                            options={districtsState}
                            optionLabel="name"
                            placeholder="انتخاب کنید"
                            className="w-full"
                            onFocus={handleDistrictDropdownFocus}
                            disabled={cities.length === 0}
                        />
                        <label htmlFor="state">منطقه شهرداری</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown
                            type="text"
                            name="neighborhood"
                            id="neighborhood"
                            value={neighborhoodsState.find((option) => option.id === formData.neighborhood) || null}
                            onChange={(e) => setValue('neighborhood', e.value.id)}
                            options={neighborhoodsState}
                            optionLabel="name"
                            placeholder="انتخاب کنید"
                            className="w-full"
                            disabled={cities.length === 0}
                            filter
                        />
                        <label htmlFor="neighborhood">محله</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown
                            type="text"
                            name="active"
                            id="active"
                            value={activeOption.find((option) => option.code === formData.active)}
                            onChange={(e) => setValue('active', e.value.code)}
                            options={activeOption}
                            optionLabel="name"
                            placeholder="انتخاب کنید"
                            className="w-full"
                        />
                        <label htmlFor="active">وضعیت آگهی</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown
                            type="text"
                            name="complete"
                            id="complete"
                            value={completeOption.find((option) => option.code === formData.complete)}
                            onChange={(e) => setValue('complete', e.value.code)}
                            options={completeOption}
                            optionLabel="name"
                            placeholder="انتخاب کنید"
                            className="w-full"
                        />
                        <label htmlFor="complete">وضعیت تکمیل</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputTextarea name="description" id="description" autoComplete="off" value={formData.description ?? ''} onChange={(e) => setValue('description', e.target.value)} />
                        <label htmlFor="description">توضیحات</label>
                    </span>
                </div>
                <div className="col-12">
                    <div className="field flex col-12 md:col-2 ">
                        <Button onClick={(e)=>submitForm(e)} raised type="submit" label="ثبت" className="bg-green-500 text-white border-0 mt-2 ml-2" disabled={loading.current} loading={loading.current} />
                        <Button raised label="بازگشت" type="button" className="bg-gray-300 text-color border-0 mt-2" onClick={back} />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default NewAds;
