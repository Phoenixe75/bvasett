'use client';
import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { toast } from 'react-toastify';
import { ProgressSpinner } from 'primereact/progressspinner';
import { updateOrderItem } from '../(services)/payment.service';
import { IOrdersItemProps, OrderStatusEnum } from '../(models)/payment';
import { Dropdown } from 'primereact/dropdown';
import { getOrderStatus } from '../../ads/constant/converter';

interface EditOrderItemProps {
    visible: boolean;
    onHide: () => void;
    orderData: IOrdersItemProps | null;
    refreshData: () => void;
}

const EditOrderItem: React.FC<EditOrderItemProps> = ({ visible, onHide, orderData, refreshData }) => {
    const [status, setStatus] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (orderData) {
            setStatus(orderData.status || 0);
        }
    }, [orderData]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!orderData) {
            toast.error('داده‌های فرم معتبر نیستند.');
            return;
        }

        setLoading(true);
        try {
            await updateOrderItem(orderData.id!, { status });
            toast.success('وضعیت سفارش با موفقیت به‌روزرسانی شد!');
            refreshData();
            onHide();
        } catch (error) {
            toast.error('خطا در به‌روزرسانی وضعیت سفارش.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const statusOptions = Object.values(OrderStatusEnum)
        .filter((value) => typeof value === 'number')
        .map((value) => ({
            label: getOrderStatus(value as OrderStatusEnum),
            value: value
        }));

    return (
        <Dialog header="ویرایش وضعیت سفارش" visible={visible} onHide={onHide}>
            {loading ? (
                <div className="flex justify-content-center align-items-center">
                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="grid p-fluid mt-4">
                    <div className="field col-12">
                        <label htmlFor="status">وضعیت</label>
                        <Dropdown id="status" value={status} options={statusOptions} onChange={(e) => setStatus(e.value)} placeholder="انتخاب وضعیت" className="w-full" />
                    </div>

                    <div className="field flex col-12 mt-3">
                        <Button raised type="submit" label="بروز‌رسانی" className="bg-green-500 text-white border-0 ml-2" />
                        <Button raised type="button" label="بازگشت" className="bg-gray-300 text-color border-0" onClick={onHide} />
                    </div>
                </form>
            )}
        </Dialog>
    );
};

export default EditOrderItem;
