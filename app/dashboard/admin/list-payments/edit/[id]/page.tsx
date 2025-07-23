'use client';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { PageParams } from '@/types/layout';
import { IOrders, IOrdersItemProps, OrderStatusEnum } from '../../(models)/payment';
import { getOrders, updateOrder } from '../../(services)/payment.service';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnBodyOptions } from 'primereact/column';
import { getOrderStatus, getPurposeLabel, getTypeLabel, truncateText } from '../../../ads/constant/converter';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { Button } from 'primereact/button';
import EditOrderItem from '../EditOrderItem';
import { orderStatus as OrderStatusMapping, orderStatusOptions } from './(constants)';
import { Dropdown } from 'primereact/dropdown';
import { produce } from 'immer';
import LoadingPage from '@/app/components/LoadingPage';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { useRouter } from 'next/navigation';
type Status = (typeof OrderStatusMapping)[keyof typeof OrderStatusMapping]
const EditOrderPage: FC<PageParams> = ({ params }: any) => {
    const [orders, setOrders] = useState<IOrders | null>(null);
    const [editOrderItem, setEditOrderItem] = useState<boolean>(false);
    const [editOrderData, setEditOrderData] = useState<IOrdersItemProps | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<IOrdersItemProps[]>([]);
    const [orderStatus, setOrderStatus] = useState<Status>(0);
    const [loading, setLoading] = useState(true);
    const [btnLoading, setButtonLoading] = useState(false);
    const [displayConfirmDialog, setDisplayConfirmDialog]= useState(false);
    const previousOrderStatus = useRef();
    const menu = useRef<Menu[]>([]);
    const router = useRouter();
    const fetchOrders = async () => {
        try {
            const data = await getOrders(+params.id);
            setOrders(data);
            const newSelectedProducts = data.items.filter((item:any) => item.status === OrderStatusEnum.complete)
            setSelectedProducts(newSelectedProducts)
            setOrderStatus(data.order_status);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('خطا در واکشی سفارشات');
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [params.id]);

    const getItems = (rowData: IOrdersItemProps): MenuItem[] => {
        return [
            {
                label: 'ویرایش',
                icon: 'pi pi-pencil text-primary ml-2',
                command: () => handleShowEdit(rowData)
            }
        ];
    };

    const handleShowEdit = (rowData:IOrdersItemProps) => {
        setEditOrderData(rowData);
        setEditOrderItem(true);
    };

    const detailsBodyTemplate = (rowData: IOrdersItemProps, options: ColumnBodyOptions) => {
        return (
            <React.Fragment>
                <Menu model={getItems(rowData)} popup ref={(el: Menu) => (menu.current[options.rowIndex] = el)} />
                <i className="pi pi-bars text-primary cursor-pointer" onClick={(event) => menu.current[options.rowIndex]?.toggle(event)} aria-label="Menu" />
            </React.Fragment>
        );
    };

    const refreshData = async () => {
        await fetchOrders();
    };
    const editOrderStatus = async (status: Status) => {
        setButtonLoading(true);
        try {
            const res = await updateOrder(+params.id, { order_status: status });
            toast.success(`وضعیت سفارش با موفقیت تغییر کرد`)
            
            if (res?.data) {
                return true
            }
        } catch (error) {
            toast.error('تغییر وضعیت با مشکل مواجه شد')
            return false;
        } finally {
            setButtonLoading(false);
        }
    };
    const handleOrderStatusChange = (e: any) => {
        const selectedOrderStatus = e.value ? e.value.code : null;
        setOrderStatus(selectedOrderStatus);
    };
    const tranformedTableData= useMemo(()=> {
        const primary:IOrdersItemProps[] = [];
        const extra:IOrdersItemProps[] = [];
        if(orders) {
            orders?.items?.forEach(item=> {
                if(item.primary_choice) {
                    primary.push(item)
                }else {
                    extra.push(item)
                }
            })
        }
        return {primary, extra}
    },[orders])
    const onComplete = async () => {
        const finishedSuccessFully = await editOrderStatus(OrderStatusMapping.completed);
        if(finishedSuccessFully) {
            setTimeout(()=> {
                router.back()
            }, 1000)
        }
    }
    return (
        <LoadingPage isLoading={loading}>
        <div className="grid detailsData">
            <div className="col-12">
                <div className="text-left m-2">
                    <Link href="/dashboard/admin/list-payments">
                        <Button raised label="بازگشت" className="bg-gray-300 text-color border-0" />
                    </Link>
                </div>
                <div className="card p-fluid">
                    <div>
                        <div className='w-full flex justify-content-between align-items-center mb-8'>
                            <h4>{`ویرایش سفارش ${params.id}`}</h4>
                            <div className='flex align-items-center gap-2'>
                                <Button loading={btnLoading} style={{minWidth:"190px"}} severity='success' disabled={selectedProducts.length !== tranformedTableData.primary.length} onClick={onComplete}>{`تایید سفارش (${tranformedTableData.primary.length}) عدد`}</Button>
                                <Button loading={btnLoading} severity='danger' onClick={()=>{
                                    setDisplayConfirmDialog(true);
                                }}>لغو سفارش</Button>
                            </div>
                        </div>
                        <div className="field col-12 md:col-4 mt-2 flex gap-4">
                            <span className="p-float-label">
                                <Dropdown
                                    type="text"
                                    name="purpose"
                                    id="purpose"
                                    value={orderStatusOptions.find((option) => option.code === orderStatus) || null}
                                    onChange={handleOrderStatusChange}
                                    options={orderStatusOptions}
                                    optionLabel="name"
                                    placeholder="انتخاب کنید"
                                    className="w-full"
                                    required
                                />
                                <label htmlFor="purpose">تغییر وضعیت سفارش</label>
                            </span>
                            <div style={{maxWidth:210}}>
                                <Button loading={btnLoading} onClick={()=>{
                                    editOrderStatus(orderStatus)
                                }}>ثبت تغییر وضعیت سفارش</Button>
                            </div>
                        </div>
                    </div>
                    <h5>لیست فایل‌های سفارش‌</h5>
                    <hr />
                        <DataTable 
                        selectionMode={'checkbox'} 
                        selection={selectedProducts}  
                        isDataSelectable={()=>false} 
                        dataKey="id" 
                        value={tranformedTableData.primary || []}
                        >
                            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                            <Column field="ad.slug" header="شناسه" />
                            <Column field="status" header="وضعیت" body={(rowData) => getOrderStatus(rowData.status)} />
                            <Column field="purpose" header="نوع معامله" body={(rowData) => getPurposeLabel(rowData.ad?.purpose)} />
                            <Column field="ad.type_label" header="نوع ملک" body={(rowData) => getTypeLabel(rowData.ad?.type)} />
                            <Column field="ad.owner_name" header="مالک" />
                            <Column field="ad.owner_phone" header="شماره تماس مالک" />
                            <Column field="ad.address" header="آدرس" body={(rowData) => truncateText(rowData.ad?.address, 22)} />
                            <Column header="" body={detailsBodyTemplate}></Column>
                        </DataTable>
                    {tranformedTableData.extra.length > 0?<><hr />
                        <h5>لیست فایل‌های جایگزین</h5>
                    <hr />
                        <DataTable 
                        selectionMode={'checkbox'} 
                        selection={selectedProducts}  
                        isDataSelectable={()=>false} 
                        dataKey="id" 
                        value={tranformedTableData.extra || []}
                        >
                            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                            <Column field="ad.slug" header="شناسه" />
                            <Column field="status" header="وضعیت" body={(rowData) => getOrderStatus(rowData.status)} />
                            <Column field="purpose" header="نوع معامله" body={(rowData) => getPurposeLabel(rowData.ad?.purpose)} />
                            <Column field="ad.type_label" header="نوع ملک" body={(rowData) => getTypeLabel(rowData.ad?.type)} />
                            <Column field="ad.owner_name" header="مالک" />
                            <Column field="ad.owner_phone" header="شماره تماس مالک" />
                            <Column field="ad.address" header="آدرس" body={(rowData) => truncateText(rowData.ad?.address, 22)} />
                            <Column header="" body={detailsBodyTemplate}></Column>
                        </DataTable>
                        </>: null}
                </div>

                <EditOrderItem visible={editOrderItem} onHide={() => setEditOrderItem(false)} orderData={editOrderData} refreshData={refreshData} />
            </div>
        </div>
        <ConfirmDialog
                visible={displayConfirmDialog}
                onHide={() => setDisplayConfirmDialog(false)}
                message="آیا مطمئن هستید که می‌خواهید این سفارش را لغو کنید؟"
                header="تایید لغو سفارش"
                icon="pi pi-exclamation-triangle ml-2 text-red-500"
                accept={()=>{
                    editOrderStatus(OrderStatusMapping.failed)
                }}
                reject={() => setDisplayConfirmDialog(false)}
                acceptLabel="تایید"
                rejectLabel="انصراف"
            />
        </LoadingPage>
    );
};

export default EditOrderPage;
