'use client';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {ProgressSpinner} from 'primereact/progressspinner';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import {filterAds, getPrices} from '@/app/components/FilterItem/(services)/filter.service';
import PackageItem from '@/app/components/CardPackage';
import {
  formatNumber,
  getLocationLabel,
  getRooms,
  getTypeLabel,
  truncateText
} from '@/app/dashboard/admin/ads/constant/converter';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import {toast} from 'react-toastify';
import Joyride from 'react-joyride';
import SuggestItem from '@/app/components/SuggestItem';
import {orderBuy, paymentRequestService} from './(services)/orderBuy.service';
import {IOrderBuyResponse, IPaymentStatus, ItemBasedOrderBuyRequest} from './(models)/orderBuy';
import AppHeader from '@/layout/AppHeader';
import AppFooter from '@/layout/AppFooter';
import AppCopyRight from '@/layout/AppCopyRight';
import ItemCards from '@/app/components/ItemCards';
import {useUserContext} from '@/layout/context/usercontext';
import {TRANSLATIONS} from './translation';
import PropertyDialog from '@/app/components/PropertyDialog';
import LoginModal from '@/app/components/LoginModal';
import {
  FREE,
  Inquiry,
  InquiryLabel,
  WITH_INQUIRY,
  WITHOUT_INQUIRY
} from '@/app/components/CardPackage/(models)/package';
import {formatMoneyToPersianUnit} from '@/app/utils/moneyUtils';
import {Checkbox} from 'primereact/checkbox';
import {IAds} from '@/app/dashboard/admin/ads/(models)/ads';
import {ConfirmDialog} from 'primereact/confirmdialog';
import {FaCircleExclamation} from 'react-icons/fa6';
import MaintenanceModal from '@/app/components/MaintenanceModal';

