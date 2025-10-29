'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { filterAds } from '@/app/components/FilterItem/(services)/filter.service';
import PackageItem from '@/app/components/CardPackage';
import { formatNumber, getLocationLabel, truncateText } from '@/app/dashboard/admin/ads/constant/converter';
import { Paginator } from 'primereact/paginator';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { toast } from 'react-toastify';
import Joyride from 'react-joyride';
import SuggestItem from '@/app/components/SuggestItem';
import { orderBuy, paymentService } from '../(services)/orderBuy.service';
import { IOrderBuyRequest, IPaymentStatus } from '../(models)/orderBuy';
import AppHeader from '@/layout/AppHeader';
import AppFooter from '@/layout/AppFooter';
import AppCopyRight from '@/layout/AppCopyRight';
import Image from 'next/image';
import ItemCards from '@/app/components/ItemCards';
import { useUserContext } from '@/layout/context/usercontext';
import { TRANSLATIONS } from '../translation';
import { images } from '../(contants)/images';
import PropertyDialog from '@/app/components/PropertyDialog';
import LoginModal from '@/app/components/LoginModal';

interface IPackage {
    id: number;
    name: string;
    count: number;
    extra: number;
    price: string;
}

const LegacyFilterResultPage: React.FC = () => {
    const [formData, setFormData] = useState<any[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<IPackage | null>(null);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [btnLoading, setBtnLoading] = useState<boolean>(false);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(25);
    const [selectedRowData, setSelectedRowData] = useState<any | null>(null);
    const [displayDialog, setDisplayDialog] = useState<boolean>(false);
    const [showTour, setShowTour] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const [openLoginForm, setOpenLoginForm] = useState(false);
    const { user } = useUserContext();
    const fetchData = async (page: number) => {
        try {
            const results = searchParams.get('results');
            if (results) {
                const decodedResults = JSON.parse(decodeURIComponent(results));
                const data = await filterAds(decodedResults, page);
                setFormData(data.results);
                setCount(data.count);
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const hasSeenTour = localStorage.getItem('hasSeenTour');
        if (!hasSeenTour) {
            setShowTour(true);
            localStorage.setItem('hasSeenTour', 'true'); // Set a flag to not show tour again
        }
    }, []);
    useEffect(()=>{
        const cardEl = document.getElementsByClassName('card');
        cardEl[0].scroll()
    },[loading])

    useEffect(() => {
        fetchData(page + 1);
    }, [searchParams, page]);

    const onPageChange = (event: any) => {
        setPage(event.page);
        setRows(event.rows);
    };

    const back = (): void => {
        router.push('/');
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

    useEffect(() => {
        setSelectedRows([]);
    }, [selectedPackage]);
    const maxCount = selectedPackage ? selectedPackage.extra + selectedPackage.count : 0;
    const handleSelectionChange = (e: any) => {
        if (e.length <= maxCount) {
            setSelectedRows(e); // به سادگی مقدار e.value را تنظیم کنید
        }
    };

    const handleBuyClick = () => {
        if (selectedRows.length > 0 && selectedPackage) {
            setShowModal(true);
        } else {
            alert('لطفاً یک پکیج انتخاب کنید و حداقل یک مورد را از جدول انتخاب نمایید.');
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
        setOpenLoginForm(false)
    }
    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const maxAllowed = selectedPackage ? selectedPackage.extra + selectedPackage.count : 0;
        if (!user || !user.id) {
            toast.error(TRANSLATIONS.notLoginError);
            setOpenLoginForm(true);
            return; 
        }
        if (selectedRows.length > maxAllowed) {
            toast.error('تعداد آیتم‌های انتخابی بیشتر از حد مجاز پکیج است.');
            return;
        }

        setBtnLoading(true);
        try {
            const formData: IOrderBuyRequest = {
                ads: selectedRows.map((row) => row.id),
                package: selectedPackage?.id || 0
            };

            const res = await orderBuy(formData);
            if (selectedPackage?.price === "0") {
                toast.success('خرید شما با موفقیت انجام شد.')
                setShowModal(false);
                return;
            }
            const guid = res?.order_guid;
            const resData: IPaymentStatus = await paymentService(guid);
            if (resData?.status === 307) {
                if (resData.redirect_url) {
                    // اطمینان از اینکه redirect_url مقدار null نیست
                    toast.success('در حال انتقال به درگاه بانکی');
                    router.push(resData.redirect_url);
                } else {
                    toast.error('آدرس انتقال معتبر نیست.');
                }
            } else if (resData?.status === 503) {
                toast.error('خرید با خطا روبرو شد.');
            } else {
                toast.error('خرید با خطا روبرو شد.');
            }
        } catch (error) {
            console.error('Error during purchase:', error);
            toast.error('خرید با خطا روبرو شد.');
        } finally {
            setBtnLoading(false);
        }
    };
    if (loading) return <ProgressSpinner style={{ width: '50px', height: '50px' }} />;
    return (
        <>
            <AppHeader />
            <div className="card p-fluid">
                <div className="packagess">
                    <PackageItem selectedPackage={selectedPackage} setSelectedPackage={setSelectedPackage} tourTarget=".packagess" />
                </div>
                <hr />
                <h5>لیست آگهی‌های یافت شده</h5>
                <hr />
                {/* <div className="filess">
                    {selectedPackage ? (
                        <DataTable
                            selectionMode="multiple"
                            selection={selectedRows}
                            onSelectionChange={handleSelectionChange}
                            value={formData}
                            stripedRows
                            paginator={false}
                            tableStyle={{ minWidth: '50rem' }}
                            className="m-2 border-1 border-round border-gray-200"
                        >
                            <Column selectionMode="multiple"></Column>
                            <Column field="title" header="عنوان"></Column>
                            <Column field="rooms" header="تعداد اتاق"></Column>
                            <Column field="location_label" header="موقعیت ملک" body={(rowData) => getLocationLabel(rowData.location)}></Column>
                            <Column field="purpose_label" header="نوع معامله" body={(rowData) => getPurposeLabel(rowData.purpose)}></Column>
                            <Column field="total_price" header="قیمت" body={(rowData) => formatNumber(rowData?.total_price) + ' تومان '}></Column>
                            <Column field="area" header="متراژ (متر)" body={(rowData) => rowData.area.split('.')[0]}></Column>

                            <Column field="district" header="منطقه"></Column>
                            <Column header="مشاهده" body={(rowData) => <i className="pi pi-eye text-yellow-500" onClick={(e) => showDetails(rowData, e)}></i>}></Column>
                        </DataTable>
                    ) : (
                        <DataTable value={formData} stripedRows paginator={false} tableStyle={{ minWidth: '50rem' }} className="m-2 border-1 border-round border-gray-200">
                            <Column field="title" header="عنوان"></Column>
                            <Column field="rooms" header="تعداد اتاق"></Column>
                            <Column field="location_label" header="موقعیت ملک" body={(rowData) => getLocationLabel(rowData.location)}></Column>
                            <Column field="purpose_label" header="نوع معامله" body={(rowData) => getPurposeLabel(rowData.purpose)}></Column>
                            <Column field="total_price" header="قیمت " body={(rowData) => formatNumber(rowData?.total_price) + ' تومان '}></Column>
                            <Column field="area" header="متراژ (متر)" body={(rowData) => rowData.area.split('.')[0]}></Column>
                            <Column field="district" header="منطقه"></Column>
                            <Column header="مشاهده" body={(rowData) => <i className="pi pi-eye text-yellow-500" onClick={(e) => showDetails(rowData, e)}></i>}></Column>
                        </DataTable>
                    )}
                </div> */}
                <div className='filess'>
                    <ItemCards data={formData} selectable={!!selectedPackage} onSelectionChange={handleSelectionChange}  maxCount={maxCount} onShowDetails={showDetails} />
                </div>
                <Paginator dir="ltr" first={page * rows} rows={rows} totalRecords={count} onPageChange={onPageChange} />

                <PropertyDialog visible={displayDialog} onHide={hideDialog} selectedRowData={selectedRowData}/>
                <hr />
                <h5>آگهی‌های پیشنهادی</h5>
                <hr />
                <SuggestItem />

                <div className="field flex col-12 md:col-2">
                    <Button raised type="submit" label="خرید" className="bg-green-500 text-white border-0 mt-2 ml-2 buys" onClick={handleBuyClick} disabled={!selectedPackage} loading={loading} />
                    <Button raised label="بازگشت" type="button" className="bg-gray-300 text-color border-0 mt-2" onClick={back} />
                </div>

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
                <Dialog header="جزئیات خرید" visible={showModal} onHide={() => setShowModal(false)} className="lg:w-6 md:w-50">
                    <form onSubmit={submitForm}>
                        <hr />
                        <div className="flex">
                            <h5>پکیج انتخاب‌شده:</h5>
                            <p className="mr-2"> {selectedPackage?.count ? selectedPackage.count * 2 : 'نامشخص'} عددی </p>
                        </div>
                        <hr />
                        <h5>آیتم‌های انتخاب‌شده:</h5>
                        <hr />
                        <DataTable value={selectedRows} stripedRows>
                            <Column field="title" header="عنوان"></Column>
                            <Column field="rooms" header="تعداد اتاق"></Column>
                            <Column field="location_label" header="موقعیت" body={(rowData) => getLocationLabel(rowData.location)}></Column>
                            <Column field="total_price" header="قیمت" body={(rowData) => formatNumber(rowData?.total_price) + ' تومان '}></Column>
                            <Column field="address" header="آدرس" body={(rowData) => truncateText(rowData?.address, 16)}></Column>
                        </DataTable>
                        <div className="field flex col-12 md:col-12 justify-content-end mt-4 ">
                            <Button raised  type="submit" label="تکمیل خرید" className="bg-green-500 text-white border-0 mt-2 ml-2" disabled={btnLoading} loading={btnLoading} />
                            <Button raised label="انصراف" type="button" className="bg-gray-300 text-color border-0 mt-2" onClick={() => setShowModal(false)} />
                        </div>
                    </form>
                </Dialog>
            </div>

            <div className="py-4 px-8 header_footer_background">
                <AppFooter />
                <AppCopyRight />
            </div>
        </>
    );
};

export default LegacyFilterResultPage;
