'use client';
import React, { useRef, useState } from 'react';
import { ISliderListProps, ISliders } from '../(models)/sliders';
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
import { onDeleteSlider } from '../(services)/sliders.service';
import moment from 'jalali-moment';

const SliderList: React.FC<ISliderListProps> = ({ data, loading, totalCount, currentPage, onPageChange, refreshData }) => {
    const [selectedSliderId, setSelectedSliderId] = useState<number | null>(null);
    const [displayConfirmDialog, setDisplayConfirmDialog] = useState<boolean>(false);
    const menu = useRef<Menu[]>([]);
    const router = useRouter();

    const getItems = (rowData: ISliders): MenuItem[] => {
        return [
            {
                label: 'مشاهده',
                icon: 'pi pi-eye text-yellow-500 ml-2',
                command: () => router.push(`sliders/details/${rowData.id}`)
            },
            {
                label: 'ویرایش',
                icon: 'pi pi-pencil text-primary ml-2',
                command: () => router.push(`sliders/edit/${rowData.id}`)
            },
            {
                label: 'حذف',
                icon: 'pi pi-trash text-red-500 ml-2',
                command: () => {
                    setSelectedSliderId(rowData.id!);
                    setDisplayConfirmDialog(true);
                }
            }
        ];
    };

    const confirmDelete = async () => {
        if (selectedSliderId != null) {
            try {
                await onDeleteSlider(selectedSliderId);
                toast.success('اسلایدر حذف شد');
                refreshData();
            } catch (error) {
                console.error('Error deleting slider:', error);
                toast.error('حذف اسلایدر با خطا مواجه شد');
            } finally {
                setDisplayConfirmDialog(false);
                setSelectedSliderId(null);
            }
        } else {
            toast.error('شناسایی اسلایدر امکان‌پذیر نیست. لطفاً دوباره امتحان کنید.');
        }
    };

    const cancelDelete = () => {
        setDisplayConfirmDialog(false);
    };

    const detailsBodyTemplate = (rowData: ISliders, options: ColumnBodyOptions) => {
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
        return <img src={`${rowData.image}`} alt={rowData.image} width="164px" className="shadow-4" />;
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
                    <Link href="/dashboard/admin/sliders/create">
                        <Button raised label="ثبت اسلایدر جدید" className="bg-blue-700 text-white" />
                    </Link>
                </div>
                <div className="card p-fluid mt-2">
                    <h5>لیست اسلایدرها</h5>
                    <hr />
                    {loading && <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />}
                    <DataTable value={data} stripedRows paginator rows={10} totalRecords={totalCount} first={(currentPage - 1) * 10} onPage={handlePageChange} tableStyle={{ minWidth: '50rem' }} emptyMessage="اسلایدری موجود نیست">
                        <Column key="row" header="پیش نمایش" style={{ width: '10%', textAlign: 'center' }} body={imageBodyTemplate}></Column>
                        <Column field="title" header="عنوان"></Column>
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
                message="آیا مطمئن هستید که می‌خواهید این اسلایدر را حذف کنید؟"
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

export default SliderList;
