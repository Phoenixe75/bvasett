'use client';
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {toast} from 'react-toastify';
import {Dropdown} from 'primereact/dropdown';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {IAdsBase, ICity, IDirection, IDistricts, INeighborhoods, IState} from '@/app/dashboard/admin/ads/(models)/ads';
import {getCitiesByState, getDistricts, getStates} from '@/app/dashboard/admin/ads/(services)/ads.service';
import ImageUploader from './imageUploader';
import {editPropertyAd} from '../../(services)/submitAd.service';
import {Property} from '../../../(models)/properties.types';
import {getProperty} from '../../../view-ad/(services)/viewAd.service';
import {InputTextarea} from 'primereact/inputtextarea';
import LoadingPage from '@/app/components/LoadingPage';
import {
  ageOption,
  directionsOption,
  locationOption,
  purposeOption,
  TypeOption
} from '@/app/dashboard/admin/ads/constant/converter';
import {MultiSelect, MultiSelectChangeEvent} from 'primereact/multiselect';
import {InputNumber} from 'primereact/inputnumber';
import {UnitInterface} from '@/types';
import {RegisterUnitUtil} from '@/utils/RegisterUnitUtil';

const deedsOptions = [
  {value: "old", label: 'قدیمی'},
  {value: "new", label: 'جدید'},
];
const statusOptions = [
  {value: 0, label: 'در حال بررسی'},
  {value: 1, label: 'تایید شده'},
  {value: 2, label: 'رد شده'},
]

interface EditPropertyForm {
  id: string
}

