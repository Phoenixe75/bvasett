'use client';
import {FC, useCallback, useEffect, useRef, useState} from 'react';
import {PageParams} from '@/types/layout';
import {useRouter} from 'next/navigation';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Dropdown} from 'primereact/dropdown';
import {toast} from 'react-toastify';
import {
  getAdsDetails,
  getCitiesByState,
  getDistricts,
  getNeighborhoodsByDistrict,
  getStates,
  updateAds
} from '../../(services)/ads.service';
import {DirectionEnum, IAdsBase, ICity, IDirection, IDistricts, INeighborhoods, IState} from '../../(models)/ads';
import {InputNumber} from 'primereact/inputnumber';
import {
  activeOption,
  ageOption,
  directionsOption,
  locationOption,
  purposeOption,
  TypeOption
} from '../../constant/converter';
import {ProgressSpinner} from 'primereact/progressspinner';
import {MultiSelect, MultiSelectChangeEvent} from 'primereact/multiselect';

const AdsEditPage: FC<PageParams> = ({params}: any) => {
  const [directionsState, setDirectionsState] = useState<IDirection[]>([]);
  const [formData, setFormData] = useState<IAdsBase>({
    id: 0,
    active: null,
    ordering: null,
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
    address: '',
    complete: '',
    owner_name: '',
    plate_number: null,
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
    city: 0,
    district: 0,
    neighborhood: 0
  });

  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [districtStates, setDistrictStates] = useState<IDistricts[]>([]);
  const [neighborhoodStates, setNeighborhoodStates] = useState<INeighborhoods[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const loading = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const setValue = useCallback((fieldName: string, fieldValue: any) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue
    }));
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        loading.current = true;
        const fetchedStates = await getStates();
        setStates(fetchedStates);
        const fetchedDistricts = await getDistricts();
        setDistrictStates(fetchedDistricts);

        if (params.id != null) {
          const data = await getAdsDetails(+params.id);
          setFormData(data);

          if (data?.directions) {
            const directionValue = data?.directions?.map((dir: string) => ({
              name: directionsOption.find((option) => option.code === dir)?.name || '',
              code: dir
            }));
            setDirectionsState(directionValue);
          }

          if (data.state !== null) {
            const fetchedCities = await getCitiesByState(data.state);
            setCities(fetchedCities);
          } else {
            console.warn('State is null');
            setCities([]);
          }

          if (data.district !== null) {
            const fetchedNeighborhoods = await getNeighborhoodsByDistrict(data.district);
            setNeighborhoodStates(fetchedNeighborhoods);
          } else {
            console.warn('Neighborhoods  is null');
            setNeighborhoodStates([]);
          }
        } else {
          console.warn('Ad ID is undefined or null');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error fetching data');
      } finally {
        loading.current = false;
      }
    };

    fetchInitialData();
  }, [params.id]);

  useEffect(() => {
    setFormData((prevState: IAdsBase) => ({
      ...prevState,
      directions: directionsState.map((direction: IDirection) => direction.code as DirectionEnum)
    }));
  }, [directionsState]);

  const handleSelect = (field: string, value: any) => {
    setFormData((prev) => ({...prev, [field]: value}));
  };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      loading.current = true;
      const filterNullValues = (data: IAdsBase) => {
        return Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== null && value !== ''));
      };

      const filteredData = filterNullValues(formData);

      if (filteredData.purpose === 1 || filteredData.purpose === 5) {
        if (filteredData.type === 1 || filteredData.type === 2 || filteredData.type === 3 || filteredData.type === 5) {
          await updateAds(+params.id, filteredData);
          toast.success('بروز‌رسانی شد');
          router.push('../');
        } else if (filteredData.type === 4) {
          await updateAds(+params.id, filteredData);
          toast.success('بروز‌رسانی شد');
          router.push('../');
        }
      } else if (filteredData.purpose === 2 || filteredData.purpose === 3) {
        if (filteredData.type === 1 || filteredData.type === 2 || filteredData.type === 3 || filteredData.type === 5) {
          await updateAds(+params.id, filteredData);
          toast.success('بروز‌رسانی شد');
          router.push('../');
        } else if (filteredData.type === 4) {
          await updateAds(+params.id, filteredData);
          toast.success('بروز‌رسانی شد');
          router.push('../');
        }
      } else if (filteredData.purpose === 4) {
        if (filteredData.type === 1 || filteredData.type === 2 || filteredData.type === 3 || filteredData.type === 5) {
          await updateAds(+params.id, filteredData);
          toast.success('بروز‌رسانی شد');
          router.push('../');
        } else if (filteredData.type === 4) {
          await updateAds(+params.id, filteredData);
          toast.success('بروز‌رسانی شد');
          router.push('../');
        }
      }
    } catch (error) {
      toast.error('بروز‌رسانی با خطا روبرو شد: ');
    } finally {
      loading.current = false;
    }
  };

  const back = () => {
    router.push('../');
  };

  const handleLocationChange = (e: any) => {
    const selectedLocationCode = e.value ? e.value.code : null;
    setFormData({...formData, location: selectedLocationCode});
  };

  const handleDirectionsChange = (e: MultiSelectChangeEvent) => {
    setDirectionsState(e.value);
  };

  const handlePurposeChange = (e: any) => {
    const selectedPurposeCode = e.value ? e.value.code : null;
    setFormData({...formData, purpose: selectedPurposeCode});
  };

  const handleAgeChange = (e: any) => {
    const selectedAgeCode = e.value ? e.value.code : null;
    setFormData({...formData, age: selectedAgeCode});
  };

  const handleTypeChange = (e: any) => {
    const selectedTypeCode = e.value ? e.value.code : null;
    setFormData({...formData, type: selectedTypeCode});
  };

  const handleStateChange = async (e: any) => {
    const selectedStateId = e.value.id;
    setFormData((prev) => ({...prev, state: selectedStateId, city: null}));

    try {
      const fetchedCities = await getCitiesByState(selectedStateId);
      setCities(fetchedCities);
    } catch (error) {
      console.error('Failed to fetch cities:', error);
    }
  };

  const handleDistrictChange = async (e: any) => {
    const selectedDistrictId = e.value.id;
    setFormData((prev) => ({...prev, district: selectedDistrictId, neighborhood: null}));

    try {
      const fetchedNeighborhoods = await getNeighborhoodsByDistrict(selectedDistrictId);
      setNeighborhoodStates(fetchedNeighborhoods);
    } catch (error) {
      console.error('Failed to fetch Neighborhoods:', error);
    }
  };

  const handleCityChange = (e: any) => {
    const selectedCityId = e.value ? e.value.id : null;
    if (selectedCityId !== null) {
      setFormData((prev) => ({...prev, city: selectedCityId}));
    }
  };

  const handleNeighborhoodChange = (e: any) => {
    const selectedNeighborhoodId = e.value ? e.value.id : null;
    if (selectedNeighborhoodId !== null) {
      setFormData((prev) => ({...prev, neighborhood: selectedNeighborhoodId}));
    }
  };

  const formatNumber = (value: any) => {
    const num = Number(String(value).replace(/,/g, ''));
    return num.toLocaleString();
  };

  const parseNumber = (value: string) => {
    return String(value.replace(/,/g, ''));
  };

  useEffect(() => {
    const checkAndResetFields = () => {
      handleCheckPurposeAndPartChange();
      handleCheckRentAndBarterChange();
      handleCheckMortgageChange();
    };

    checkAndResetFields();
  }, [formData.purpose]);

  const handleCheckPurposeAndPartChange = () => {
    if (formData.purpose === 1 || formData.purpose === 4 || formData.purpose === 5) {
      setValue('rent_price', '');
    }
  };

  const handleCheckRentAndBarterChange = () => {
    if (formData.purpose === 2 || formData.purpose === 3 || formData.purpose === 4) {
      setValue('unit_price', '');
    }
  };

  const handleCheckMortgageChange = () => {
    if (formData.purpose === 1 || formData.purpose === 5) {
      setValue('rent_pre_paid_amount', '');
    }
  };

  if (loading.current) {
    return <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)"
                            animationDuration=".5s"/>;
  }

  return (
    <div className="card detailsData">
      <h5>ویرایش آگهی</h5>
      <hr/>
      <form onSubmit={submitForm} className="grid p-fluid mt-6">
        {/*<div className="field col-12 md:col-4">*/}
        {/*    <span className="p-float-label">*/}
        {/*        <InputText type="text" ref={inputRef} name="title" id="title" autoComplete="off" value={formData.title} onChange={(e) => setValue('title', e.target.value)} />*/}
        {/*        <label htmlFor="title">عنوان</label>*/}
        {/*    </span>*/}
        {/*</div>*/}
        <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                      <InputText type="text" autoComplete="off" value={formData.slug}
                                 onChange={(e) => handleSelect('slug', e.target.value)}/>
                        {/*<Calendar value={formData.registered_date} onChange={(e) => setDate(e.value)} locale="es" />*/}
                      <label htmlFor="slug">کد یکتا</label>
                    </span>
        </div>
        <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" autoComplete="off" value={formData.slug}
                                   onChange={(e) => handleSelect('slug', e.target.value)}/>
                        <label htmlFor="slug">کد یکتا</label>
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
                        <Dropdown type="text" name="type" id="type"
                                  value={TypeOption.find((option) => option.code === formData.type)}
                                  onChange={handleTypeChange} options={TypeOption} optionLabel="name"
                                  placeholder="انتخاب کنید" required/>
                        <label htmlFor="type">نوع ملک</label>
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
                        />
                        <label htmlFor="location">موقعیت ملک</label>
                    </span>
        </div>
        <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <MultiSelect name="directions" id="directions" value={directionsState}
                                     onChange={handleDirectionsChange} options={directionsOption} optionLabel="name"
                                     placeholder="انتخاب کنید" required/>{' '}
                      <label htmlFor="directions">جهت ملک</label>
                    </span>
        </div>
        <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" autoComplete="off" value={formData.slug}
                                   onChange={(e) => handleSelect('slug', e.target.value)}/>
                        <label htmlFor="slug">کد یکتا</label>
                    </span>
        </div>
        <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" id="area" autoComplete="off" value={formData.area}
                                   onChange={(e) => setValue('area', e.target.value)} required/>
                        <label htmlFor="area">
                            متراژ (متر) <span className="text-red-500">*</span>
                        </label>
                    </span>
        </div>
        <div className={`field col-12 md:col-4 ${formData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="floors" value={formData.floors}
                                     onChange={(e) => setValue('floors', e.value)}/>
                        <label htmlFor="floors">
                            تعداد طبقات <span className="text-red-500">*</span>
                        </label>
                    </span>
        </div>
        <div className={`field col-12 md:col-4 ${formData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="units_per_floor" value={formData.units_per_floor}
                                     onChange={(e) => setValue('units_per_floor', e.value)}/>
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
                          className="w-full"
                          required
                        />
                        <label htmlFor="age">
                            سن ملک <span className="text-red-500">*</span>
                        </label>
                    </span>
        </div>
        <div className={`field col-12 md:col-4 ${formData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="rooms" value={formData.rooms}
                                     onChange={(e) => setValue('rooms', e.value)}/>
                        <label htmlFor="rooms">
                            تعداد اتاق خواب <span className="text-red-500">*</span>
                        </label>
                    </span>
        </div>
        <div className={`field col-12 md:col-4 ${formData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="warehouses" value={formData.warehouses}
                                     onChange={(e) => setValue('warehouses', e.value)}/>
                        <label htmlFor="warehouses">
                            تعداد انباری <span className="text-red-500">*</span>
                        </label>
                    </span>
        </div>
        <div className={`field col-12 md:col-4 ${formData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="parking" value={formData.parking}
                                     onChange={(e) => setValue('parking', e.value)}/>
                        <label htmlFor="parking">
                            تعداد پارکینگ <span className="text-red-500">*</span>
                        </label>
                    </span>
        </div>
        <div className={`field col-12 md:col-4 ${formData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="elevators" value={formData.elevators}
                                     onChange={(e) => setValue('elevators', e.value)}/>
                        <label htmlFor="elevators">
                            تعداد آسانسور <span className="text-red-500">*</span>
                        </label>
                    </span>
        </div>
        <div className={`field col-12 md:col-4 ${formData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="squat_toilets" value={formData.squat_toilets}
                                     onChange={(e) => setValue('squat_toilets', e.value)}/>
                        <label htmlFor="squat_toilets">
                            تعداد سرویس ایرانی <span className="text-red-500">*</span>
                        </label>
                    </span>
        </div>
        <div className={`field col-12 md:col-4 ${formData.type === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputNumber type="text" id="sitting_toilets" value={formData.sitting_toilets}
                                     onChange={(e) => setValue('sitting_toilets', e.value)}/>

                        <label htmlFor="sitting_toilets">
                            تعداد سرویس فرنگی <span className="text-red-500">*</span>
                        </label>
                    </span>
        </div>
        <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" id="address" value={formData.address}
                                   onChange={(e) => setValue('address', e.target.value)} required/>

                        <label htmlFor="address">
                            آدرس <span className="text-red-500">*</span>
                        </label>
                    </span>
        </div>
        <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputNumber type="text" id="plate_number" value={formData.plate_number}
                                     onChange={(e) => setValue('plate_number', e.value)} required/>
                        <label htmlFor="plate_number">
                            شماره پلاک <span className="text-red-500">*</span>
                        </label>
                    </span>
        </div>
        <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" id="owner_name" autoComplete="off" value={formData.owner_name}
                                   onChange={(e) => handleSelect('owner_name', e.target.value)} required/>
                        <label htmlFor="owner_name">نام مالک</label>
                    </span>
        </div>
        <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" id="owner_phone" autoComplete="off" value={formData.owner_phone}
                                   onChange={(e) => handleSelect('owner_phone', e.target.value)} required/>
                        <label htmlFor="owner_phone">شماره تماس</label>
                    </span>
        </div>
        <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" id="owner_phone2" autoComplete="off" value={formData.owner_phone2 || ''}
                                   onChange={(e) => handleSelect('owner_phone2', e.target.value)}/>
                        <label htmlFor="owner_phone2">شماره تماس</label>
                    </span>
        </div>
        <div
          className={`field col-12 md:col-4 ${formData.purpose === 1 || formData.purpose === 5 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputText
                          type="text"
                          autoComplete="off"
                          id="rent_pre_paid_amount"
                          value={formatNumber(formData.rent_pre_paid_amount)}
                          onChange={(e) => {
                            handleCheckMortgageChange();
                            setValue('rent_pre_paid_amount', parseNumber(e.target.value));
                          }}
                        />
                        <label htmlFor="rent_pre_paid_amount">
                            ودیعه اجاره <span className="text-red-500">*</span>
                        </label>
                    </span>
        </div>
        <div
          className={`field col-12 md:col-4 ${formData.purpose === 1 || formData.purpose === 4 || formData.purpose === 5 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputText
                          type="text"
                          autoComplete="off"
                          id="rent_price"
                          value={formatNumber(formData.rent_price)}
                          onChange={(e) => {
                            handleCheckPurposeAndPartChange();
                            setValue('rent_price', parseNumber(e.target.value));
                          }}
                        />
                        <label htmlFor="rent_price">
                            مبلغ اجاره <span className="text-red-500">*</span>
                        </label>
                    </span>
        </div>
        <div
          className={`field col-12 md:col-4 ${formData.purpose === 2 || formData.purpose === 3 || formData.purpose === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputText
                          type="text"
                          autoComplete="off"
                          id="unit_price"
                          value={formatNumber(formData.unit_price)}
                          onChange={(e) => {
                            handleCheckRentAndBarterChange();
                            setValue('unit_price', parseNumber(e.target.value));
                          }}
                        />
                        <label htmlFor="unit_price">
                            قیمت متری <span className="text-red-500">*</span>
                        </label>
                    </span>
        </div>
        <div
          className={`field col-12 md:col-4 ${formData.purpose === 2 || formData.purpose === 3 || formData.purpose === 4 ? `hidden` : `block`}`}>
                    <span className="p-float-label">
                        <InputText
                          type="text"
                          autoComplete="off"
                          id="total_price"
                          value={formatNumber(formData.total_price)}
                          onChange={(e) => {
                            handleCheckRentAndBarterChange();
                            setValue('total_price', parseNumber(e.target.value));
                          }}
                        />
                        <label htmlFor="total_price">
                            قیمت کل <span className="text-red-500">*</span>
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
                          onChange={handleCityChange}
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
                          value={districtStates.find((option) => option.id === formData.district) || null}
                          onChange={handleDistrictChange}
                          options={districtStates}
                          optionLabel="name"
                          placeholder="انتخاب کنید"
                          className="w-full"
                        />
                        <label htmlFor="district">منطقه شهرداری</label>
                    </span>
        </div>
        <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown
                          type="text"
                          name="neighborhood"
                          id="neighborhood"
                          value={neighborhoodStates.find((option) => option.id === formData.neighborhood) || null}
                          onChange={handleNeighborhoodChange}
                          options={neighborhoodStates}
                          optionLabel="name"
                          placeholder="انتخاب کنید"
                          className="w-full"
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
                        <InputText type="text" autoComplete="off" value={formData.description || ''}
                                   onChange={(e) => handleSelect('description', e.target.value)}/>
                        <label htmlFor="description">توضیحات</label>
                    </span>
        </div>
        <div className="col-12">
          <div className="field flex col-auto md:col-3">
            <Button raised type="submit" label="بروز‌رسانی" className="bg-green-500 text-white border-0 mt-2 ml-2"
                    disabled={loading.current} loading={loading.current}/>
            <Button raised label="بازگشت" type="button" className="bg-gray-300 text-color border-0 mt-2"
                    onClick={back}/>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdsEditPage;
