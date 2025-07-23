'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { IState } from '@/app/dashboard/admin/ads/(models)/ads';
import { getStates } from '@/app/dashboard/admin/ads/(services)/ads.service';
import { SubmitAdFormData } from '../../(models)/submitAdTypes';
import ImageUploader from './imageUploader';
import { createAd } from '../../(services)/submitAd.service';
import { InputNumber } from 'primereact/inputnumber';
const deedsOptions = [
 {value: "old", label:'قدیمی'},
 {value: "new", label:'جدید'},
];
const SubmitAdForm = ({ params }: { params: { id: number } }) => {
    const [initDataImage, setInitDataImage] = useState<any>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | File | null>(null);
    const [states, setStates] = useState<IState[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<SubmitAdFormData>({
        state: 0,
        electronic_estate_note_number: 0,
        image_ids: [],
        note_book_number: "",
        page_number: "",
        primary_plate_number: 0,
        registration_unit: "",
        secondary_plate_number:0,
        title_deeds_type: null
    });
    const router = useRouter();
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


    const handleStateChange = async (e: any) => {
      const selectedStateId = e.value.id;
      setFormData((prev) => ({ ...prev, state: selectedStateId}));
  };

  const handelDeedsChange = async (e: any) => {
    const selectedDeedsId = e.value;
    setFormData((prev) => ({ ...prev, title_deeds_type: selectedDeedsId}));
  };
  const onUploadImagesChange =(data:number[]) => {
    setFormData((prev) => ({ ...prev, image_ids: data}));
  }



    const setValue = useCallback((fieldName: string, fieldValue: any) => {
        setFormData((prevState:any) => ({
            ...prevState,
            [fieldName]: fieldValue
        }));
    }, []);


    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true)
            await createAd(formData);
            toast.success('آگهی با موفقیت ثبت شد');
            setTimeout(()=> {
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
        const { name, value } = e.target;
        setFormData((prevData:any) => ({ ...prevData, [name]: value }));
    };
    const back = () => {
        router.back();
    };

    return (
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
                        <InputNumber name="primary_plate_number" required value={formData.primary_plate_number || 0} onChange={handleChange} />
                        <label htmlFor="primary_plate_number">اصلی</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputNumber name="secondary_plate_number" value={formData.secondary_plate_number || 0} onChange={handleChange} />
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
                        <InputNumber type="text" name="electronic_estate_note_number" required value={formData.electronic_estate_note_number || 0} onChange={handleChange} />
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
                <div className="col-12">
                <ImageUploader onChange={onUploadImagesChange} />
                </div>
                <div className="col-12">
                    <div className="field flex col-12 md:col-2">
                        <Button raised type="submit" label="ثبت" className="bg-green-500 text-white border-0 mt-2 ml-2" disabled={loading} loading={loading} />
                        <Button raised label="بازگشت" type="button" className="bg-gray-300 text-color border-0 mt-2" onClick={back} />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SubmitAdForm;