const EditPropertyForm = ({id}: EditPropertyForm) => {
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [districtsState, setDistrictsState] = useState<IDistricts[]>([]);
  const [neighborhoodsState, setNeighborhoodsState] = useState<INeighborhoods[]>([]);
  const [units, setUnits] = useState<Array<UnitInterface>>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Property>>({
    state: 0,
    electronic_estate_note_number: "",
    images: [],
    note_book_number: "",
    page_number: "",
    primary_plate_number: "",
    registration_unit: "",
    secondary_plate_number: "",
    notes: "",
    status: 0
  });
  const router = useRouter();

  const [adsFormData, setAdsFormData] = useState<IAdsBase>({
    active: null,
    complete: null,
    notes: null,
    ordering: 1,
    title: '',
    slug: '',
    location: null,
    directions: [],
    area: '',
    floor: null,
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
    rent_pre_paid_amount_rounded: '',
    rent_price: '',
    rent_price_rounded: '',
    unit_price: '',
    unit_price_rounded: '',
    total_price: '',
    total_price_rounded: '',
    sold: false,
    type: 0,
    state: 0,
    city: 0,
    postal_code: '',
  });
  const [directionsState, setDirectionsState] = useState<IDirection[]>([]);

  useEffect(() => {
    if (formData?.state) {
      if (formData.state == 6) {
        setUnits(RegisterUnitUtil.get(formData?.state)!);
      } else {
        setUnits([]);
      }
    }
  }, [formData, states]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const fetchedStates = await getStates();
        setStates(fetchedStates);
        const fetchedDistricts = await getDistricts();
        setDistrictsState(fetchedDistricts);
        const fetchedPropertyInfo = await getProperty(id);
        setFormData(fetchedPropertyInfo as any);
        setAdsFormData((fetchedPropertyInfo as any).ads?.[0] ?? {
          active: null,
          complete: null,
          notes: null,
          ordering: 1,
          title: '',
          slug: '',
          location: null,
          directions: [],
          area: '',
          floor: null,
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
          rent_pre_paid_amount_rounded: '',
          rent_price: '',
          rent_price_rounded: '',
          unit_price: '',
          unit_price_rounded: '',
          total_price: '',
          total_price_rounded: '',
          sold: false,
          type: 0,
          state: 0,
          city: 0,
          postal_code: '',
        });
        if (fetchedPropertyInfo.ads?.[0]?.state && fetchedPropertyInfo.ads?.[0]?.city) {
          const fetchedCities = await getCitiesByState(fetchedPropertyInfo.ads?.[0]?.state);
          setCities(fetchedCities);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleStateChange = async (e: any) => {
    const selectedStateId = e.value.id;
    setFormData((prev) => ({...prev, state: selectedStateId}));
    // setAdsFormData((prev) => ({...prev, state: selectedStateId}));
    // try {
    //   const fetchedCities = await getCitiesByState(selectedStateId);
    //   setCities(fetchedCities);
    // } catch (error) {
    //   console.error('Failed to fetch cities:', error);
    // }
  };

  const handelDeedsChange = async (e: any) => {
    const selectedDeedsId = e.value;
    setFormData((prev) => ({...prev, title_deeds_type: selectedDeedsId}));
  };
  const handelStatusChange = async (e: any) => {
    const selectedDeedsId = e.value;
    setFormData((prev) => ({...prev, status: selectedDeedsId}));
  };
  const onUploadImagesChange = (data: Property["images"]) => {
    setFormData((prev) => ({...prev, images: data}));
  }
  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newformData: any = {...formData};
    newformData.image_ids = formData?.images?.map(item => item.id) as any || [];
    delete newformData['images'];
    newformData.ad = adsFormData;
    delete newformData['ads'];
    try {
      setLoading(true);
      await editPropertyAd({
        ...newformData,

      }, id);
      toast.success('آگهی با موفقیت ویرایش شد');
      router.back()
    } catch (error) {
      toast.error('ویرایش آگهی با مشکل مواجه شد');
      console.error('Error updating slider:', error);
    } finally {
      setLoading(false)
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setFormData((prevData: any) => ({...prevData, [name]: value}));
  };
  const back = () => {
    router.back();
  };
  const formatNumber = (value: any) => {
    const num = Number(String(value).replace(/,/g, ''));
    return num.toLocaleString();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const fetchedStates = await getStates();
        setStates(fetchedStates);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <LoadingPage isLoading={loading}>
      <div className="card detailsData w-full">
        <h5>ثبت آگهی</h5>
        <hr/>
        <form onSubmit={submitForm} className="grid p-fluid mt-6" encType="multipart/form-data">
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
                              required
                            />
                            <label htmlFor="state">استان</label>
                        </span>
          </div>
          <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText type="text" name="registration_unit" required
                                       value={formData.registration_unit || ''} onChange={handleChange}/>
                            <label htmlFor="registration_unit">واحد ثبتی</label>
                        </span>
          </div>
          <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText type="text" name="primary_plate_number" required
                                       value={formData.primary_plate_number || ''} onChange={handleChange}/>
                            <label htmlFor="primary_plate_number">اصلی</label>
                        </span>
          </div>
          <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText type="text" name="secondary_plate_number"
                                       value={formData.secondary_plate_number || ''} onChange={handleChange}/>
                            <label htmlFor="secondary_plate_number">فرعی</label>
                        </span>
          </div>
          <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <Dropdown
                              type="text"
                              name="title_deeds_type"
                              value={deedsOptions.find((option) => option.value === formData.title_deeds_type)?.value || null}
                              onChange={handelDeedsChange}
                              options={deedsOptions}
                              placeholder="انتخاب کنید"
                              className="w-full"
                              required
                            />
                            <label htmlFor="title_deeds_type">نوع سند</label>
                        </span>
          </div>
          {formData.title_deeds_type === 'new' ? <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText type="text" name="electronic_estate_note_number" required
                                       value={formData.electronic_estate_note_number || ''} onChange={handleChange}/>
                            <label htmlFor="first_name">شماره دفتر الکترونیکی</label>
                        </span>
          </div> : null}
          {formData.title_deeds_type === 'old' ? <>
            <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText type="text" name="note_book_number" required
                                       value={formData.note_book_number || ''} onChange={handleChange}/>
                            <label htmlFor="note_book_number">شماره دفتر</label>
                        </span>
            </div>
            <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText type="text" name="page_number" required value={formData.page_number || ''}
                                       onChange={handleChange}/>
                            <label htmlFor="page_number">شماره صفحه</label>
                        </span>
            </div>
          </> : null}
          <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <Dropdown
                              type="text"
                              name="status"
                              value={statusOptions.find((option) => option.value === formData.status)?.value || null}
                              onChange={handelStatusChange}
                              options={statusOptions}
                              placeholder="انتخاب کنید"
                              className="w-full"
                              required
                            />
                            <label htmlFor="title_deeds_type">وضعیت آگهی</label>
                        </span>
          </div>
          <div className="field col-12">
                        <span className="p-float-label">
                            <InputTextarea name="notes" rows={3} required value={formData.notes || ''}
                                           onChange={handleChange}/>
                            <label htmlFor="notes">پاسخ ادمین</label>
                        </span>
          </div>
          <div className="col-12">
            <ImageUploader onChange={onUploadImagesChange} images={formData.images!}/>
          </div>
          <div className="col-12">
            <h3>اطلاعات آگهی</h3>
          </div>
          <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="title" id="title" autoComplete="off"
                                   value={adsFormData.title} disabled/>
                        <label htmlFor="title">عنوان</label>
                    </span>
          </div>
          <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown
                          type="text"
                          name="purpose"
                          id="purpose"
                          value={purposeOption.find((option) => option.code === adsFormData.purpose) || null}
                          options={purposeOption}
                          optionLabel="name"
                          placeholder="انتخاب کنید"
                          className="w-full"
                          disabled
                        />
                        <label htmlFor="purpose">
                            نوع معامله <span className="text-red-500">*</span>
                        </label>
                    </span>
          </div>
          <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown type="text" name="type" id="type"
                                  value={TypeOption.find((option) => option.code === adsFormData.type)}
                                  options={TypeOption} optionLabel="name"
                                  placeholder="انتخاب کنید" disabled/>
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
                          value={locationOption.find((option) => option.code === adsFormData.location) || null}
                          options={locationOption}
                          optionLabel="name"
                          placeholder="انتخاب کنید"
                          disabled
                        />
                        <label htmlFor="location">موقعیت ملک</label>
                    </span>
          </div>
          <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <MultiSelect name="directions" id="directions" value={directionsState}
                                     onChange={(e: MultiSelectChangeEvent) => setDirectionsState(e.value)}
                                     options={directionsOption}
                                     optionLabel="name"
                                     placeholder="انتخاب کنید"
                                     disabled/>
                        <label htmlFor="directions">جهت ملک</label>
                    </span>
          </div>
          <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="area" id="area" autoComplete="off" value={adsFormData.area}
                                   disabled/>
                        <label htmlFor="area">
                            متراژ (متر) <span className="text-red-500">*</span>
                        </label>
                    </span>
          </div>
          <div className={`field col-12 md:col-4 ${adsFormData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="floors"
                                     value={adsFormData.floors}
                                     disabled />
                        <label htmlFor="floors">
                            تعداد طبقات <span className="text-red-500">*</span>
                        </label>
                    </span>
          </div>
          <div className={`field col-12 md:col-4 ${adsFormData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputText type="text" id="floor" value={adsFormData.floor ?? ''}
                                   disabled />
                        <label htmlFor="floor">
                            طبقه<span className="text-red-500">*</span>
                        </label>
                    </span>
          </div>
          <div className={`field col-12 md:col-4 ${adsFormData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="units_per_floor"
                                     value={adsFormData.units_per_floor}
                                     disabled />
                        <label htmlFor="units_per_floor">
                            تعداد واحد در هر طبقه <span className="text-red-500">*</span>
                        </label>
                    </span>
          </div>
          <div className={`field col-12 md:col-4 ${adsFormData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <Dropdown
                          type="text"
                          name="age"
                          id="age"
                          value={ageOption.find((option) => option.code === adsFormData.age) || null}
                          options={ageOption}
                          optionLabel="name"
                          placeholder="انتخاب کنید"
                          disabled
                        />
                        <label htmlFor="age">
                            سن بنا <span className="text-red-500">*</span>
                        </label>
                    </span>
          </div>
          <div className={`field col-12 md:col-4 ${adsFormData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="rooms" value={adsFormData.rooms}
                                     disabled />
                        <label htmlFor="rooms">
                            تعداد اتاق خواب <span className="text-red-500">*</span>
                        </label>
                    </span>
          </div>
          <div className={`field col-12 md:col-4 ${adsFormData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="warehouses" value={adsFormData.warehouses}
                                     disabled />
                        <label htmlFor="warehouses">
                            تعداد انباری <span className="text-red-500">*</span>
                        </label>
                    </span>
          </div>
          <div className={`field col-12 md:col-4 ${adsFormData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="parking" value={adsFormData.parking}
                                     disabled />
                        <label htmlFor="parking">
                            تعداد پارکینگ <span className="text-red-500">*</span>
                        </label>
                    </span>
          </div>
          <div className={`field col-12 md:col-4 ${adsFormData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="elevators" value={adsFormData.elevators}
                                     disabled />
                        <label htmlFor="elevators">
                            تعداد آسانسور <span className="text-red-500">*</span>
                        </label>
                    </span>
          </div>
          <div className={`field col-12 md:col-4 ${adsFormData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="squat_toilets" value={adsFormData.squat_toilets}
                                     disabled />
                        <label htmlFor="squat_toilets">
                            تعداد سرویس ایرانی <span className="text-red-500">*</span>
                        </label>
                    </span>
          </div>
          <div className={`field col-12 md:col-4 ${adsFormData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="sitting_toilets"
                                     value={adsFormData.sitting_toilets}
                                     disabled/>

                        <label htmlFor="sitting_toilets">
                            تعداد سرویس فرنگی <span className="text-red-500">*</span>
                        </label>
                    </span>
          </div>
          <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text"
                                   autoComplete="off"
                                   id="address"
                                   value={adsFormData.address}
                                   disabled
                        />
                        <label htmlFor="address">
                            آدرس <span className="text-red-500">*</span>
                        </label>
                    </span>
          </div>
          <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputNumber type="text"
                                     id="plate_number"
                                     value={adsFormData.plate_number}
                                     disabled />
                        <label htmlFor="plate_number">
                            شماره پلاک <span className="text-red-500">*</span>
                        </label>
                    </span>
          </div>
          <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="owner_name" id="owner_name" autoComplete="off"
                                   value={adsFormData.owner_name}
                                   disabled />
                        <label htmlFor="owner_name">
                            نام مالک <span className="text-red-500">*</span>
                        </label>
                    </span>
          </div>
          <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="postal_code" id="postal_code" autoComplete="off"
                                   value={adsFormData.postal_code}
                                   disabled />
                        <label htmlFor="postal_code">
                            کد پستی <span className="text-red-500">*</span>
                        </label>
                    </span>
          </div>
          <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="owner_phone" id="owner_phone" autoComplete="off"
                                   value={adsFormData.owner_phone}
                                   disabled />
                        <label htmlFor="owner_phone">
                            شماره تماس مالک <span className="text-red-500">*</span>
                        </label>
                    </span>
          </div>
          <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text"
                                   name="owner_phone2"
                                   id="owner_phone2"
                                   autoComplete="off"
                                   disabled
                                   value={adsFormData.owner_phone2 ?? ''}/>
                        <label htmlFor="owner_phone2">شماره تماس مالک</label>
                    </span>
          </div>

          <div
            className={`field col-12 md:col-4 ${adsFormData.purpose === 1 || adsFormData.purpose === 5 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputText type="text" autoComplete="off" id="rent_pre_paid_amount"
                                   disabled
                                   value={formatNumber(adsFormData.rent_pre_paid_amount)}/>
                        <label htmlFor="rent_pre_paid_amount">
                            ودیعه اجاره <span className="text-red-500">*</span>
                        </label>
                    </span>
          </div>
          <div
            className={`field col-12 md:col-4 ${adsFormData.purpose === 1 || adsFormData.purpose === 4 || adsFormData.purpose === 5 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputText type="text" autoComplete="off" id="rent_price"
                                   disabled
                                   value={formatNumber(adsFormData.rent_price)}/>
                        <label htmlFor="rent_price">
                            مبلغ اجاره <span className="text-red-500">*</span>
                        </label>
                    </span>
          </div>
          <div
            className={`field col-12 md:col-4 ${adsFormData.purpose === 2 || adsFormData.purpose === 3 || adsFormData.purpose === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputText type="text" autoComplete="off" id="unit_price"
                                   disabled
                                   value={formatNumber(adsFormData.unit_price)}/>
                        <label htmlFor="unit_price">
                            قیمت متری <span className="text-red-500">*</span>
                        </label>
                    </span>
          </div>
          <div
            className={`field col-12 md:col-4 ${adsFormData.purpose === 2 || adsFormData.purpose === 3 || adsFormData.purpose === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputText type="text" autoComplete="off" id="total_price"
                                   disabled
                                   value={formatNumber(adsFormData.total_price)}/>
                        <label htmlFor="total_price">
                            قیمت کل<span className="text-red-500">*</span>
                        </label>
                    </span>
          </div>

          <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown
                          type="text"
                          name="state"
                          id="state"
                          value={states.find((option) => option.id === adsFormData.state) || null}
                          options={states}
                          optionLabel="name"
                          placeholder="انتخاب کنید"
                          className="w-full"
                          filter
                          disabled
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
                          disabled
                          value={cities.find((option) => option.id === adsFormData.city) || null}
                          options={cities}
                          optionLabel="name"
                          placeholder="انتخاب کنید"
                          className="w-full"
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
                          value={districtsState.find((option) => option.id === adsFormData.district) || null}
                          options={districtsState}
                          optionLabel="name"
                          placeholder="انتخاب کنید"
                          className="w-full"
                          disabled
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
                          value={neighborhoodsState.find((option) => option.id === adsFormData.neighborhood) || null}
                          options={neighborhoodsState}
                          optionLabel="name"
                          placeholder="انتخاب کنید"
                          className="w-full"
                          disabled
                          filter
                        />
                        <label htmlFor="neighborhood">محله</label>
                    </span>
          </div>
          {/*<div className="field col-12 md:col-4">*/}
          {/*      <span className="p-float-label">*/}
          {/*          <Dropdown*/}
          {/*            type="text"*/}
          {/*            name="active"*/}
          {/*            id="active"*/}
          {/*            value={activeOption.find((option) => option.code === adsFormData.active)}*/}
          {/*            onChange={(e) => setAdsValue('active', e.value.code)}*/}
          {/*            options={activeOption}*/}
          {/*            optionLabel="name"*/}
          {/*            placeholder="انتخاب کنید"*/}
          {/*            className="w-full"*/}
          {/*          />*/}
          {/*          <label htmlFor="active">وضعیت آگهی</label>*/}
          {/*      </span>*/}
          {/*</div>*/}
          {/*<div className="field col-12 md:col-4">*/}
          {/*      <span className="p-float-label">*/}
          {/*          <Dropdown*/}
          {/*            type="text"*/}
          {/*            name="complete"*/}
          {/*            id="complete"*/}
          {/*            value={completeOption.find((option) => option.code === adsFormData.complete)}*/}
          {/*            onChange={(e) => setAdsValue('complete', e.value.code)}*/}
          {/*            options={completeOption}*/}
          {/*            optionLabel="name"*/}
          {/*            placeholder="انتخاب کنید"*/}
          {/*            className="w-full"*/}
          {/*          />*/}
          {/*          <label htmlFor="complete">وضعیت تکمیل</label>*/}
          {/*      </span>*/}
          {/*</div>*/}
          <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputTextarea name="description" id="description" autoComplete="off"
                                       disabled
                                       value={adsFormData.description ?? ''}/>
                        <label htmlFor="description">توضیحات</label>
                    </span>
          </div>
          <div className="col-12">
            <div className="field flex col-12 md:col-2">
              <Button raised type="submit" label="ثبت" className="bg-green-500 text-white border-0 mt-2 ml-2"
                      disabled={loading} loading={loading}/>
              <Button raised label="بازگشت" type="button" className="bg-gray-300 text-color border-0 mt-2"
                      onClick={back}/>
            </div>
          </div>
        </form>
      </div>
    </LoadingPage>
  );
};

export default EditPropertyForm;
