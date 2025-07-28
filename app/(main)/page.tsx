'use client';
import React, {ElementType, useEffect, useMemo, useState} from 'react';
import Carousel from '../components/Carousel';
import CardCell from '@/app/components/CardCell';
import Questions from '@/app/components/Question';
import FilterItem from '@/app/components/FilterItem';
import AppHeader from '@/layout/AppHeader';
import AppFooter from '@/layout/AppFooter';
import AppCopyRight from '@/layout/AppCopyRight';
import {SliderProvider} from '@/layout/context/SliderContext';
import {Accordion, AccordionTab, AccordionTabChangeEvent} from 'primereact/accordion';
import Joyride, {BeaconRenderProps} from 'react-joyride';
import MarqueeBanner from '../components/MarqueeBanner';
import {Button} from 'primereact/button';
import Link from 'next/link';
import {useLocalStorage} from 'primereact/hooks';
import {StaticTime} from '@/app/components/StaticTime';

const joyRideSteps = [
  {
    target: '.header',
    content: 'در هدر سایت می‌توانید به صفحه اصلی، بخش مقالات، درباره ما و قسمت پشتیبانی دسترسی داشته باشید.'
  },
  {
    target: '.login-btn',
    content: 'برای استفاده کامل از سایت و دسترسی به همه امکانات، ابتدا وارد حساب کاربری خود شوید یا ثبت نام کنید.'
  },
  {
    target: '.search',
    content:
      'در این قسمت می‌توانید نوع معامله را انتخاب کنید (فروش، رهن یا اجاره). سپس بازه قیمت و متراژ مورد نظر خود را وارد کنید. تعداد اتاق‌ها و محله مورد علاقه‌تان را مشخص کنید تا بهترین گزینه‌ها برای شما نمایش داده شود. بعد از پر کردن فیلدها، روی دکمه جستجو بزنید تا نتایج مطابق خواسته‌تان نمایش داده شود.'
  },
  {
    target: '.ads_sample',
    content: 'در این قسمت جدیدترین ملک‌های ثبت شده را مشاهده می‌کنید. هر ملک همراه با نوع معامله (فروش یا اجاره)، متراژ، محله و قیمت نمایش داده شده است. با کلیک روی دکمه «جزئیات» می‌توانید اطلاعات کامل‌تر هر ملک را ببینید.'
  },
  {
    target: '.questions_wrapper',
    content: 'در این بخش پاسخ سوالات پرتکرار و رایج را می‌بینید. اگر سوال شما در بین این موارد نبود، می‌توانید از طریق ثبت تیکت در بخش پشتیبانی، سوال خود را مطرح کنید و پاسخ بگیرید.'
  }
];
const free7FilesTourJoyRideSteps = [
  {
    target: '.search-button',
    content: '7 فایل رایگان:یکی از تفاوت های اصلی ما با سایر پلتفرم های آگهی دهنده معرفی مالکین بدون حضور واسطه هاست که در نهایت بدون پرداخت کمیسیون معاملتون انجام میشه.در جهت اثبات این موضوع پس از اولین ثبت نام،چنانچه مایل باشید درخواست 7 عدد فایل رایگان را کلیک کنید،و با انتخاب حداکثر 7 فایل رایگان و 7 فایل جایگزین،درخواست شما بلا فاصله به اپراتور منتقل و سپس اپراتور به لحظه،با مالک تماس گرفته و موجودیت فایل احراز میگردد،و پس از آن برای شما ارسال میگردد.در ادامه چنانچه مایل بودید میتوانید از خرید فایل های استعلامی یا اشتراک ماهانه بهره مند شوید.همراهتان هستیم تا انتقال قراردادتان در سامانه رسمی(ثبت قرارداد برای شما رایگان میباشد)'
  },
  {
    target: '.search-button',
    content: 'تک فایل استعلامی:پس از دریافت 7 فایل رایگان خود میتوانید با انتخاب موارد درخواستی به همراه جایگزین توسط اپراتور ما استعلام موجودیت به لحظه انجام شده و سپس برایتان ارسال میگردد.یکی از ارزش های فایل موجودیت به لحظه میباشد،و باز این تفاوت ماست با سایر پلتفرم ها،همراهتان هستیم تا پایان قرارداد رسمی.'
  },
];
const singleInquiryTourJoyRideSteps = [];
const LandingPage = () => {
  const [isHidden, setIsHidden] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [fullyLoaded, setFullyLoaded] = useState(false);
  const [showFree7FilesTour, setShowFree7FilesTour] = useState(false);
  const [showBanner, setShowBanner] = useState(() => showFree7FilesTour || false);
  const [activeAccordionIndex, setActiveAccordionIndex] = useState<number | number[] | null | undefined>(null);
  const [showSingleInquiryTourJoyRideSteps, setShowSingleInquiryTourJoyRideSteps] = useState(false);
  const [count, setCount] = useState(0);

  const toggleAccordion = () => {
    setShowBanner(pre => !pre);
  }
  const openAccordion = () => {
    setShowBanner(false);
  }
  const closeAccordion = () => {
    setShowBanner(true);
  }
  const toggleMenuItemClick = () => {
    setIsHidden((prevState) => !prevState);
  };
  const loadingIsFinished = () => {
    setFullyLoaded(true);
  };
  useEffect(() => {
    if (!fullyLoaded) {
      return;
    }
    const hasSeenMainPageTour = localStorage.getItem('hasSeenMainPageTour');
    if (!hasSeenMainPageTour) {
      setShowTour(true);
      localStorage.setItem('hasSeenMainPageTour', 'true'); // Set a flag to not show tour again
    }
  }, [fullyLoaded]);
  useEffect(() => {
    if (showBanner) {
      return;
    }
    if (showFree7FilesTour) {
      openAccordion();
      setActiveAccordionIndex(0);
      setTimeout(() => {
        document.getElementsByClassName('search-button')[0].scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 1000);
    }
  }, [showBanner, openAccordion, setActiveAccordionIndex,  showFree7FilesTour]);

  const onTabChange = (event: AccordionTabChangeEvent) => {
    console.log(event.index)
  }

  const preview7FreeFiles: () => void = () => {
    setShowFree7FilesTour(true);
  }

  const handleFree7FilesTourJoyRideCallback = (data: any) => {
    const { status } = data;
    if (status === 'finished' || status === 'skipped') {
      setShowFree7FilesTour(false); // Stop the tour when finished or skipped
    }
  }

  const [oldFormData, ] = useLocalStorage(null, 'filterForm');
  const [oldForm, setOldForm] = useState(null);

  useEffect(() => {
    if (oldFormData != null) {
      setOldForm(oldFormData);
    }
  }, [oldFormData]);

  return (
    <div className="flex justify-content-center body" style={{backgroundColor: '#fcfcff'}}>
      <div id="home" className="landing-wrapper overflow-hidden">
        <AppHeader loadingIsFinished={loadingIsFinished} toggleMenuItemClick={toggleMenuItemClick} isHidden={isHidden}
                   setIsHidden={setIsHidden}/>
        <div className="grid align-items-center justify-content-start px-3 py-2" style={{backgroundColor: '#111'}}>
          <div className="col-auto">
            <StaticTime/>
          </div>
          <div className="col-8 pb-0">
            <MarqueeBanner/>
          </div>
        </div>
        <div id="Carousel" className="hidden lg:flex flex-column overflow-hidden carousel-custom">
          <SliderProvider>
            <Carousel/>
          </SliderProvider>
        </div>
        <div id="filess" className="home_property_wallet">
          <div style={{width: '280px'}} id="FilterItem" className="pb-4 mx-0 mobile_filter_wrapper search">
            {/*<div className="text-center">*/}
            {/*    <h2 className="text-900 font-light mb-2">‎ </h2>*/}
            {/*</div>*/}
            {/*<h5 className='hide_in_mobile'>‎</h5>*/}
            <div className="pt-0 md:pt-2">
              {/*<Accordion activeIndex={activeAccordionIndex} onTabChange={(e) => setActiveAccordionIndex(pre => Number(e.index) == Number(pre) ? null : e.index)}>*/}
              <Accordion activeIndex={activeAccordionIndex} onTabChange={e => {
                setActiveAccordionIndex(pre => e.index == pre ? null : e.index);
              }} onTabClose={closeAccordion} onTabOpen={openAccordion}>
                <AccordionTab headerClassName="search-btn-wrapper" header="جستجو">
                  <FilterItem oldForm={oldForm}/>
                </AccordionTab>
              </Accordion>
              <Button className="search-btn w-full mb-2">
                درخواست ثبت قرارداد
              </Button>
              {showBanner &&
                <img className='main_page_banner' style={{width: '100%', height: 'auto'}} src={"/images/ad-banner.jpg"}
                     alt='banner'/>}

            </div>
          </div>

          <div id="CardCell" className="pb-4 pt-3 pr-4 mx-0 flex-1 property_home_cards ads_sample">
            <div className="grid justify-content-start mb-1">
              <div className="md:col-6 col-12">
                <div className="grid justify-content-center">
                  <div className="col py-0">
                    <Button raised type="button"
                            id="free7Files"
                            className="guide-btn justify-content-center w-full"
                            onClick={preview7FreeFiles}>
                      7 فایل رایگان
                    </Button>
                  </div>
                  <div className="col py-0">
                    <Button raised type="button"
                            className="guide-btn justify-content-center w-full">
                      تک فایل استعلامی
                    </Button>
                  </div>
                  <div className="col py-0">
                    <Link href="/subscriptions">
                      <Button raised type="button"
                              className="guide-btn justify-content-center w-full">
                        خرید اشتراک
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="grid mt-1">
                  <div className="col-12 py-0 text-center">
                    <h5 className="mb-0 mt-3">{`آخرین ملک های ثبت شده: ${count}`}</h5>
                  </div>
                </div>
              </div>
              <div className="md:col-6 col-12 text-left py-0">
                <div className="grid justify-content-center h-full m-0">
                  {/*<div className="col py-0">
                    <Button raised
                            type="button"
                            className="guide-btn justify-content-center w-full">
                      مورد 1
                    </Button>
                  </div>
                  <div className="col py-0">
                    <Button raised
                            type="button"
                            className="guide-btn justify-content-center w-full">
                      مورد 2
                    </Button>
                  </div>
                  <div className="col py-0">
                    <Button raised
                            type="button"
                            className="guide-btn justify-content-center w-full">
                      مورد 3
                    </Button>
                  </div>*/}
                  <Button className="novin-btn justify-content-center w-full">خدمات جدید، <span className="text-danger d-inline-block align-middle mr-1">به‌زودی</span>...</Button>
                </div>
                {/*<div className='flex flex-row-reverse w-full mt-1'>*/}
                {/*<div className='flex flex-row-reverse w-full'>*/}
                {/*  <h5 className="mb-0 mt-3">{`آخرین ملک های ثبت شده: ${count}`}</h5>*/}
                {/*</div>*/}
              </div>
            </div>
            <div className="grid justify-content-center">
              <CardCell count={count} setCount={setCount}/>

              <div className="col-12 md:p-8">
                <div
                  className="flex flex-column justify-content-center align-items-center text-center px-3 py-3 md:py-0 questions_wrapper">
                  <h3 className="text-gray-900 mb-2 ">پرسش‌های متداول</h3>
                  <Questions/>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* style={{ backgroundColor: '#5a9e19' }} */}
        {/* style={{ backgroundColor: '#083b19' }} */}
        <Joyride
          steps={free7FilesTourJoyRideSteps}
          showSkipButton={true}
          continuous
          styles={{
            options: {
              zIndex: 90000
            }
          }}
          scrollOffset={0}
          locale={{
            next: 'بعدی',
            back: 'قبلی',
            last: 'پایان',
            skip: 'نمی‌خواهم',
            close: 'بستن'
          }}
          run={showFree7FilesTour && !showBanner && activeAccordionIndex === 0}
          callback={handleFree7FilesTourJoyRideCallback}
        />
        <Joyride
          steps={joyRideSteps}
          showSkipButton={true}
          scrollToFirstStep={true}
          styles={{
            options: {
              zIndex: 90000
            }
          }}
          scrollOffset={160}
          locale={{
            next: 'بعدی',
            back: 'قبلی',
            last: 'پایان',
            skip: 'نمی‌خواهم',
            close: 'بستن'
          }}
          run={showTour}
        />
        <div className="py-4 px-8 headerColor">
          <AppFooter/>
          <AppCopyRight/>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
