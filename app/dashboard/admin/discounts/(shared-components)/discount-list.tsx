'use client';
import React, { useRef, useState } from 'react';
import { DiscountListProps, Discount } from '../(models)/discounts';
import { Column, ColumnBodyOptions } from 'primereact/column';
import { Menu } from 'primereact/menu';
import { toast } from 'react-toastify';
import { MenuItem } from 'primereact/menuitem';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { onDeleteDiscount } from '../(services)/packages.service';
import EditDiscount from './EditDiscount';
import DetailDiscount from './DetailDiscount';
import CreateDiscount from './CreateDiscount';
import { getPurposeLabel } from '../../ads/constant/converter';

const PackagesList: React.FC<DiscountListProps> = ({ data, loading, totalCount, currentPage, onPageChange, refreshData }) => {
    const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
    const [displayConfirmDialog, setDisplayConfirmDialog] = useState<boolean>(false);
    const [detailsPackage, setDetailsPackage] = useState<boolean>(false);
    const [detailsPackageData, setDetailsPackageData] = useState<Discount | null>(null);
    const [editPackage, setEditPackage] = useState<boolean>(false);
    const [editPackageData, setEditPackageData] = useState<Discount | null>(null);
    const [createPackage, setCreatePackage] = useState<boolean>(false);
    const menu = useRef<Menu[]>([]);

    const getItems = (rowData: Discount): MenuItem[] => {
        return [
            {
                label: 'مشاهده',
                icon: 'pi pi-eye text-yellow-500 ml-2',
                command: () => handleShowDetail(rowData?.id)
            },
            {
                label: 'ویرایش',
                icon: 'pi pi-pencil text-primary ml-2',
                command: () => handleShowEdit(rowData?.id)
            },
            {
                label: 'حذف',
                icon: 'pi pi-trash text-red-500 ml-2',
                command: () => {
                    setSelectedPackageId(rowData.id!);
                    setDisplayConfirmDialog(true);
                }
            }
        ];
    };

    const confirmDelete = async () => {
        if (selectedPackageId != null) {
            try {
                await onDeleteDiscount(selectedPackageId);
                toast.success('تخفیف حذف شد');
                refreshData();
            } catch (error) {
                console.error('Error deleting Package:', error);
                toast.error('حذف تخفیف با خطا مواجه شد');
            } finally {
                setDisplayConfirmDialog(false);
                setSelectedPackageId(null);
            }
        } else {
            toast.error('شناسایی تخفیف امکان‌پذیر نیست. لطفاً دوباره امتحان کنید.');
        }
    };

    const cancelDelete = () => {
        setDisplayConfirmDialog(false);
    };

    const detailsBodyTemplate = (rowData: Discount, options: ColumnBodyOptions) => {
        return (
            <React.Fragment>
                <Menu model={getItems(rowData)} popup ref={(el: Menu) => (menu.current[options.rowIndex] = el)} />
                <i className="pi pi-bars text-primary cursor-pointer" onClick={(event) => menu.current[options.rowIndex].toggle(event)} aria-label="Menu" />
            </React.Fragment>
        );
    };

    const handlePageChange = (event: any) => {
        onPageChange(event.page + 1);
    };

    const handleShowCreate = () => {
        setCreatePackage(true);
    };

    const handleShowDetail = (id: any) => {
        const packageData: any = data.find((pkg) => pkg.id === id);
        setDetailsPackageData(packageData);
        setDetailsPackage(true);
    };

    const handleShowEdit = (id: any) => {
        const packageData: Discount | undefined = data.find((pkg) => pkg.id === id);
        if (packageData) {
            setEditPackageData(packageData);
            setEditPackage(true);
        } else {
            toast.error('تخفیف مورد نظر یافت نشد.');
        }
    };
    return (
        <div className="grid detailsData ">
            <div className="col-12">
                <div className="text-left m-2">
                    <Button raised label="ثبت تخفیف جدید" className="bg-blue-700 text-white" onClick={handleShowCreate} />
                </div>
                <div className="card p-fluid">
                    <h5>لیست تخفیفات</h5>
                    <hr />
                    {loading && <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />}
                    <DataTable value={data} stripedRows paginator rows={10} totalRecords={totalCount} first={(currentPage - 1) * 10} onPage={handlePageChange} tableStyle={{ minWidth: '50rem' }} emptyMessage="تخفیفی موجود نیست">
                        <Column key="row" field="row" header="ردیف" style={{ width: '5%', textAlign: 'center' }} body={(data, options) => options.rowIndex + 1}></Column>
                        <Column field="minimum_selected_ads" header="حداقل تعداد آگهی انتخابی برای فعال سازی" ></Column>
                        <Column field="percentage" header="درصد تخفیف"></Column>
                        <Column field="fixed_amount" header="تخفیف ثابت"></Column>
                        <Column header="" body={detailsBodyTemplate}></Column>
                    </DataTable>
                </div>
            </div>
            <ConfirmDialog
                visible={displayConfirmDialog}
                onHide={() => setDisplayConfirmDialog(false)}
                message="آیا مطمئن هستید که می‌خواهید این تخفیف را حذف کنید؟"
                header="تایید حذف"
                icon="pi pi-exclamation-triangle ml-2 text-red-500"
                accept={confirmDelete}
                reject={cancelDelete}
                acceptLabel="تایید"
                rejectLabel="انصراف"
            />
            <CreateDiscount key={createPackage.toString()} visible={createPackage} onHide={() => setCreatePackage(false)} refreshData={refreshData} />

            <DetailDiscount key={detailsPackage.toString()} visible={detailsPackage} onHide={() => setDetailsPackage(false)} packageData={detailsPackageData} />

            <EditDiscount key={editPackage.toString()} visible={editPackage} onHide={() => setEditPackage(false)} packageData={editPackageData} refreshData={refreshData} />
        </div>
    );
};

export default PackagesList;
