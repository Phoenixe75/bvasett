'use client';
import React, { useEffect, useState } from 'react';
import { IPanel } from '../(models)/item-panel';
import { ProgressSpinner } from 'primereact/progressspinner';

interface IProps {
    data?: IPanel;
    loading: boolean;
}

const ItemPanel: React.FC<IProps> = ({ data, loading }) => {
    const [item, setItem] = useState<IPanel>();

    useEffect(() => {
        if (data) {
            setItem(data);
        }
    }, [data]);

    if (loading) return <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />;

    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">تعداد آگهی‌ها</span>
                            <div className="text-900 font-medium text-xl">{data?.total_ads}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-map-marker text-orange-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-500 ">{data?.active_ads} آگهی </span>
                    <span className="text-green-500 font-medium"> فعال</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">تعداد تراکنش‌ها</span>
                            <div className="text-900 font-medium text-xl">{data?.total_orders}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-shopping-cart text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{data?.pending_orders} </span>
                    <span className="text-500">در انتظار تایید</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">تعداد تیکت‌ها</span>
                            <div className="text-900 font-medium text-xl">{data?.total_tickets}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-ticket text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-500 font-medium">{data?.open_tickets}</span>
                    <span className="text-red-500"> پاسخ داده نشده </span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">تعداد سوالات</span>
                            <div className="text-900 font-medium text-xl">{data?.total_questions}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-comment text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-500 font-medium">{data?.open_questions} </span>
                    <span className="text-red-500"> پاسخ داده نشده </span>
                </div>
            </div>
        </div>
    );
};

export default ItemPanel;
