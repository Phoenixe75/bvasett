'use client';
import React, {useCallback, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {toast} from 'react-toastify';
import {Dropdown} from 'primereact/dropdown';
import {InputText} from 'primereact/inputtext';
import {
  DirectionEnum,
  IAdsBase,
  ICity,
  IDirection,
  IDistricts,
  INeighborhoods,
  IState
} from '@/app/dashboard/admin/ads/(models)/ads';
import {
  getCitiesByState,
  getDistricts,
  getNeighborhoodsByDistrict,
  getStates
} from '@/app/dashboard/admin/ads/(services)/ads.service';
import {SubmitAdFormData} from '../../(models)/submitAdTypes';
import ImageUploader from './imageUploader';
import {createAd} from '../../(services)/submitAd.service';
import {InputNumber} from 'primereact/inputnumber';
import {
  ageOption,
  directionsOption,
  locationOption,
  purposeOption,
  TypeOption
} from '@/app/dashboard/admin/ads/constant/converter';
import {MultiSelect, MultiSelectChangeEvent} from 'primereact/multiselect';
import {InputTextarea} from 'primereact/inputtextarea';
import {Button} from 'primereact/button';
import {RegisterUnitUtil} from '@/utils/RegisterUnitUtil';
import {UnitInterface} from '@/types';

const deedsOptions = [
  {value: "old", label: 'قدیمی'},
  {value: "new", label: 'جدید'},
];
const SubmitAdForm = ({params}: { params: { id: number } }) => {
  const [initDataImage, setInitDataImage] = useState<any>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | File | null>(null);
  const [states, setStates] = useState<IState[]>([]);
  const [loading, setLoading] = useState(false);
  const [directionsState, setDirectionsState] = useState<IDirection[]>([]);
  const [formData, setFormData] = useState<SubmitAdFormData>({
    state: 0,
    electronic_estate_note_number: 0,
    image_ids: [],
    note_book_number: "",
    page_number: "",
    primary_plate_number: null,
    registration_unit: "",
    secondary_plate_number: null,
    title_deeds_type: null,
  });
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
  const [cities, setCities] = useState<ICity[]>([]);
  const [districtsState, setDistrictsState] = useState<IDistricts[]>([]);
  const [neighborhoodsState, setNeighborhoodsState] = useState<INeighborhoods[]>([]);
  const [units, setUnits] = useState<Array<UnitInterface>>([]);
  const router = useRouter();

  useEffect(() => {
    if (formData?.state) {
      if (formData.state == 6) {
        setUnits(RegisterUnitUtil.get(formData?.state)!);
      } else {
        setUnits([]);
      }
    }
  }, [formData, states]);

  const handleDistrictDropdownFocus = async () => {
    try {
      const fetchedDistricts = await getDistricts();
      setDistrictsState(fetchedDistricts);
    } catch (error) {
      console.error('Failed to fetch Districts:', error);
    }
  };

  const formatNumber = (value: any) => {
    const num = Number(String(value).replace(/,/g, ''));
    return num.toLocaleString();
  };

  const handleLocationChange = (e: any) => {
    const selectedLocationCode = e.value ? e.value.code : null;
    setAdsFormData({...adsFormData, location: selectedLocationCode});
  };

  const handleAgeChange = (e: any) => {
    const selectedAgeCode = e.value ? e.value.code : null;
    setAdsFormData({...adsFormData, age: selectedAgeCode});
  };

  const handlePurposeChange = (e: any) => {
    const selectedPurposeCode = e.value ? e.value.code : null;
    setAdsFormData({...adsFormData, purpose: selectedPurposeCode});
  };

  const handleTypeChange = (e: any) => {
    const selectedTypeCode = e.value ? e.value.code : null;
    setAdsFormData({...adsFormData, type: selectedTypeCode});
  };

  const parseNumber = (value: string) => {
    return Number(value.replace(/,/g, ''));
  };

  const handleStateDropdownFocus = async () => {
    try {
      const fetchedStates = await getStates();
      setStates(fetchedStates);
    } catch (error) {
      console.error('Failed to fetch states:', error);
    }
  };

  const handleDistrictChange = async (e: any) => {
    const selectedDistrictId = e.value.id;
    setAdsValue('district', selectedDistrictId);
    try {
      const fetchedNeighborhoods = await getNeighborhoodsByDistrict(selectedDistrictId);
      setNeighborhoodsState(fetchedNeighborhoods);
    } catch (error) {
      console.error('Failed to fetch Neighborhoods:', error);
    }
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

  useEffect(() => {
    setAdsFormData((prevState: IAdsBase) => ({
      ...prevState,
      directions: directionsState.map((direction: IDirection) => direction.code as DirectionEnum)
    }));
  }, [directionsState]);

  const handleStateChange = async (e: any) => {
    const selectedStateId = e.value.id;
    setFormData((prev) => ({...prev, state: selectedStateId}));
    setAdsFormData((prev) => ({...prev, state: selectedStateId}));
    try {
      const fetchedCities = await getCitiesByState(selectedStateId);
      setCities(fetchedCities);
    } catch (error) {
      console.error('Failed to fetch cities:', error);
    }
  };

  const handleUnitChange = async (e: any) => {
    const selectedUnitTitle = e.value.title;
    setFormData((prev) => ({...prev, registration_unit: selectedUnitTitle}));
  };

  const handelDeedsChange = async (e: any) => {
    const selectedDeedsId = e.value;
    setFormData((prev) => ({...prev, title_deeds_type: selectedDeedsId}));
  };
  const onUploadImagesChange = (data: number[]) => {
    setFormData((prev) => ({...prev, image_ids: data}));
  }


  const setValue = useCallback((fieldName: string, fieldValue: any) => {
    setFormData((prevState: any) => ({
      ...prevState,
      [fieldName]: fieldValue
    }));
  }, []);

  const setAdsValue = useCallback((fieldName: string, fieldValue: any) => {
    setAdsFormData((prevState: any) => ({
      ...prevState,
      [fieldName]: fieldValue
    }));
  }, []);


  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const filterNullValues = (data: IAdsBase) => {
        return Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== null && value !== ''));
      };

      const filteredAdsData = filterNullValues(adsFormData);
      await createAd({
        ...formData,
        ad: {
          ...filteredAdsData
        }
      });
      toast.success('آگهی با موفقیت ثبت شد');
      setTimeout(() => {
        router.back()
      }, 1500)
    } catch (error) {
      toast.error('ثبت آگهی با مشکل مواجه شد');
      console.error('Error updating slider:', error);
    } finally {
      setLoading(false)
    }
  };
  const handleChange = (e: any) => {
    const {name, value} = e.target;
    setFormData((prevData: any) => ({...prevData, [name]: value}));
  };
  const back = () => {
    router.back();
  };

  return (
    <div className="card detailsData w-full">
      <div className="guide-box mt-3">
        <p className="font-bold mb-1 rtl">
          در این پلتفرم (سایت و اپ) صرفا آگهی ملک مالکین دارای سند رسمی ثبت میگردد بدین منظور به جهت احراز مالکیت آگهی
          گذار ثبت اطلاعات ذیل الزامیست
        </p>
        <p className="font-bold mb-0 rtl">
          <i className="pi pi-info-circle fs-md ml-2"
             style={{display: "inline-block", verticalAlign: "middle", fontSize: "20px"}}></i>
          توجه : این اطلاعات در پلتفرم قابل ذخیره نیست و صرفا از طریق سامانه رسمی ثبت من استعلام مالکیت أخذ میگردد. لازم
          به ذکر است نام مالک و کد ملی که در سند قید می‌باشد قابلیت احراز مالکیت دارد.
        </p>
        <p className="font-bold mb-0 rtl">
          <i className="pi pi-info-circle fs-md ml-2"
             style={{display: "inline-block", verticalAlign: "middle", fontSize: "20px"}}></i>
          مالک محترم اگهی گذار توجه فرمایید :
          بنا بر فانون جدید سازمان ثبت و املاک کشور
          املاکی قابل معامله و انتفال سند هستند که به صورت تک برگ زرد یا سبز باشن ، و سند های دفترچه ای فاقد اعتبار   تنظیم سندی میباشد ، لذا قبل از اقدام به فروش ملک خود، نسبت به تعویض سند، از دفترچه ای به تک برگ اقدام نمایید
          (پشتیبانی تیم حقوقی بی واسط)
        </p>
      </div>
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
          {formData.state === 6 ? (<span className="p-float-label">
                        <Dropdown
                          type="text"
                          name="registration_unit"
                          id="registration_unit"
                          value={units.find((option) => option.title === formData.registration_unit) || null}
                          onChange={handleUnitChange}
                          options={units}
                          optionLabel="title"
                          placeholder="انتخاب کنید"
                          className="w-full"
                          required
                        />
                        <label htmlFor="registration_unit">واحد ثبتی</label>
                    </span>) : (<span className="p-float-label">
                <InputText type="text" name="registration_unit" required
                           value={formData.registration_unit || ''} onChange={handleChange}/>
            <label htmlFor="registration_unit">واحد ثبتی</label>
          </span>)}
        </div>
        <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputNumber name="primary_plate_number"
                                     required
                                     value={formData.primary_plate_number}
                                     onChange={(e) => handleChange({
                                       target: {
                                         ...e,
                                         name: 'primary_plate_number'
                                       }
                                     })}/>
                        <label htmlFor="primary_plate_number">اصلی</label>
                    </span>
        </div>
        <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputNumber name="secondary_plate_number"
                                     value={formData.secondary_plate_number}
                                     onChange={(e) => handleChange({
                                       target: {
                                         ...e,
                                         name: 'secondary_plate_number'
                                       }
                                     })}/>
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
                        <InputNumber type="text" name="electronic_estate_note_number" required
                                     value={formData.electronic_estate_note_number || 0}
                                     onChange={(e) => handleChange({
                                       target: {
                                         ...e,
                                         name: 'electronic_estate_note_number'
                                       }
                                     })}/>
                        <label htmlFor="first_name">شماره دفتر الکترونیکی</label>
                    </span>
        </div> : null}
        {formData.title_deeds_type === 'old' ? <>
          <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="note_book_number"
                                   required
                                   value={formData.note_book_number || ''}
                                   onChange={(e) => handleChange({
                                     target: {
                                       ...e?.target,
                                       name: 'note_book_number'
                                     }
                                   })}/>
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
        <div className="col-12">
          <ImageUploader onChange={onUploadImagesChange}/>
        </div>
      </form>
      <div className="field col-12">
        <div className="grid p-fluid">
          <h3>اطلاعات آگهی</h3>
          <div className="card detailsData">
            <h5>ثبت آگهی</h5>
            <hr/>
            <form onSubmit={submitForm} className="grid p-fluid mt-6">
              <div className="field col-12 md:col-4">
            <span className="p-float-label">
                <InputText type="text" name="title" id="title" autoComplete="off" value={adsFormData.title}
                           onChange={(e) => setAdsValue('title', e.target?.value ?? '')} required/>
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
                        <Dropdown type="text" name="type" id="type"
                                  value={TypeOption.find((option) => option.code === adsFormData.type)}
                                  onChange={handleTypeChange} options={TypeOption} optionLabel="name"
                                  placeholder="انتخاب کنید" required/>
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
                        <MultiSelect name="directions" id="directions" value={directionsState}
                                     onChange={(e: MultiSelectChangeEvent) => setDirectionsState(e.value)}
                                     options={directionsOption} optionLabel="name" placeholder="انتخاب کنید" required/>
                        <label htmlFor="directions">جهت ملک</label>
                    </span>
              </div>
              <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="area" id="area" autoComplete="off" value={adsFormData.area}
                                   onChange={(e) => setAdsValue('area', e.target.value)} required/>
                        <label htmlFor="area">
                            متراژ (متر) <span className="text-red-500">*</span>
                        </label>
                    </span>
              </div>
              <div className={`field col-12 md:col-4 ${adsFormData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="floors" value={adsFormData.floors}
                                     onChange={(e) => setAdsValue('floors', e.value)} disabled={adsFormData.type === 4}
                                     required={adsFormData.type !== 4}/>
                        <label htmlFor="floors">
                            تعداد طبقات <span className="text-red-500">*</span>
                        </label>
                    </span>
              </div>
              <div className={`field col-12 md:col-4 ${adsFormData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputText type="text" id="floor" value={adsFormData.floor ?? ''}
                                   onChange={(e) => setAdsValue('floor', e.target.value)}
                                   disabled={adsFormData.type === 4}
                                   required={adsFormData.type !== 4}/>
                        <label htmlFor="floor">
                            طبقه<span className="text-red-500">*</span>
                        </label>
                    </span>
              </div>
              <div className={`field col-12 md:col-4 ${adsFormData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="units_per_floor" value={adsFormData.units_per_floor}
                                     onChange={(e) => setAdsValue('units_per_floor', e.value)}
                                     disabled={adsFormData.type == 4} required={adsFormData.type !== 4}/>
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
                          onChange={handleAgeChange}
                          options={ageOption}
                          optionLabel="name"
                          placeholder="انتخاب کنید"
                          disabled={adsFormData.type == 4}
                          required={adsFormData.type !== 4}
                        />
                        <label htmlFor="age">
                            سن بنا <span className="text-red-500">*</span>
                        </label>
                    </span>
              </div>
              <div className={`field col-12 md:col-4 ${adsFormData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="rooms" value={adsFormData.rooms}
                                     onChange={(e) => setAdsValue('rooms', e.value)} disabled={adsFormData.type == 4}
                                     required={adsFormData.type !== 4}/>
                        <label htmlFor="rooms">
                            تعداد اتاق خواب <span className="text-red-500">*</span>
                        </label>
                    </span>
              </div>
              <div className={`field col-12 md:col-4 ${adsFormData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="warehouses" value={adsFormData.warehouses}
                                     onChange={(e) => setAdsValue('warehouses', e.value)}
                                     disabled={adsFormData.type == 4}
                                     required={adsFormData.type !== 4}/>
                        <label htmlFor="warehouses">
                            تعداد انباری <span className="text-red-500">*</span>
                        </label>
                    </span>
              </div>
              <div className={`field col-12 md:col-4 ${adsFormData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="parking" value={adsFormData.parking}
                                     onChange={(e) => setAdsValue('parking', e.value)} disabled={adsFormData.type == 4}
                                     required={adsFormData.type !== 4}/>
                        <label htmlFor="parking">
                            تعداد پارکینگ <span className="text-red-500">*</span>
                        </label>
                    </span>
              </div>
              <div className={`field col-12 md:col-4 ${adsFormData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="elevators" value={adsFormData.elevators}
                                     onChange={(e) => setAdsValue('elevators', e.value)}
                                     disabled={adsFormData.type == 4}
                                     required={adsFormData.type !== 4}/>
                        <label htmlFor="elevators">
                            تعداد آسانسور <span className="text-red-500">*</span>
                        </label>
                    </span>
              </div>
              <div className={`field col-12 md:col-4 ${adsFormData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="squat_toilets" value={adsFormData.squat_toilets}
                                     onChange={(e) => setAdsValue('squat_toilets', e.value)}
                                     disabled={adsFormData.type == 4}
                                     required={adsFormData.type !== 4}/>
                        <label htmlFor="squat_toilets">
                            تعداد سرویس ایرانی <span className="text-red-500">*</span>
                        </label>
                    </span>
              </div>
              <div className={`field col-12 md:col-4 ${adsFormData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="sitting_toilets" value={adsFormData.sitting_toilets}
                                     onChange={(e) => setAdsValue('sitting_toilets', e.value)}
                                     disabled={adsFormData.type == 4} required={adsFormData.type !== 4}/>

                        <label htmlFor="sitting_toilets">
                            تعداد سرویس فرنگی <span className="text-red-500">*</span>
                        </label>
                    </span>
              </div>
              <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" autoComplete="off" id="address" value={adsFormData.address}
                                   onChange={(e) => setAdsValue('address', e.target.value)} required/>
                        <label htmlFor="address">
                            آدرس <span className="text-red-500">*</span>
                        </label>
                    </span>
              </div>
              <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputNumber type="text" id="plate_number" value={adsFormData.plate_number}
                                     onChange={(e) => setAdsValue('plate_number', e.value)} required/>
                        <label htmlFor="plate_number">
                            شماره پلاک <span className="text-red-500">*</span>
                        </label>
                    </span>
              </div>
              <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="owner_name" id="owner_name" autoComplete="off"
                                   value={adsFormData.owner_name}
                                   onChange={(e) => setAdsValue('owner_name', e.target.value)}
                                   required/>
                        <label htmlFor="owner_name">
                            نام مالک <span className="text-red-500">*</span>
                        </label>
                    </span>
              </div>
              <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="postal_code" id="postal_code" autoComplete="off"
                                   value={adsFormData.postal_code}
                                   onChange={(e) => setAdsValue('postal_code', e.target.value)}
                                   required/>
                        <label htmlFor="postal_code">
                            کد پستی <span className="text-red-500">*</span>
                        </label>
                    </span>
              </div>
              <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="owner_phone" id="owner_phone" autoComplete="off"
                                   value={adsFormData.owner_phone}
                                   onChange={(e) => setAdsValue('owner_phone', e.target.value)} required/>
                        <label htmlFor="owner_phone">
                            شماره تماس مالک <span className="text-red-500">*</span>
                        </label>
                    </span>
              </div>
              <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="owner_phone2" id="owner_phone2" autoComplete="off"
                                   value={adsFormData.owner_phone2 ?? ''}
                                   onChange={(e) => setAdsValue('owner_phone2', e.target.value)}/>
                        <label htmlFor="owner_phone2">شماره تماس مالک</label>
                    </span>
              </div>

              <div
                className={`field col-12 md:col-4 ${adsFormData.purpose === 1 || adsFormData.purpose === 5 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputText type="text" autoComplete="off" id="rent_pre_paid_amount"
                                   value={formatNumber(adsFormData.rent_pre_paid_amount)}
                                   onChange={(e) => setAdsValue('rent_pre_paid_amount', parseNumber(e.target.value))}/>
                        <label htmlFor="rent_pre_paid_amount">
                            ودیعه اجاره <span className="text-red-500">*</span>
                        </label>
                    </span>
              </div>
              <div
                className={`field col-12 md:col-4 ${adsFormData.purpose === 1 || adsFormData.purpose === 4 || adsFormData.purpose === 5 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputText type="text" autoComplete="off" id="rent_price"
                                   value={formatNumber(adsFormData.rent_price)}
                                   onChange={(e) => setAdsValue('rent_price', parseNumber(e.target.value))}/>
                        <label htmlFor="rent_price">
                            مبلغ اجاره <span className="text-red-500">*</span>
                        </label>
                    </span>
              </div>
              <div
                className={`field col-12 md:col-4 ${adsFormData.purpose === 2 || adsFormData.purpose === 3 || adsFormData.purpose === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputText type="text" autoComplete="off" id="unit_price"
                                   value={formatNumber(adsFormData.unit_price)}
                                   onChange={(e) => setAdsValue('unit_price', parseNumber(e.target.value))}/>
                        <label htmlFor="unit_price">
                            قیمت متری <span className="text-red-500">*</span>
                        </label>
                    </span>
              </div>
              <div
                className={`field col-12 md:col-4 ${adsFormData.purpose === 2 || adsFormData.purpose === 3 || adsFormData.purpose === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputText type="text" autoComplete="off" id="total_price"
                                   value={formatNumber(adsFormData.total_price)}
                                   onChange={(e) => setAdsValue('total_price', parseNumber(e.target.value))}/>
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
                          value={cities.find((option) => option.id === adsFormData.city) || null}
                          onChange={(e) => setAdsValue('city', e.value.id)}
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
                          value={districtsState.find((option) => option.id === adsFormData.district) || null}
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
                          value={neighborhoodsState.find((option) => option.id === adsFormData.neighborhood) || null}
                          onChange={(e) => setAdsValue('neighborhood', e.value.id)}
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
                                       value={adsFormData.description ?? ''}
                                       onChange={(e) => setAdsValue('description', e.target.value)}/>
                        <label htmlFor="description">توضیحات</label>
                    </span>
              </div>
              <div className="col-12">
                <div className="field flex col-12 md:col-2 ">
                  <Button raised type="submit" label="ثبت" className="bg-green-500 text-white border-0 mt-2 ml-2"
                          disabled={loading} loading={loading}/>
                  <Button raised label="بازگشت" type="button" className="bg-gray-300 text-color border-0 mt-2"
                          onClick={back}/>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitAdForm;
