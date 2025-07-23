'use client'
import { useEffect, useState } from "react";
import LoadingPage from "@/app/components/LoadingPage";
import { useRouter, useSearchParams } from "next/navigation";
import { getProperty } from "../../../view-ad/(services)/viewAd.service";
import { IState } from "@/app/dashboard/admin/ads/(models)/ads";
import { getStates } from "@/app/dashboard/admin/ads/(services)/ads.service";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { deedsOptions } from "../../../(components)/viewFormData";
import {Image} from "primereact/image";
const InitialData = () => {
  const [loading,setLoading] = useState(false);
  const [states, setStates] = useState<IState[]>([]);

  const [formData, setFormData] = useState<any>({
    state: 0, 
    electronic_estate_note_number: "",
    images: [],
    note_book_number: "",
    page_number: "",
    primary_plate_number: "",
    registration_unit: "",
    secondary_plate_number:"",
});
  const params = useSearchParams();
  const getAdsDetails = async () => {
    try {
        const infoData:any = await getProperty(params.get("id") || '');
        setFormData(infoData);
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};
const fetchUserData = async () => {
  try {
      const fetchedStates = await getStates();
      setStates(fetchedStates);
  } catch (error) {
      console.error('Error fetching user data:', error);
  }
}
const fetch = async () => {
  setLoading(true);
  await Promise.allSettled([ fetchUserData(), getAdsDetails()]);
  setLoading(false)
}
  useEffect(() => {
    fetch()
  }, []);
  
return <LoadingPage isLoading={loading}> 
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
                        {formData?.images?.map((img:any, idx:string) => (
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
            </form>
</LoadingPage>
}
export default InitialData;