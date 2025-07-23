'use client';
import React, { useRef, useState } from 'react';
import { MenuItem } from 'primereact/menuitem';
import { Menu } from 'primereact/menu';
import { toast } from 'react-toastify';
import { Column, ColumnBodyOptions } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import moment from 'jalali-moment';
import { ISettings, ISettingsListProps } from '../(models)/setting';
import { onDeleteSetting } from '../(services)/setting.service';

const SettingList: React.FC<ISettingsListProps> = ({ data, loading, totalCount, currentPage, onPageChange, refreshData }) => {
    const [selectedSettingId, setSelectedSettingId] = useState<number | null>(null);
    const [displayConfirmDialog, setDisplayConfirmDialog] = useState<boolean>(false);
    const menu = useRef<Menu[]>([]);
    const router = useRouter();

    const getItems = (rowData: ISettings): MenuItem[] => {
        return [
            {
                label: 'مشاهده',
                icon: 'pi pi-eye text-yellow-500 ml-2',
                command: () => router.push(`setting/details/${rowData.id}`)
            },
            {
                label: 'ویرایش',
                icon: 'pi pi-pencil text-primary ml-2',
                command: () => router.push(`setting/edit/${rowData.id}`)
            },
            {
                label: 'حذف',
                icon: 'pi pi-trash text-red-500 ml-2',
                command: () => {
                    setSelectedSettingId(rowData.id!);
                    setDisplayConfirmDialog(true);
                }
            }
        ];
    };

    const confirmDelete = async () => {
        if (selectedSettingId != null) {
            try {
                await onDeleteSetting(selectedSettingId);
                toast.success('تنظیمات حذف شد');
                refreshData();
            } catch (error) {
                console.error('Error deleting setting:', error);
                toast.error('حذف تنظیمات با خطا مواجه شد');
            } finally {
                setDisplayConfirmDialog(false);
                setSelectedSettingId(null);
            }
        } else {
            toast.error('شناسایی تنظیمات امکان‌پذیر نیست. لطفاً دوباره امتحان کنید.');
        }
    };

    const cancelDelete = () => {
        setDisplayConfirmDialog(false);
    };

    const detailsBodyTemplate = (rowData: ISettings, options: ColumnBodyOptions) => {
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

    const imageBodyTemplate = (rowData: any) => {
        console.log('rowData.logo ', rowData.logo);
        return <img src={`${rowData.logo}`} alt={rowData.logo} width="64px" className="shadow-4" />;
    };

    const convertDateTime = (dateString: string) => {
        const jalaaliDate = moment(dateString);
        const date = jalaaliDate.format('jYYYY/jM/jD');
        const time = jalaaliDate.format('HH:mm');
        return { date, time };
    };

    return (
        <div className="grid detailsData ">
            <div className="col-12">
                <div className="text-left">
                    <Link href="/dashboard/admin/setting/create">
                        <Button raised label="ثبت تنظیمات جدید" className="bg-blue-700 text-white" />
                    </Link>
                </div>
                <div className="card p-fluid mt-2">
                    <h5>لیست تنظیمات</h5>
                    <hr />
                    {loading && <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />}
                    <DataTable value={data} stripedRows paginator rows={10} totalRecords={totalCount} first={(currentPage - 1) * 10} onPage={handlePageChange} tableStyle={{ minWidth: '50rem' }} emptyMessage="تنظیماتی موجود نیست">
                        <Column key="row" header="پیش نمایش لوگو" style={{ width: '10%', textAlign: 'center' }} body={imageBodyTemplate}></Column>
                        <Column field="site_name" header="نام سایت"></Column>
                        <Column
                            field="created"
                            header="تاریخ ثبت"
                            body={(rowData) => {
                                const { date, time } = convertDateTime(rowData.created);
                                return (
                                    <div>
                                        <div>
                                            {date} - {time}
                                        </div>
                                    </div>
                                );
                            }}
                        ></Column>
                        <Column
                            field="modified"
                            header="تاریخ ویرایش"
                            body={(rowData) => {
                                const { date, time } = convertDateTime(rowData.modified);
                                return (
                                    <div>
                                        <div>
                                            {date} - {time}
                                        </div>
                                    </div>
                                );
                            }}
                        ></Column>
                        <Column field="active" header="وضعیت" body={(rowData) => (rowData.active ? 'فعال' : 'غیرفعال')}></Column>
                        <Column header="" body={detailsBodyTemplate}></Column>
                    </DataTable>
                </div>
            </div>
            <ConfirmDialog
                visible={displayConfirmDialog}
                onHide={() => setDisplayConfirmDialog(false)}
                message="آیا مطمئن هستید که می‌خواهید این تنظیمات را حذف کنید؟"
                header="تایید حذف"
                icon="pi pi-exclamation-triangle ml-2 text-red-500"
                accept={confirmDelete}
                reject={cancelDelete}
                acceptLabel="تایید"
                rejectLabel="انصراف"
            />
        </div>
    );
};

export default SettingList;
