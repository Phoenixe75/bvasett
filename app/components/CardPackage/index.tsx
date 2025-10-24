'use client';
import React, {useCallback, useEffect, useState} from 'react';
import {SelectButton, SelectButtonChangeEvent} from 'primereact/selectbutton';
import {getPackages} from '../FilterItem/(services)/filter.service';
import {FREE, Inquiry, IPackages, PackagesType, WITH_INQUIRY, WITHOUT_INQUIRY} from './(models)/package';
import {ProgressSpinner} from 'primereact/progressspinner';
import {formatMoneyToPersianUnit} from '@/app/utils/moneyUtils';
import {useUserContext} from '@/layout/context/usercontext';
import Joyride from 'react-joyride';

const PackageItem = ({selectedPackage, setSelectedPackage, tourTarget, firstBuyer, prices}: any) => {
  const [packages, setPackages] = useState<IPackages[]>([]);
  const [showFreeFilesTour, setShowFreeFilesTour] = useState<boolean>(false);
  const price = prices ? Array.from(prices.values())[0] as any : null;
  const {user} = useUserContext();

  const items: PackagesType = [
    {
      name: `با استعلام ${formatMoneyToPersianUnit(price?.[WITH_INQUIRY])}`,
      value: WITH_INQUIRY,
      disabled: firstBuyer
    },
    {
      name: `بدون استعلام ${formatMoneyToPersianUnit(price?.[WITHOUT_INQUIRY])}`,
      value: WITHOUT_INQUIRY,
      // disabled: !firstBuyer
      // disabled: !user
    },
    {
      name: "سه تایی رایگان",
      value: FREE,
      disabled: user == null ? false : !firstBuyer
    },
  ];
  const freeFilesSteps = [
    {
      target: '.package-card-selector',
      content: (
        <p>یکی از تفاوت های اصلی ما با سایر پلتفرم های آگهی دهنده معرفی مالکین بدون حضور واسطه هاست که در نهایت بدون پرداخت کمیسیون معاملتون انجام میشه.در جهت اثبات این موضوع پس از اولین ثبت نام،چنانچه مایل باشید درخواست ۳ عدد فایل رایگان را کلیک کنید،و با انتخاب حداکثر ۳ فایل رایگان و ۳ فایل جایگزین،درخواست شما بلا فاصله به اپراتور منتقل و سپس اپراتور به لحظه،با مالک تماس گرفته و موجودیت فایل احراز میگردد،و پس از آن برای شما ارسال میگردد.در ادامه چنانچه مایل بودید میتوانید از خرید فایل های استعلامی یا اشتراک ماهانه بهره مند شوید.همراهتان هستیم تا انتقال قراردادتان در سامانه رسمی(ثبت قرارداد برای شما رایگان میباشد)</p>
      ),
      disableBeacon: true
    }
  ];
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await getPackages();
        setPackages(response);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    fetchPackages();
  }, []);

  useEffect(() => {
    if (tourTarget) {
      const element = document.querySelector(tourTarget);
      if (element) {
        element.setAttribute('data-joyride', 'true');
      }
    }
  }, [tourTarget]);

  const selectPackageHandler = useCallback((inquiry: Inquiry) => {
    switch (inquiry) {
      case WITH_INQUIRY:
        setSelectedPackage(WITH_INQUIRY);
        break;
      case FREE:
        setSelectedPackage(FREE);
        break;
      case WITHOUT_INQUIRY:
      default:
        setSelectedPackage(WITHOUT_INQUIRY);
        break;
    }
    const hasSeenFreeFilesTour = localStorage.getItem('hasSeenFreeFilesTour');
    if (!hasSeenFreeFilesTour) {
      setShowFreeFilesTour(true);
      localStorage.setItem('hasSeenFreeFilesTour', 'true'); // Set a flag to not show tour again
    }
  }, [selectedPackage, setSelectedPackage]);


  if (!packages.length) return <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8"
                                                fill="var(--surface-ground)" animationDuration=".5s"/>;
  return (
    <div className="surface-0">
      <div className="card flex justify-content-center package-card-selector " dir="ltr">
        <SelectButton style={{minWidth: '50%'}} value={selectedPackage}
                      onChange={(e: SelectButtonChangeEvent) => selectPackageHandler(e.value)} optionLabel="name"
                      options={items} multiple={false}/>
      </div>

      <Joyride
        steps={freeFilesSteps}
        continuous
        showProgress
        showSkipButton
        scrollToFirstStep={false}
        styles={{
          options: {
            zIndex: 10000
          }
        }}
        locale={{
          next: 'بعدی',
          back: 'قبلی',
          last: 'پایان',
          skip: 'نمی‌خواهم'
        }}
        run={showFreeFilesTour}
      />
    </div>
  );
};

export default PackageItem;
