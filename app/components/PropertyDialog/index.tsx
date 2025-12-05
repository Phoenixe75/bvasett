import {images as staticImages} from "@/app/(main)/(pages)/filterResult/(contants)/images";
import {
  getLocationLabel,
  getPurposeLabelwithColor,
  getRooms,
  getTypeLabel
} from "@/app/dashboard/admin/ads/constant/converter";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog"
import {InputNumber} from "primereact/inputnumber";
import {InputText} from "primereact/inputtext";
import Image from "next/image";
import {useMemo, useState} from "react";
import styles from "./propertyDialoge.module.scss"
import Favorite from "../ItemCards/components/ItemCard/favorite/favorite";

interface PropertyDialogProps {
  visible: boolean;
  onHide: () => void;
  selectedRowData: any;
  canShowExtraDescription?: boolean
}

function PropertyDialog({visible, onHide, selectedRowData, canShowExtraDescription}: PropertyDialogProps) {
  const images = useMemo(() => {
    return staticImages
  }, []);

  const [previewImageIndex, setPreviewImageIndex] = useState<number>(-1);

  const [ad, setAd] = useState(selectedRowData);
  const [loading, setLoading] = useState(true);

  const selectImageHandler = (index?: number) => {
    setPreviewImageIndex(index ?? -1);
  }

  // useEffect(() => {
  //   if (selectedRowData?.id) {
  //     const loadAdById = async (adId: number) => {
  //       try {
  //         setLoading(true);
  //         // const result: IAdsBase = await getAdsDetails(adId);
  //         const result: IAdsBase = await getAdsDetailsNotSecured(adId);
  //         setAd(result);
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //     loadAdById(selectedRowData.id!);
  //   }
  // }, [selectedRowData?.id, setAd])

  return (
    <Dialog header="جزئیات آگهی" visible={visible}
            onHide={onHide}
            draggable={false}
            className="w-12 md:w-6"
            dismissableMask={true}>
      <hr/>
      <div className="grid p-fluid gap-3 mt-6">

        {selectedRowData && (
          <div className="grid p-fluid relative col-9 relative">
            <div className={styles.heart_container}>
              <Favorite data={selectedRowData}/>
            </div>
            <div className="formgrid grid">
              <div className="field col-12 md:col-4">
                <label htmlFor="title">عنوان</label>
                {/*<InputText id="title" value={selectedRowData.title ?? null} readOnly/>*/}
                <InputText id="title"
                           value={getTypeLabel(selectedRowData?.type) + ' ' + getRooms(selectedRowData?.rooms)}
                           readOnly/>
              </div>
              {selectedRowData.owner_name ? <div className="field col-12 md:col-4">
                <label htmlFor="title">نام مالک</label>
                <InputText id="title" value={selectedRowData.owner_name ?? null} readOnly/>
              </div> : null}
              {selectedRowData.owner_phone ? <div className="field col-12 md:col-4">
                <label htmlFor="title">تلفن مالک</label>
                <InputText id="title" value={selectedRowData.owner_phone ?? null} readOnly/>
              </div> : null}
              {/*<div className="field col-12 md:col-4">*/}
              {/*    <label htmlFor="title">عنوان</label>*/}
              {/*    <InputText id="title" value={selectedRowData.title ?? null} readOnly />*/}
              {/*</div>*/}
              <div className="field col-12 md:col-4">
                <label htmlFor="rooms">تعداد اتاق </label>
                <InputNumber id="rooms" value={selectedRowData.rooms ?? null} readOnly/>
              </div>
              <div className="field col-12 md:col-4">
                <label htmlFor="location"> موقعیت ملک</label>
                <InputText id="location" value={getLocationLabel(selectedRowData.location) ?? null} readOnly/>
              </div>
              <div className="field col-12 md:col-4">
                <label htmlFor="location"> نوع معامله</label>
                <InputText id="location" value={getPurposeLabelwithColor(selectedRowData.purpose)?.label ?? null}
                           readOnly/>
              </div>
              {selectedRowData?.floors ? <div className="field col-12 md:col-4">
                <label htmlFor="floors">تعداد طبقات</label>
                <InputText id="floors" value={selectedRowData?.floors ?? null} readOnly/>
              </div> : null}
              {selectedRowData?.floor ? <div className="field col-12 md:col-4">
                <label htmlFor="floor"> طبقه</label>
                <InputText id="floor" value={selectedRowData?.floor ?? null} readOnly/>
              </div> : null}
              {selectedRowData?.unit_price && selectedRowData?.purpose == 1 ? <div className="field col-12 md:col-4">
                <label htmlFor="unit_price"> قیمت متری</label>
                <InputNumber id="unit_price" value={selectedRowData?.unit_price ?? null} readOnly/>
              </div> : null}
              {selectedRowData.rent_pre_paid_amount ? <>
                <div className="field col-12 md:col-4">
                  <label htmlFor="total_price">رهن </label>
                  <InputNumber id="total_price" value={selectedRowData.rent_pre_paid_amount ?? null} readOnly/>
                </div>
                {!!selectedRowData.rent_pre_paid_amount && selectedRowData?.purpose != 4 &&
                  <div className="field col-12 md:col-4">
                    <label htmlFor="rent_price">اجاره </label>
                    <InputNumber id="rent_price" value={selectedRowData.rent_price ?? null} readOnly/>
                  </div>}
              </> : <div className="field col-12 md:col-4">
                <label htmlFor="total_price_rounded">قیمت </label>
                <InputNumber id="total_price_rounded" value={selectedRowData.total_price_rounded ?? null} readOnly/>
              </div>}
              <div className="field col-12 md:col-4">
                <label htmlFor="area"> متراژ </label>
                <InputNumber id="area" value={selectedRowData.area ?? null} readOnly/>
              </div>
              <div className="field col-12 md:col-4">
                <label htmlFor="district">منطقه </label>
                <InputNumber id="district" value={selectedRowData.district ?? null} readOnly/>
              </div>
              {/*<div className="field col-12 md:col-4">*/}
              {/*  <label htmlFor="age">سال ساخت </label>*/}
              {/*  /!*<InputText id="age" value={selectedRowData.age ?? null} readOnly/>*!/*/}
              {/*  /!*<InputText id="age" value={formatDate(selectedRowData.created) ?? '-'} readOnly/>*!/*/}
              {/*  <InputText id="age" value={''} readOnly/>*/}
              {/*</div>*/}
              <div className="field col-12 md:col-4">
                <label htmlFor="parking">پارکینگ </label>
                <InputNumber id="parking" value={selectedRowData.parking ?? null} readOnly/>
              </div>
              <div className="field col-12 md:col-4">
                <label htmlFor="warehouses">انباری </label>
                <InputNumber id="warehouses" value={selectedRowData.warehouses ?? null} readOnly/>
              </div>
              <div className="field col-12 md:col-4">
                <label htmlFor="elevators">آسانسور </label>
                <InputNumber id="elevators" value={selectedRowData.elevators ?? null} readOnly/>
              </div>
              {selectedRowData?.age ? <div className="field col-12 md:col-4">
                <label htmlFor="age"> سن بنا</label>
                <InputText id="age" value={selectedRowData?.age ?? null} readOnly/>
              </div> : null}
              <div className="field col-12">
                <label htmlFor="location"> آدرس</label>
                <InputText id="location" value={selectedRowData.address ?? null} readOnly/>
              </div>

            </div>
            {
              canShowExtraDescription && (
                <div className="guide-box mt-3">
                  <p className="font-bold mb-0 rtl">
                    <i className="pi pi-info-circle fs-md ml-2"
                       style={{display: "inline-block", verticalAlign: "middle", fontSize: "20px"}}></i>
                    کاربر گرامی، جهت اخذ و نمایش اطلاعات کامل این فایل و مشاهده بقیه موارد مشابه، فیلتر های مورد نظر را
                    انتخاب و به صفحه‌ی جستجو مراجعه نمایید.</p>
                </div>
              )
            }
          </div>
        )}
        <div className="field col-3">
          <div style={{minHeight: "80%"}} className="col-12 relative">
            <img
              src={previewImageIndex > -1 ? images[previewImageIndex].src : (selectedRowData ? selectedRowData.neighborhood_image : images[0].src)}
              alt="images"
              style={{
                width: '100%', // Ensures it goes full width
                aspectRatio: '1 / 1', // Forces a square aspect ratio
                objectFit: 'cover',
                top: '50%',
                transform: 'translateY(-50%)',
                position: 'absolute'
              }}
              loading="lazy"
            />
          </div>
          <div className="field flex col-12 mt-4 justify-content-between align-content-center"
               style={{overflowX: 'auto'}}>
            {images.slice(0)?.map((image, index) => (
              <div key={image.id}
                   className="mx-1"
                   style={{display: 'flex', justifyContent: 'center'}}>
                <Image src={image.src}
                       alt={image.alt}
                       width={50}
                       height={50}
                       onClick={() => selectImageHandler(index)}
                       style={{objectFit: 'cover'}}/>
              </div>
            ))}
          </div>
        </div>
        <div className="field col-12 flex" style={{flexDirection: 'row-reverse'}}>
          <div className="col-3">
            <Button raised label="بستن" type="button" className=" border-0 mt-2" severity="secondary" onClick={onHide}/>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default PropertyDialog
