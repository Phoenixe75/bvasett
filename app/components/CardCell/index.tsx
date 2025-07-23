'use client';
import React, { useEffect, useState } from 'react';
import { getAllAdsMain } from '@/app/dashboard/admin/ads/(services)/ads.service';
import { ProgressSpinner } from 'primereact/progressspinner';
import { IAdsBase, PurposeEnum } from '@/app/dashboard/admin/ads/(models)/ads';
import { getLocationLabel, getPurposeLabelwithColor, getTypeLabel } from '@/app/dashboard/admin/ads/constant/converter';
import ItemCard from '../ItemCards/components/ItemCard';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import Image from "next/image";
import { images } from '@/app/(main)/(pages)/filterResult/(contants)/images';
import PropertyDialog from '../PropertyDialog';

export default function CardCell() {
    const [ads, setAds] = useState<IAdsBase[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [page, setPage] = useState(1)
    const [next, setNext] = useState(false);
    const [count, setCount] = useState<null | number>(null)
    const [selectedRowData, setSelectedRowData] = useState<any | null>(null);
    const [displayDialog, setDisplayDialog] = useState<boolean>(false);
    const fetchData = async () => {
        try {
            setButtonLoading(true);
            const response = await getAllAdsMain(page);
            setAds(pre => [...pre, ...response.results]);
            setCount(response.count)
            setNext(!!response.next);
            setPage(pre => pre + 1)
        } catch (error) {
            console.error('Error retrieving ads:', error);
        } finally {
            setLoading(false);
            setButtonLoading(false);
        }
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
        fetchData();
    }, []);

    if (isLoading || ads.length === 0) {
        return <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />;
    }

    // const getPurposeLabel = (purpose: PurposeEnum | null): { label: string; className: string; iconClass: string } => {
    //     switch (purpose) {
    //         case PurposeEnum.Buy:
    //             return { label: 'فروش', className: 'bg-yellow-200', iconClass: 'text-yellow-700' };
    //         case PurposeEnum.Rent:
    //             return { label: 'اجاره', className: 'bg-cyan-200', iconClass: 'text-cyan-700' };
    //         case PurposeEnum.Barter:
    //             return { label: 'معاوضه', className: 'bg-green-200', iconClass: 'text-green-700' };
    //         case PurposeEnum.MORTGAGE:
    //             return { label: 'رهن کامل', className: 'bg-green-200', iconClass: 'text-green-700' };
    //         case PurposeEnum.PARTNERSHIP:
    //             return { label: 'مشارکت', className: 'bg-green-200', iconClass: 'text-green-700' };
    //         default:
    //             return { label: 'نامشخص', className: '', iconClass: '' };
    //     }
    // };

    return (
        <>
        <div className='flex flex-row-reverse w-full'>
            <h5>{`تعداد: ${count}`}</h5>
        </div>
        <div className="col-12 p-0 lg:pb-5 mt-4 lg:mt-0 surface-card grid">
            {ads?.map((item,idx) => {
                return <div key={idx} className="field col-12 md:col-3"><ItemCard showSelectable={false} onShowDetails={showDetails} data={item} key={item.id} isSelected={false} onClick={()=>{}} selectable={false}/></div>
            })}
             {next ? (
                    <div className="w-full flex justify-content-center align-items-center">
                        <div>
                            <Button loading={buttonLoading} onClick={fetchData}>
                                نمایش بیشتر
                            </Button>
                        </div>
                    </div>
                ) : null}
        </div>
        <PropertyDialog onHide={hideDialog} visible={displayDialog} selectedRowData={selectedRowData}/>
        </>
    );
}
// const statusInfo = getPurposeLabel(item.purpose);
// return (
//     <div key={item.id} className="col-12 md:col-4 lg:col-4 p-3">
//         {/* style={{ backgroundColor: '#fed978' }} */}
//         <div className=" property-card-wrapper">
//             <div className={'card_info'}>
//                 <h2 className={item.title}>
//                     {getTypeLabel(item.type)} {Math.round(+item.area)} متری
//                 </h2>
//                 <span className="description">{item.title}</span>
//                 <span
//                     className={`text-600 ${statusInfo.className} p-1 text-xs`}
//                     style={{
//                         borderRadius: '4px',
//                         width:'fit-content',
//                         marginTop:'32px'
//                     }}
//                 >
//                     {statusInfo.label}
//                 </span>
//             </div>
//             <div className="card_thumbnail">
//                 <i className="pi pi-home" style={{ fontSize: '2.5rem' }}></i>
//             </div>
//         </div>
//     </div>
// );
