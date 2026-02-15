'use client';
import React, {useEffect, useState} from 'react';
import {SelectButton, SelectButtonChangeEvent} from 'primereact/selectbutton';
import {getPackages} from '../FilterItem/(services)/filter.service';
import {FREE, Inquiry, IPackages, PackagesType, WITH_INQUIRY, WITHOUT_INQUIRY} from './(models)/package';
import {ProgressSpinner} from 'primereact/progressspinner';
import {formatMoneyToPersianUnit} from '@/app/utils/moneyUtils';
import {useUserContext} from '@/layout/context/usercontext';
import Joyride, {ACTIONS, CallBackProps, EVENTS, STATUS} from 'react-joyride';

const PackageItem = ({
                       selectedPackage,
                       setSelectedPackage,
                       tourTarget,
                       firstBuyer,
                       prices,
                       hasShownInquiryModal
                     }: any) => {
  const [packages, setPackages] = useState<IPackages[]>([]);
  const [showFreeFilesTour, setShowFreeFilesTour] = useState<boolean>(false);
  const [showWithoutInquiryTour, setShowWithoutInquiryTour] = useState<boolean>(false);
  const [showWithInquiryTour, setShowWithInquiryTour] = useState<boolean>(false);
  const price = prices ? Array.from(prices.values())[0] as any : null;
  const {user} = useUserContext();

  const items: PackagesType = [
    {
      name: `با استعلام ${formatMoneyToPersianUnit(price?.[WITH_INQUIRY])} تومان`,
      value: WITH_INQUIRY,
      disabled: firstBuyer
    },
    {
      name: `بدون استعلام ${formatMoneyToPersianUnit(price?.[WITHOUT_INQUIRY])} تومان`,
      value: WITHOUT_INQUIRY,
      // disabled: !firstBuyer
      disabled: hasShownInquiryModal
    },
    {
      name: "ده فایل رایگان",
      value: FREE,
      disabled: user == null ? hasShownInquiryModal : (!firstBuyer || hasShownInquiryModal)
    },
  ];

  const buttonTemplate = (option: PackagesType[number]) => {
    return <div className={'text-center w-full package-' + option.value}>{option.name}</div>
  }
  const freeFilesSteps = [
    {
      // target: '.package-card-selector',
      target: '.package-card-selector .package-' + FREE,
      content: (
        <p>یکی از تفاوت های اصلی ما با سایر پلتفرم های آگهی دهنده معرفی مالکین بدون حضور واسطه هاست که در نهایت بدون
          پرداخت کمیسیون معاملتون انجام میشه.در جهت اثبات این موضوع پس از اولین ثبت نام،چنانچه مایل باشید درخواست ۱۰ عدد
          فایل رایگان را کلیک کنید،و با انتخاب حداکثر ۱۰ فایل رایگان و ۱۰ فایل جایگزین،درخواست شما بلا فاصله به اپراتور
          منتقل و سپس اپراتور به لحظه،با مالک تماس گرفته و موجودیت فایل احراز میگردد،و پس از آن برای شما ارسال میگردد.در
          ادامه چنانچه مایل بودید میتوانید از خرید فایل های استعلامی یا اشتراک ماهانه بهره مند شوید.همراهتان هستیم تا
          انتقال قراردادتان در سامانه رسمی(ثبت قرارداد برای شما رایگان میباشد)</p>
      ),
      disableBeacon: true,
      disableScrolling: true,
    }
  ];
  const withInquiryFilesSteps = [
    {
      // target: '.package-card-selector',
      target: '.package-card-selector .package-' + WITH_INQUIRY,
      content: (
        <p>کاربر محترم،با انتخاب این گزینه پس از انتخاب موارد جایگزین و خرید،قبل از ارسال،توسط ما استعلام موجودیت به
          لحظه شده و سپس ارسال میگردد.
          ساعات استعلام:ایام هفته شنبه تا چهارشنبه 11 الی 14 ، 16 الی 19 پنجشنبه ها 11 الی 14 ، 16 الی 18</p>
      ),
      disableBeacon: true,
      disableScrolling: true,
    }
  ];
  const withoutInquiryFilesSteps = [
    {
      // target: '.package-card-selector',
      target: '.package-card-selector .package-' + WITHOUT_INQUIRY,
      content: (
        <p>کاربر محترم با انتخاب این گزینه،فایل های منتخب شما بدون استعلام به لحظه در طول شبانه روز ارسال میگردد،ما
          تضمینی در موجودیت به لحظه نداریم و با قیمتی کمتر از فایل های استعلامی عرضه می گردد.</p>
      ),
      disableBeacon: true,
      disableScrolling: true,
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

  const selectPackageHandler = (inquiry: Inquiry) => {
    switch (inquiry) {
      case WITH_INQUIRY:
        setSelectedPackage(WITH_INQUIRY);
        break;
      case FREE:
        setSelectedPackage(FREE);
        break;
      case WITHOUT_INQUIRY:
        setSelectedPackage(WITHOUT_INQUIRY);
        break;
      default:
        break;
    }
    // const hasSeenFreeFilesTour = localStorage.getItem('hasSeenFreeFilesTour');
    // if (!hasSeenFreeFilesTour) {
    //   localStorage.setItem('hasSeenFreeFilesTour', 'true'); // Set a flag to not show tour again
    // }
  };

  useEffect(() => {
    switch (selectedPackage) {
      case WITH_INQUIRY:
        setShowWithInquiryTour(true);
        break;
      case FREE:
        setShowFreeFilesTour(true);
        break;
      case WITHOUT_INQUIRY:
        setShowWithoutInquiryTour(true);
        break;
      default:
        break;
    }
  }, [selectedPackage, setShowWithInquiryTour, setShowFreeFilesTour, setShowWithoutInquiryTour]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    // If the tour finished or was skipped, reset the run state
    if (['finished', 'skipped'].includes(status)) {
      setShowFreeFilesTour(false);
      setShowWithInquiryTour(false);
      setShowWithoutInquiryTour(false);

      // Optional: Add a small delay before allowing the tour to run again
      setTimeout(() => {
        // This ensures the tour can be triggered again
      }, 100);
    }
  }


  if (!packages.length) return <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8"
                                                fill="var(--surface-ground)" animationDuration=".5s"/>;
  return (
    <div className="surface-0">
      <div className="card flex justify-content-center package-card-selector " dir="ltr">
        <SelectButton style={{minWidth: '50%'}} value={selectedPackage}
                      onChange={(e: SelectButtonChangeEvent) => selectPackageHandler(e.value)} optionLabel="name"
                      options={items}
                      multiple={false}
                      itemTemplate={buttonTemplate}/>
      </div>

      <Joyride
        callback={handleJoyrideCallback}
        steps={freeFilesSteps}
        continuous
        spotlightClicks
        showSkipButton
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

      <Joyride
        callback={handleJoyrideCallback}
        steps={withInquiryFilesSteps}
        continuous
        spotlightClicks
        showSkipButton
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
        run={showWithInquiryTour}
      />

      <Joyride
        callback={handleJoyrideCallback}
        steps={withoutInquiryFilesSteps}
        continuous
        spotlightClicks
        showSkipButton
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
        run={showWithoutInquiryTour}
      />
    </div>
  );
};

export default PackageItem;
