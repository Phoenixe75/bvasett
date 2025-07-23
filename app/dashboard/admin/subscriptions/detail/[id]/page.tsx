'use client';
import React, { useEffect, useState } from 'react';
import { getSubscription } from '../../(services)/mySubscriptions.service';
import { OrderItem } from '../../(models)/myPayments.models';
import { toast } from 'react-toastify';
import LoadingPage from '@/app/components/LoadingPage';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ItemCard from '@/app/components/ItemCards/components/ItemCard';
import styles from './detail.module.scss';
import PropertyDialog from '@/app/components/PropertyDialog';
import { OrderStatusConverter, PaymentStatusConverter } from '@/app/dashboard/admin/list-payments/(constants)';
import { Accordion, AccordionTab } from 'primereact/accordion';
import FilterItem from '@/app/components/FilterItemInSubscription';
import CardCell from '@/app/components/CardCellInSubscription';
import { MySubcriptionsProvider } from '../../(context)/MySubscriptionContext';
const MyCreatePage = ({ params }: { params: { id: number } }) => {
    const [orderData, setOrderData] = useState<OrderItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRowData, setSelectedRowData] = useState<any | null>(null);
    const [displayDialog, setDisplayDialog] = useState<boolean>(false);
    const fetcher = async () => {
        setIsLoading(true);
        try {
            const res = await getSubscription(params.id);
            setOrderData(res);
        } catch (error) {
            toast.error('خطایی در دریافت اطلاعات به وجود آمده است.');
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetcher();
    }, []);
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
    return (
        <LoadingPage isLoading={isLoading}>
            <MySubcriptionsProvider value={{neighbourhoods: orderData?.neighborhoods}}>
                <div className="card p-fluid">
                    <h5>{`جزئیات سفارش ${orderData?.id}`}</h5>
                    <hr />
                    <DataTable value={orderData ? [orderData] : []} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="id" header="کد خرید" style={{ width: '25%' }} />
                        <Column
                            field="payment_status"
                            header="وضعیت خرید"
                            style={{ width: '25%' }}
                            body={(rowData) => {
                                return PaymentStatusConverter(Number(rowData.payment_status));
                            }}
                        />
                    </DataTable>
                    <hr />
                    <h5>{'لیست آگهی‌ها'}</h5>
                    <hr />
                    {/* <div className={styles.wrapper}> */}
                    <div id="filess" className="home_property_wallet">
                        <div style={{ width: '280px' }} id="FilterItem" className="py-4 mx-0 mobile_filter_wrapper search">
                            <div className="text-center">
                                <h2 className="text-900 font-light mb-2 font-gandom ">جستجوی ملک</h2>
                            </div>
                            <div className="pt-0 md:pt-6">
                                <Accordion activeIndex={0}>
                                    <AccordionTab header="فیلترهای جستجو">
                                        <FilterItem />
                                    </AccordionTab>
                                </Accordion>
                            </div>
                        </div>

                        <div id="CardCell" className="py-4 pr-4 mx-0 flex-1 property_home_cards ads_sample">
                            <div className="grid justify-content-center">
                                <div className="col-12 text-center mb-4">
                                    <h2 className="text-900 font-normal mb-2">آخرین ملک های ثبت شده</h2>
                                </div>
                                <CardCell id={params.id} />
                            </div>
                        </div>
                    </div>
                    {/* </div> */}
                    <PropertyDialog visible={displayDialog} onHide={hideDialog} selectedRowData={selectedRowData} />
                </div>
            </MySubcriptionsProvider>
        </LoadingPage>
    );
};

export default MyCreatePage;
