'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { IState } from '@/app/dashboard/admin/ads/(models)/ads';
import { getStates } from '@/app/dashboard/admin/ads/(services)/ads.service';
import { Image } from 'primereact/image';
import { Property } from '../../(models)/properties.types';
const deedsOptions = [
 {value: "old", label:'قدیمی'},
 {value: "new", label:'جدید'},
];
interface ViweAdFormProps {
    formData:Property
}
const ViewAdForm = ({formData}:ViweAdFormProps) => {
    const [states, setStates] = useState<IState[]>([]);
    const [loading, setLoading] = useState(false);
    
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
    
    const back = () => {
        router.back();
    };

    return (
        <div className="card detailsData w-full">
            <h5>مشخصات آگهی</h5>
            <hr />
            <form className="grid p-fluid mt-6" encType="multipart/form-data">
            <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown
                            disabled
                            type="text"
                            name="state"
                            id="state"
                            value={states.find((option) => option.id === formData.state) || null}
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
                        <InputText disabled type="text" name="registration_unit" required value={formData.registration_unit || ''}  />
                        <label htmlFor="registration_unit">واحد ثبتی</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText disabled type="text" name="primary_plate_number" required value={formData.primary_plate_number || ''}  />
                        <label htmlFor="primary_plate_number">اصلی</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText disabled type="text" name="secondary_plate_number" value={formData.secondary_plate_number || ''}  />
                        <label htmlFor="secondary_plate_number">فرعی</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown
                            disabled
                            type="text"
                            name="title_deeds_type"
                            value={deedsOptions.find((option) => option.value === formData.title_deeds_type)?.value || null}
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
                        <InputText disabled type="text" name="electronic_estate_note_number" required value={formData.electronic_estate_note_number || ''}  />
                        <label htmlFor="first_name">شماره دفتر الکترونیکی</label>
                    </span>
                </div> : null}
                {formData.title_deeds_type === 'old' ?  <>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText disabled type="text" name="note_book_number" required value={formData.note_book_number || ''}  />
                        <label htmlFor="note_book_number">شماره دفتر</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText disabled type="text" name="page_number" required value={formData.page_number || ''}  />
                        <label htmlFor="page_number">شماره صفحه</label>
                    </span>
                </div>
                </> : null}
                <div className="col-12">
                    <div className="flex flex-wrap gap-3 mt-4">
                        {formData?.images?.map((img, idx) => (
                            <div
                            key={idx}
                            className="relative border-1 border-round surface-border overflow-hidden"
                            style={{ width: '8rem', height: '8rem' }}
                            > 
                            <Image
                                src={img.file}
                                alt={`Preview ${idx}`}
                                imageStyle={{ width: '100%', height: '100%', objectFit: 'cover', cursor:'pointer' }}
                                onClick={()=>{window.open(img.file, 'no_blank')}}
                            />
                        </div>
                        ))}
                    </div>
                </div>
                <div className="col-12 w-full flex flex-row-reverse">
                    <div className="field flex col-12 md:col-2">
                        <Button raised label="بازگشت" type="button" className="bg-gray-300 text-color border-0 mt-2" onClick={back} />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ViewAdForm;
