'use client';
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './style.scss';
import { Paginator } from 'primereact/paginator';
import { getSubscriptionsList } from './(services)/mySubscriptions.service';
import { toast } from 'react-toastify';
import LoadingPage from '@/app/components/LoadingPage';
import { OrderItem } from './(models)/myPayments.models';
import { Tag } from "primereact/tag"
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { OrderStatusConverter, PaymentStatusConverter } from '../../admin/list-payments/(constants)';
import moment from 'jalali-moment';


export default function PaginatorBasicDemo() {
    const [pageData, setPageData] = useState({
        page:1,
        count: 0,
        data: [] as OrderItem[],
        rows:10,
        loading: true
    });
    const {count,data,page,rows, loading} = pageData;
    const router = useRouter()
    const onDataChange = (data:Partial<typeof pageData>) => {
        setPageData(pre=>({...pre,...data}))
    }
    const fetcher = async (pageNum = page) => {
        onDataChange({loading:true})
        try {
            const res = await getSubscriptionsList(pageNum)
            onDataChange({data:res.results, count: res.count})
        } catch (error) {
            toast.error('خطایی در دریافت اطلاعات به وجود آمده است')
        } finally {
            onDataChange({loading: false})
        }
    }
    useEffect(()=> {
        fetcher()
    },[page])
    const onPageChange = (event: any) => {
        onDataChange({
            page: event.page,
            rows: event.rows
        })
    };
    return (
        <LoadingPage isLoading={loading}>
            <div className="card p-fluid">
                <h5>لیست اشتراک‌ها</h5>
                <hr />
                <DataTable onPage={onPageChange} value={data} paginator rows={10}  tableStyle={{ minWidth: '50rem' }}>
                    <Column field="id" header="کد خرید" style={{ width: '8%' }}/>
                    <Column field="payment_status" header="وضعیت خرید" style={{ width: '25%' }} body={(rowData) => {
                        return PaymentStatusConverter(Number(rowData.payment_status))
                    }}/>
                    <Column field="order_status" header="تاریخ شروع" style={{ width: '25%' }} body={(rowData) => {
                        return moment(rowData.start_date).locale('fa').format('YYYY/MM/DD')
                    }}/>
                     <Column field="order_status" header="تاریخ پایان" style={{ width: '25%' }} body={(rowData) => {
                        return  moment(rowData.end_date).locale('fa').format('YYYY/MM/DD')
                    }}/>
                    <Column field="" header="" style={{ width: '35%' }} body={(rowData) => {
                        if(Number(rowData.payment_status) === 1 && rowData.id){
                            return <div style={{maxWidth: 130}}><Button raised onClick={()=>{
                                router.push(`/dashboard/user/my-subscriptions/detail/${rowData.id}`)
                            }} > جزئیات اشتراک</Button>
                            </div>
                        }
                    }}/>
                </DataTable>

            </div>
        </LoadingPage>
    );
}
