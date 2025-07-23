'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { IState } from '@/app/dashboard/admin/ads/(models)/ads';
import { getStates } from '@/app/dashboard/admin/ads/(services)/ads.service';
import ImageUploader from './imageUploader';
import { editPropertyAd } from '../../(services)/submitAd.service';
import { Property } from '../../../(models)/properties.types';
import { getProperty } from '../../../view-ad/(services)/viewAd.service';
import { InputTextarea } from 'primereact/inputtextarea';
import LoadingPage from '@/app/components/LoadingPage';
const deedsOptions = [
 {value: "old", label:'قدیمی'},
 {value: "new", label:'جدید'},
];
const statusOptions = [
    {value: 0, label:'در حال بررسی'},
    {value: 1, label:'تایید شده'},
    {value: 2, label:'رد شده'},
]
interface EditPropertyForm {
    id: string
}
const EditPropertyForm = ({id}:EditPropertyForm) => {
    const [states, setStates] = useState<IState[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Property>>({
        state: 0,
        electronic_estate_note_number: "",
        images: [],
        note_book_number: "",
        page_number: "",
        primary_plate_number: "",
        registration_unit: "",
        secondary_plate_number:"",
        notes: "",
        status: 0
    });
    const router = useRouter();
    useEffect(() => {
      const fetchUserData = async () => {
          try {
              setLoading(true);
              const fetchedStates = await getStates();
              setStates(fetchedStates);
              const fetchedPropertyInfo = await getProperty(id);
              setFormData(fetchedPropertyInfo as any);
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
      setFormData((prev) => ({ ...prev, state: selectedStateId}));
  };

  const handelDeedsChange = async (e: any) => {
    const selectedDeedsId = e.value;
    setFormData((prev) => ({ ...prev, title_deeds_type: selectedDeedsId}));
  };
  const handelStatusChange = async (e: any) => {
    const selectedDeedsId = e.value;
    setFormData((prev) => ({ ...prev, status: selectedDeedsId}));
  };
  const onUploadImagesChange =(data:Property["images"]) => {
    setFormData((prev) => ({ ...prev, images: data}));
  }
const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newformData :any = {...formData};
        newformData.image_ids = formData?.images?.map(item=>item.id) as any || [];
        delete newformData['images']
        try {
            setLoading(true);
            console.log({formData})
            await editPropertyAd(newformData, id);
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
        const { name, value } = e.target;
        setFormData((prevData:any) => ({ ...prevData, [name]: value }));
    };
    const back = () => {
        router.back();
    };

    return (
        <LoadingPage isLoading={loading}>
            <div className="card detailsData w-full">
                <h5>ثبت آگهی</h5>
                <hr />
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
                            <InputText type="text" name="registration_unit" required value={formData.registration_unit || ''} onChange={handleChange} />
                            <label htmlFor="registration_unit">واحد ثبتی</label>
                        </span>
                    </div>
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText type="text" name="primary_plate_number" required value={formData.primary_plate_number || ''} onChange={handleChange} />
                            <label htmlFor="primary_plate_number">اصلی</label>
                        </span>
                    </div>
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText type="text" name="secondary_plate_number" value={formData.secondary_plate_number || ''} onChange={handleChange} />
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
                    {formData.title_deeds_type === 'new' ?  <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText type="text" name="electronic_estate_note_number" required value={formData.electronic_estate_note_number || ''} onChange={handleChange} />
                            <label htmlFor="first_name">شماره دفتر الکترونیکی</label>
                        </span>
                    </div> : null}
                    {formData.title_deeds_type === 'old' ?  <>
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText type="text" name="note_book_number" required value={formData.note_book_number || ''} onChange={handleChange} />
                            <label htmlFor="note_book_number">شماره دفتر</label>
                        </span>
                    </div>
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText type="text" name="page_number" required value={formData.page_number || ''} onChange={handleChange} />
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
                            <InputTextarea name="notes" rows={3} required value={formData.notes || ''} onChange={handleChange} />
                            <label htmlFor="notes">پاسخ ادمین</label>
                        </span>
                    </div>
                    <div className="col-12">
                    <ImageUploader onChange={onUploadImagesChange} images={formData.images!} />
                    </div>
                    <div className="col-12">
                        <div className="field flex col-12 md:col-2">
                            <Button raised type="submit" label="ثبت" className="bg-green-500 text-white border-0 mt-2 ml-2" disabled={loading} loading={loading} />
                            <Button raised label="بازگشت" type="button" className="bg-gray-300 text-color border-0 mt-2" onClick={back} />
                        </div>
                    </div>
                </form>
            </div>
        </LoadingPage>
    );
};

export default EditPropertyForm;
