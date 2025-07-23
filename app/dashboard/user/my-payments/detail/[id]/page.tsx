'use client'
import React, { useEffect, useState } from 'react';
import { getOrder } from '../../(services)/myPayments.service';
import { OrderItem } from '../../(models)/myPayments.models';
import { toast } from 'react-toastify';
import LoadingPage from '@/app/components/LoadingPage';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ItemCard from '@/app/components/ItemCards/components/ItemCard';
import styles from "./detail.module.scss"
import PropertyDialog from '@/app/components/PropertyDialog';
import { OrderStatusConverter, PaymentStatusConverter } from '@/app/dashboard/admin/list-payments/(constants)';
const MyCreatePage = ({params}:{params:{id:number}}) => {
    const [orderData, setOrderData] = useState<OrderItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRowData, setSelectedRowData] = useState<any | null>(null);
    const [displayDialog, setDisplayDialog] = useState<boolean>(false);
    const fetcher = async () => {
        setIsLoading(true);
        try {
            const res = await getOrder(params.id)
            setOrderData(res)
        } catch (error) {
            toast.error('خطایی در دریافت اطلاعات به وجود آمده است.')
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(()=> {
        fetcher()
    },[])
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
    return <LoadingPage isLoading={isLoading}>
        <div className="card p-fluid">
                <h5>{`جزئیات سفارش ${orderData?.id}`}</h5>
                <hr />
                <DataTable  value={orderData ? [orderData] : []} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="id" header="کد خرید" style={{ width: '25%' }}/>
                    <Column field="payment_status" header="وضعیت خرید" style={{ width: '25%' }} body={(rowData) => {
                        return PaymentStatusConverter(rowData.payment_status)
                    }}/>
                    <Column field="order_status" header="وضعیت سفارش" style={{ width: '25%' }} body={(rowData) => {
                        return OrderStatusConverter(rowData.order_status)
                    }}/>
                </DataTable>
                <hr />
                <h5>{'فایل های خریداری شده'}</h5>
                <hr />
                <div className={styles.wrapper}>
                    {orderData?.items.map((item)=><ItemCard key={item.id} data={item.ad} isSelected={false}
                        onShowDetails={showDetails} selectable={false} showSelectable={false}/>)}
                </div>
                <PropertyDialog visible={displayDialog} onHide={hideDialog} selectedRowData={selectedRowData} />

            </div>
    </LoadingPage>;
};

export default MyCreatePage;
