'use client';
import React, { useRef, useState } from 'react';
import { IPackageListProps, IPackages } from '../(models)/packages';
import { Column, ColumnBodyOptions } from 'primereact/column';
import { Menu } from 'primereact/menu';
import { toast } from 'react-toastify';
import { MenuItem } from 'primereact/menuitem';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { onDeletePackage } from '../(services)/packages.service';
import EditPackage from './EditPackage';
import DetailPackage from './DetailPackage';
import CreatePackage from './CreatePackage';
import { getPurposeLabel } from '../../ads/constant/converter';

const PackagesList: React.FC<IPackageListProps> = ({ data, loading, totalCount, currentPage, onPageChange, refreshData }) => {
    const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
    const [displayConfirmDialog, setDisplayConfirmDialog] = useState<boolean>(false);
    const [detailsPackage, setDetailsPackage] = useState<boolean>(false);
    const [detailsPackageData, setDetailsPackageData] = useState<IPackages | null>(null);
    const [editPackage, setEditPackage] = useState<boolean>(false);
    const [editPackageData, setEditPackageData] = useState<IPackages | null>(null);
    const [createPackage, setCreatePackage] = useState<boolean>(false);
    const menu = useRef<Menu[]>([]);

    const getItems = (rowData: IPackages): MenuItem[] => {
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
                await onDeletePackage(selectedPackageId);
                toast.success('قیمت‌گذاری حذف شد');
                refreshData();
            } catch (error) {
                console.error('Error deleting Package:', error);
                toast.error('حذف قیمت‌گذاری با خطا مواجه شد');
            } finally {
                setDisplayConfirmDialog(false);
                setSelectedPackageId(null);
            }
        } else {
            toast.error('شناسایی قیمت‌گذاری امکان‌پذیر نیست. لطفاً دوباره امتحان کنید.');
        }
    };

    const cancelDelete = () => {
        setDisplayConfirmDialog(false);
    };

    const detailsBodyTemplate = (rowData: IPackages, options: ColumnBodyOptions) => {
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
        const packageData: IPackages | undefined = data.find((pkg) => pkg.id === id);
        if (packageData) {
            setEditPackageData(packageData);
            setEditPackage(true);
        } else {
            toast.error('قیمت‌گذاری مورد نظر یافت نشد.');
        }
    };

    return (
        <div className="grid detailsData ">
            <div className="col-12">
                <div className="text-left m-2">
                    <Button raised label="ثبت قیمت‌گذاری جدید" className="bg-blue-700 text-white" onClick={handleShowCreate} />
                </div>
                <div className="card p-fluid">
                    <h5>لیست قیمت‌گذاری ها</h5>
                    <hr />
                    {loading && <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />}
                    <DataTable value={data} stripedRows paginator rows={10} totalRecords={totalCount} first={(currentPage - 1) * 10} onPage={handlePageChange} tableStyle={{ minWidth: '50rem' }} emptyMessage="قیمت‌گذاری موجود نیست">
                        <Column key="row" field="row" header="ردیف" style={{ width: '5%', textAlign: 'center' }} body={(data, options) => options.rowIndex + 1}></Column>
                        <Column field="purpose" header="نوع آگهی" body={rowData => getPurposeLabel(rowData.ad_purpose)}></Column>
                        <Column field="with_inquiry_price" header="قیمت با استعلام"></Column>
                        <Column field="without_inquiry_price" header="قیمت بدون استعلام"></Column>
                        <Column header="" body={detailsBodyTemplate}></Column>
                    </DataTable>
                </div>
            </div>
            <ConfirmDialog
                visible={displayConfirmDialog}
                onHide={() => setDisplayConfirmDialog(false)}
                message="آیا مطمئن هستید که می‌خواهید این قیمت‌گذاری را حذف کنید؟"
                header="تایید حذف"
                icon="pi pi-exclamation-triangle ml-2 text-red-500"
                accept={confirmDelete}
                reject={cancelDelete}
                acceptLabel="تایید"
                rejectLabel="انصراف"
            />
            <CreatePackage visible={createPackage} onHide={() => setCreatePackage(false)} refreshData={refreshData} />

            <DetailPackage visible={detailsPackage} onHide={() => setDetailsPackage(false)} packageData={detailsPackageData} />

            <EditPackage visible={editPackage} onHide={() => setEditPackage(false)} packageData={editPackageData} refreshData={refreshData} />
        </div>
    );
};

export default PackagesList;
