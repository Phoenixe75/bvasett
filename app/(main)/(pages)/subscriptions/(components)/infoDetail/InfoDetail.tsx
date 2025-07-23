import React from 'react'
import styles from "./info-detail.module.scss";
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
const benefits = [
  'دسترسی کامل و نامحدود به تمامی فایل‌های مناطق انتخاب شده توسط کاربر',
  'پشتیبانی آنلاین در تمام روزهای هفته',
  'دریافت به‌روز‌رسانی‌ها و امکانات جدید به صورت رایگان',
  'امکان استفاده از اشتراک روی ۲ دستگاه ویندوزی و موبایل',
  'فعال بودن قابلیت مشاهده فایل‌ها بر روی انواع معاملات',
]
export default function InfoDetail() {
  const router= useRouter();
  const onSupportClick = () => {
    router.push("/contact")
  }
  return (
    <div className={styles.wrapper}>
      <div className='flex align-items-center gap-3'>
      <i className="pi pi-info-circle" style={{ fontSize: '32px' }}></i>
      <h3>مزایای استفاده از اشتراک ماهیانه</h3>
      </div>
      <ul className='flex-1'>
        {benefits.map((item,index) => <li className='mb-6' key={index}><h5>{item}</h5></li>)}
      </ul>
      <div className={styles.line}></div>
      <h5 className={styles.support}>برای اطلاعات بیشتر با پشتیبانی تماس بگیرید.</h5>
      <Button onClick={onSupportClick} className='w-full flex justify-content-center aling-items-center
    ' severity='warning'>
        ارتباط با پشتیبانی
      </Button>
    </div>
  )
}