const FilterResultPage: React.FC = () => {
  const [formData, setFormData] = useState<any[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Inquiry | null>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [extraSelectedRows, setExtraSelectedRows] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [nextPageBtnLoading, setNextPageBtnLoading] = useState<boolean>(true);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [hasShownInquiryModal, setHasShownInquiryModal] = useState(false);
  const [prices, setPrices] = useState<any>(null);
  const [orderInfo, setOrderInfo] = useState<IOrderBuyResponse | null>(null)
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [next, setNext] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState<any | null>(null);
  const [displayDialog, setDisplayDialog] = useState<boolean>(false);
  const [showTour, setShowTour] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [notifyMeChecked, setNotifiedMeChecked] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [openLoginForm, setOpenLoginForm] = useState(false);
  const {user} = useUserContext();
  const firstBuyer = user?.orders === 0;
  const doesGetInitialData = useRef(false);
  const [loadedAddIndexes, setLoadedAddIndexes] = useState<Array<number>>([]);
  const [goTopTopIndex, setGoToTopIndex] = useState<number>(-1);
  const [mustRemoveFromBuyAd, setMustRemoveFromBuyAd] = useState<any>(null);
  const [displayConfirmDialog, setDisplayConfirmDialog] = useState<boolean>(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const cancelDeleteFromBuy = () => {
    setDisplayConfirmDialog(false);
  };
  const confirmDeleteFromBuy = (ad: any) => {
    setMustRemoveFromBuyAd(ad);
    setDisplayConfirmDialog(true);
  };

  useEffect(() => {
    if (!!formData && formData.length) {
      setLoadedAddIndexes(newArray => {
        if (!newArray) {
          newArray = [];
        }
        if (!newArray.includes(formData.length)) {
          newArray.push(formData.toSorted().length);
        }
        if (newArray) {
          setGoToTopIndex((newArray.length ?? 0) - 1);
        }
        return newArray;
      });
    }
  }, [formData?.length, loadedAddIndexes, setLoadedAddIndexes, setGoToTopIndex]);
  const scrollIntoViewFirstLoadedAdd = useMemo(() => (() => {
    if (goTopTopIndex > -1) {
      if (loadedAddIndexes.length) {
        document.querySelector(`.result-${loadedAddIndexes[goTopTopIndex] - 1}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        return setGoToTopIndex(pre => --pre);
      }
    } else if (goTopTopIndex === -1) {
      return window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }), [goTopTopIndex, loadedAddIndexes, setGoToTopIndex]);
  // useEffect(() => {
  //   if (!user) {
  //     return
  //   }
  // if (firstBuyer) {
  //   setSelectedPackage(WITHOUT_INQUIRY)
  // }
  // setSelectedPackage(WITH_INQUIRY)
  // }, [user])
  const fetchPrices = async () => {
    try {
      const response = await getPrices();
      const newPrices = new Map()
      response.forEach((price: any) => {
        newPrices.set(price.ad_purpose, price)
      })
      setPrices(newPrices)
      return newPrices
    } catch (error) {
      console.log(error)
    }
  }
  const fetchData = async (page: number) => {
    setNextPageBtnLoading(true);
    doesGetInitialData.current = true;
    try {
      const results = searchParams.get('results');
      if (results) {
        const decodedResults = JSON.parse(decodeURIComponent(results));
        const data = await filterAds(decodedResults, page);
        let recievedPrices = prices
        if (!prices) {
          recievedPrices = await fetchPrices()
        }
        const newResults = data.results.map((item: any) => ({
          ...item,
          priceInfo: recievedPrices.get(item.purpose)
        }));
        setFormData(pre => [...pre, ...newResults]);
        setCount(data.count);
        setNext(data.next);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    } finally {
      setNextPageBtnLoading(false);
    }
  };
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setShowTour(true);
      localStorage.setItem('hasSeenTour', 'true'); // Set a flag to not show tour again
    }
  }, []);

  useEffect(() => {
    if (page === 0 && doesGetInitialData.current) {
      return
    }
    fetchData(page + 1);
  }, [searchParams, page]);

  const onPageChange = (event: any) => {
    setPage((pre) => pre + 1);
    // setRows(event.rows);
  };

  const back = (): void => {
    if (hasShownInquiryModal) {
      setHasShownInquiryModal(false);
      setExtraSelectedRows([]);
      setSelectedRows([])
      return;
    }
    router.back();
  };

  const showDetails = (rowData: any, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedRowData(rowData);
    setDisplayDialog(true);
  };

  const hideDialog = () => {
    setDisplayDialog(false);
    setSelectedRowData(null);
  };

  const maxCount = useMemo(() => {
    if (firstBuyer) {
      return 10
    }
    if (!selectedPackage) {
      return 0
    }
    if (hasShownInquiryModal) {
      return selectedRows.length
    }
    return Infinity
  }, [selectedPackage, hasShownInquiryModal, selectedRows, firstBuyer]);
  const handleSelectionChange = (e: any) => {
    if (e.length > maxCount) {
      return
    }
    if (hasShownInquiryModal) {
      setExtraSelectedRows(e); // به سادگی مقدار e.value را تنظیم کنید
      return;
    }
    setSelectedRows(e); // به سادگی مقدار e.value را تنظیم کنید
  };

  const handleBuyClick = async () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
    // if (selectedPackage === WITH_INQUIRY && !firstBuyer && !hasShownInquiryModal) {
    //   setShowInquiryModal(true);
    //   return;
    // }
    if ((selectedPackage === WITH_INQUIRY || selectedPackage === FREE) && !hasShownInquiryModal) {
      setShowInquiryModal(true);
      return;
    }
    if (selectedRows.length === 0 && !selectedPackage) {
      toast.error('لطفاً یک پکیج انتخاب کنید و حداقل یک مورد را از جدول انتخاب نمایید.');
      return;
    }
    if (!user || !user.id) {
      toast.error(TRANSLATIONS.notLoginError);
      setOpenLoginForm(true);
      return;
    }
    await getFactor();
    if (!firstBuyer) {
      setShowModal(true);
    } else {
      toast.success('خرید با موفقیت انجام شد.');
      setTimeout(() => {
        router.push('dashboard/user/my-payments');
      }, 1500)
    }

  };

  const steps = [
    {
      target: '.packagess',
      content: 'جهت خرید فایل ابتدا باید پکیج مورد نظر را انتخاب کنید'
    },
    {
      target: '.filess',
      content: 'شما میتوانید دو برابر تعداد پکیج خود فایل انتخاب کنید '
    },
    {
      target: '.suggests',
      content: 'شما میتوانید از لیست آگهی های پیشنهادی فایل نیز انتخاب کنید'
    },
    {
      target: '.buys',
      content: 'پس انتخاب پکیج و انتخاب فایل های خود فرآیند خرید را میتوانید تکمیل کنید'
    }
  ];
  const onHide = () => {
    setOpenLoginForm(false);
  };
  const getFactor = async () => {
    setBtnLoading(true)
    try {
      const formData: ItemBasedOrderBuyRequest = {
        ads: selectedRows.map((row) => row.id),
        extra_ads: (selectedPackage === WITH_INQUIRY || selectedPackage === FREE) ? extraSelectedRows.map((row) => row.id) : [],
        with_inquiry: (selectedPackage === WITH_INQUIRY || selectedPackage === FREE)
      }
      const res = await orderBuy(formData)
      setOrderInfo(res)
    } catch (error) {
      console.log(error)
    } finally {
      setBtnLoading(false)
    }
  }
  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !user.id) {
      toast.error(TRANSLATIONS.notLoginError);
      setOpenLoginForm(true);
      return;
    }
    setShowMaintenanceModal(true);
    return;
    // setBtnLoading(true);
    // try {
    //   const guid = orderInfo?.order_guid;
    //   if (!guid) {
    //     toast.error('خرید با خطا روبرو شد.');
    //   }
    //   const resData: IPaymentStatus = await paymentRequestService({guid: guid!, type: 'ad'});
    //   if (resData?.status === 307) {
    //     if (resData.redirect_url) {
    //       // اطمینان از اینکه redirect_url مقدار null نیست
    //       toast.success('در حال انتقال به درگاه بانکی');
    //       router.push(resData.redirect_url);
    //     } else {
    //       toast.error('آدرس انتقال معتبر نیست.');
    //     }
    //   } else if (resData?.status === 503) {
    //     toast.error('خرید با خطا روبرو شد.');
    //   } else {
    //     toast.error('خرید با خطا روبرو شد.');
    //   }
    // } catch (error) {
    //   console.error('Error during purchase:', error);
    //   toast.error('خرید با خطا روبرو شد.');
    // } finally {
    //   setBtnLoading(false);
    // }
  };
  const onChoseExtraClick = () => {
    setShowInquiryModal(false);
    setHasShownInquiryModal(true);
  };
  const cardsData = useMemo(() => {
    if (hasShownInquiryModal) {
      return formData.filter((item) => !selectedRows.some((x) => x.id === item.id));
    }
    return formData;
  }, [hasShownInquiryModal, formData]);
  const removeFileFromBuyHandler = () => {
    if (mustRemoveFromBuyAd?.id) {
      try {
        if (selectedRows.length > 1) {
          setSelectedRows(prevRows => {
            const getItemIndex: number = prevRows.findIndex(item => item.id === mustRemoveFromBuyAd.id);
            if (getItemIndex > -1) {
              prevRows.splice(getItemIndex, 1)
            }
            return prevRows;
          });
          toast.success('فایل با موفقیت از لیست خرید حذف شد');
        } else {
          setSelectedRows([]);
          toast.warning('لیست خرید خالی شد');
          setShowModal(false);
        }
      } catch (error) {
        console.error('Error deleting slider:', error);
        toast.error('حذف فایل از لیست خرید با خطا مواجه شد');
      } finally {
        setDisplayConfirmDialog(false);
        setMustRemoveFromBuyAd(null);
        getFactor();
      }
    }
  }
  const actionsColumn = (item: any) => {
    return selectedPackage == WITHOUT_INQUIRY ? <>
      <Button className="p-button-sm p-button-danger"
              type="button"
              icon="pi pi-fw pi-trash"
              onClick={(event) => confirmDeleteFromBuy(item)}>

      </Button>
    </> : <></>
  }
  const titleColumnTemplate = (ad: IAds) => {
    return <>{getTypeLabel(ad?.type)} {getRooms(ad?.rooms)}</>
  }
  if (loading) return <ProgressSpinner style={{width: '50px', height: '50px'}}/>;
  return (
    <>
      <AppHeader/>
      <Button className='go-top-btn' raised onClick={scrollIntoViewFirstLoadedAdd} iconPos="top"
              icon="pi pi-fw pi-arrow-up"/>
      <div className="card p-fluid">
        <div className="packagess">
          <PackageItem prices={prices} firstBuyer={firstBuyer} selectedPackage={selectedPackage}
                       setSelectedPackage={setSelectedPackage}
                       hasShownInquiryModal={hasShownInquiryModal} tourTarget=".packagess"/>
        </div>
        <div className="p-message flex align-items-center bg-guide-btn py-2 px-3 fs-13px">
          <FaCircleExclamation className="ml-2" />
          <b>          با خرید فایل های منتخب ، نام مالک ، شماره تماس مستقیم مالک  به همراه نشانی کامل ملک ،در اختیار شما قرار گرفته و به طور مستقیم با مالک ارتباط بر قرار نمایید
            علت خرید فایل، ارتباط مستقیم با مالک میباشد ، نه واسطه</b>
        </div>
        <hr/>
        <div className='flex align-items-center justify-content-between w-full'>
          {hasShownInquiryModal ? <h5 className='m-2'>لیست آگهی‌های جایگزین</h5> :
            <h5 className='m-2'>لیست آگهی‌های یافت شده</h5>}
          {hasShownInquiryModal ?
            <h5 className='m-2'>{`تعداد آگهی جایگزین انتخابی:${extraSelectedRows.length}`}</h5> : null}
          {!hasShownInquiryModal ? <h5 className='m-2'>{`تعداد آگهی انتخابی:${selectedRows.length}`}</h5> : null}
          <h5 className='m-2'>{`تعداد: ${count}`}</h5>
        </div>
        <div>
          <Checkbox checked={notifyMeChecked} onChange={(e) => setNotifiedMeChecked(e.target.checked!)}/>
          <label className='mr-2'>در صورت اضافه شدن آگهی به این لیست، خبرم کن</label>
        </div>
        <hr/>
        <div className="filess">
          <ItemCards key={hasShownInquiryModal.toString()} data={cardsData} selectable={!!selectedPackage}
                     selectedPackage={selectedPackage || undefined} onSelectionChange={handleSelectionChange}
                     maxCount={maxCount} onShowDetails={showDetails}/>
        </div>
        {next ? (
          <div className="w-full flex justify-content-center align-items-center">
            <div>
              <Button loading={nextPageBtnLoading} onClick={onPageChange}>
                نمایش بیشتر
              </Button>
            </div>
          </div>
        ) : null}
        <PropertyDialog visible={displayDialog} onHide={hideDialog} selectedRowData={selectedRowData}/>
        <div className="field flex col-12 md:col-3 gap-2">
          <Button raised severity='success' type="submit" label="خرید" onClick={handleBuyClick}
                  disabled={!selectedPackage} loading={btnLoading}/>
          <Button raised severity='secondary' label="بازگشت" type="button" onClick={back}/>
        </div>
        <hr/>
        <h5>آگهی‌های پیشنهادی</h5>
        <hr/>
        <SuggestItem/>
        <Joyride
          steps={steps}
          continuous={true}
          showSkipButton={true}
          scrollToFirstStep={true}
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
          run={showTour}
        />
        <LoginModal onHide={onHide} visible={openLoginForm}/>
        <Dialog header={'جزئیات خرید' + (selectedPackage ? ' (' + InquiryLabel[selectedPackage] + ')' : '')}
                visible={showModal} onHide={() => setShowModal(false)} className="lg:w-6 md:w-50">
          <form onSubmit={submitForm}>
            <hr/>
            <div>
              <h5>پکیج انتخاب‌شده:</h5>
              <div className="grid p-fluid">
                <div className="md:col-4 col justify-content-between">
                  <div className="flex flex-nowrap gap-3">
                    <div className="text-nowrap ml-3">مبلغ خرید:</div>
                    <div className="text-nowrap">{formatNumber(Number(orderInfo?.total))} تومان</div>
                  </div>
                </div>
                <div className="md:col-4 col justify-content-between">
                  <div className="flex flex-nowrap gap-3">
                    <div className="text-nowrap ml-3">تعداد خرید:</div>
                    <div className="text-nowrap">{selectedRows?.length} عدد</div>
                  </div>
                </div>
                {orderInfo?.discount && <div className="md:col-4 col justify-content-between">
                  <div className="flex flex-nowrap gap-3">
                    <div className="text-nowrap ml-3">تخفیف اعمال شده:</div>
                    <div className="text-nowrap">{formatNumber(Number(orderInfo?.discount))} تومان</div>
                  </div>
                </div>}
                <div className="md:col-4 col justify-content-between">
                  <div className="flex flex-nowrap gap-3">
                    <div className="text-nowrap ml-3">مالیات:</div>
                    <div className="text-nowrap">{formatNumber(Number(orderInfo?.total) / 10)} تومان</div>
                  </div>
                </div>
                {orderInfo?.total && <div className="md:col-4 col justify-content-between">
                  <div className="flex flex-nowrap gap-3">
                    <div className="text-nowrap ml-3">جمع کل:</div>
                    <div className="text-nowrap">{formatNumber(Number(orderInfo?.total) + (Number(orderInfo?.total) / 10))} تومان</div>
                  </div>
                </div>}
              </div>
              {/*<div className='flex flex-wrap justify-content-between gx-4 gap-3 align-items-center'>*/}
              {/*  <p className="mr-2">تعداد فایل انتخابی: {selectedRows?.length} عدد </p>*/}
              {/*  {extraSelectedRows.length ?*/}
              {/*    <p className="mr-2">تعداد فایل جایگزین: {selectedRows?.length} عدد </p> : null}*/}
              {/*  {orderInfo?.discount ? <p*/}
              {/*    className="mr-2">{` تخفیف اعمال شده: ${formatMoneyToPersianUnit(Number(orderInfo?.discount), {returnZero: true})}`} </p> : null}*/}
              {/*  {orderInfo?.total ? <p*/}
              {/*    className="mr-2">{`هزینه‌ی کل: ${formatMoneyToPersianUnit(Number(orderInfo?.total) + (Number(orderInfo?.total) / 10), {returnZero: true})} تومان`}</p> : null}*/}
              {/*  {orderInfo?.total ? <p*/}
              {/*    className="mr-2">{`مالیات بر ارزش افزوده: ${formatMoneyToPersianUnit(Number(orderInfo?.total) / 10, {returnZero: true})} تومان`}</p> : null}*/}
              {/*  <p/>*/}
              {/*</div>*/}
            </div>
            <hr/>
            <h5>آیتم‌های انتخاب‌شده:</h5>
            <hr/>
            <div style={{overflowY: 'auto', maxHeight: '220px'}}>
              <DataTable value={selectedRows} stripedRows>
                <Column header="عنوان" body={titleColumnTemplate}></Column>
                <Column field="rooms" header="تعداد اتاق"></Column>
                <Column field="location_label" header="موقعیت"
                        body={(rowData) => getLocationLabel(rowData.location)}></Column>
                <Column field="total_price" header="قیمت" body={(rowData) => {
                  if (rowData.total_price) {
                    return formatNumber(rowData?.total_price) + ' تومان '
                  }
                  if (rowData.rent_pre_paid_amount) {
                    if (rowData.rent_price) {
                      return `رهن: ${formatNumber(rowData?.rent_pre_paid_amount)} و اجاره:${formatNumber(rowData?.rent_price)} تومان`
                    }
                    return formatNumber(rowData?.rent_pre_paid_amount) + ' تومان '
                  }
                }}></Column>
                <Column field="address" header="آدرس" body={(rowData) => truncateText(rowData?.address, 16)}></Column>
                <Column header="" body={actionsColumn}></Column>
              </DataTable>
            </div>
            <hr/>

            {extraSelectedRows.length ? <>
              <h5>آیتم‌های جایگزین:</h5>
              <hr/>
              <div style={{overflowY: 'auto', maxHeight: '220px'}}>
                <DataTable value={extraSelectedRows} stripedRows>
                  <Column field="title" header="عنوان"></Column>
                  <Column field="rooms" header="تعداد اتاق"></Column>
                  <Column field="location_label" header="موقعیت"
                          body={(rowData) => getLocationLabel(rowData.location)}></Column>
                  <Column field="total_price" header="قیمت" body={(rowData) => {
                    if (rowData.total_price) {
                      return formatNumber(rowData?.total_price) + ' تومان '
                    }
                    if (rowData.rent_pre_paid_amount) {
                      if (rowData.rent_price) {
                        return `رهن: ${formatNumber(rowData?.rent_pre_paid_amount)} و اجاره:${formatNumber(rowData?.rent_price)} تومان`
                      }
                      return formatNumber(rowData?.rent_pre_paid_amount) + ' تومان '
                    }
                  }}></Column>
                  <Column field="address" header="آدرس" body={(rowData) => truncateText(rowData?.address, 16)}></Column>
                </DataTable>
              </div>
              <hr/>

            </> : null
            }
            <div className="field flex col-12 md:col-12 justify-content-end mt-4 ">
              <Button raised type="submit" label="تکمیل خرید" className="bg-green-500 text-white border-0 mt-2 ml-2"
                      disabled={btnLoading} loading={btnLoading}/>
              <Button raised label="انصراف" type="button" className="bg-gray-300 text-color border-0 mt-2"
                      onClick={() => setShowModal(false)}/>
            </div>
          </form>
        </Dialog>
        <Dialog header="خرید با استعلام" visible={showInquiryModal} onHide={() => setShowInquiryModal(false)}
                className="lg:w-6 md:w-50">
          <hr/>
          <div>
            <h5>راهنمای خرید با استعلام</h5>
            <p className="mr-2"> به دلیل نیاز به استعلام و احتمال عدم فعال بودن آگهی انتخابی شما، نیاز است به تعداد
              انتخابی خود پکیج جایگزین انتخاب کنید.</p>
          </div>
          <hr/>
          <div className="field flex col-12 md:col-12 justify-content-end mt-4 ">
            <Button raised onClick={onChoseExtraClick} label="انتخاب موارد جایگزین"
                    className="bg-green-500 text-white border-0 mt-2 ml-2" disabled={btnLoading} loading={btnLoading}/>
            <Button raised label="انصراف" type="button" className="bg-gray-300 text-color border-0 mt-2"
                    onClick={() => setShowInquiryModal(false)}/>
          </div>
        </Dialog>
      </div>
      <ConfirmDialog
        visible={displayConfirmDialog}
        onHide={() => setDisplayConfirmDialog(false)}
        message="آیا مطمئن هستید که می‌خواهید این فایل را از لیست خرید حذف کنید؟"
        header="تایید حذف"
        icon="pi pi-exclamation-triangle ml-2 text-red-500"
        accept={removeFileFromBuyHandler}
        reject={cancelDeleteFromBuy}
        acceptLabel="تایید"
        rejectLabel="انصراف"
      />
      <MaintenanceModal visible={showMaintenanceModal} onHide={() => setShowMaintenanceModal(false)} />

      <div className="py-4 px-8 header_footer_background">
        <AppFooter/>
        <AppCopyRight/>
      </div>
    </>
  );
};

export default FilterResultPage
