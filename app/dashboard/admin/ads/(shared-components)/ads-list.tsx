'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { DataTable } from 'primereact/datatable';
import { MenuItem } from 'primereact/menuitem';
import { Menu } from 'primereact/menu';
import { ConfirmDialog } from 'primereact/confirmdialog';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { getAllAds, onDeleteAds } from '../(services)/ads.service';
import { getLocationLabel, getPurposeLabel, getTypeLabel } from '../constant/converter';
import FilterAds from '@/app/components/filterAds';
import { ProgressSpinner } from 'primereact/progressspinner';
import { filterAdsAdmin } from '@/app/components/filterAds/(services)/filterAds.service';
import { IAdsBase } from '../(models)/ads';

const AdsTable = () => {
    const [ads, setAds] = useState<IAdsBase[]>([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(25);
    const [loading, setLoading] = useState<boolean>(false);
    const [filters, setFilters] = useState<{ title: string; slug: string }>({ title: '', slug: '' });
    const [selectedAdId, setSelectedAdId] = useState<number | null>(null);
    const [displayConfirmDialog, setDisplayConfirmDialog] = useState<boolean>(false);
    const router = useRouter();
    const menu = useRef<(Menu | null)[]>([]);

    useEffect(() => {
        fetchAds(filters, page + 1);
    }, [filters, page]);

    const fetchAds = async (filters: any, page: number) => {
        try {
            setLoading(true);
            let data;
            if (filters.title || filters.slug) {
                data = await filterAdsAdmin(filters, page);
            } else {
                data = await getAllAds(page);
            }
            setAds(data.results);
            setCount(data.count);
            setLoading(false);
        } catch (error) {
            toast.error('خطایی در بارگزاری داده‌ها رخ داد');
        }
    };

    const onFilterSubmit = (newFilters: any) => {
        setFilters(newFilters);
        setPage(0);
    };

    const onPageChange = (event: any) => {
        setPage(event.page);
        setRows(event.rows);
    };

    const getItems = (rowData: IAdsBase): MenuItem[] => [
        {
            label: 'مشاهده',
            icon: 'pi pi-eye text-yellow-500 ml-2',
            command: () => router.push(`ads/details/${rowData.id}`)
        },
        {
            label: 'ویرایش',
            icon: 'pi pi-pencil text-primary ml-2',
            command: () => router.push(`ads/edit/${rowData.id}`)
        },
        {
            label: 'حذف',
            icon: 'pi pi-trash text-red-500 ml-2',
            command: () => {
                setSelectedAdId(rowData.id!);
                setDisplayConfirmDialog(true);
            }
        }
    ];

    const confirmDelete = async () => {
        if (selectedAdId != null) {
            try {
                await onDeleteAds(selectedAdId);
                toast.success('آگهی حذف شد');
                fetchAds(filters, page + 1);
            } catch (error) {
                console.error('Error deleting ad:', error);
                toast.error('حذف آگهی با خطا مواجه شد');
            } finally {
                setDisplayConfirmDialog(false);
                setSelectedAdId(null);
            }
        } else {
            toast.error('شناسایی آگهی امکان‌پذیر نیست. لطفاً دوباره امتحان کنید.');
        }
    };

    const cancelDelete = () => {
        setDisplayConfirmDialog(false);
    };

    const detailsBodyTemplate = (rowData: IAdsBase, options: any) => {
        const menuRef = menu.current[options.rowIndex];
        return (
            <>
                <Menu model={getItems(rowData)} popup ref={(el) => (menu.current[options.rowIndex] = el)} />
                <i
                    className="pi pi-bars text-primary cursor-pointer"
                    onClick={(event) => {
                        if (menuRef) {
                            menuRef.toggle(event);
                        }
                    }}
                    aria-label="Menu"
                />
            </>
        );
    };

    return (
        <>
            <FilterAds onFilterSubmit={onFilterSubmit} />
            <div className="card">
                {loading && <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />}
                <DataTable key={loading? 'true' : 'false'}value={ads} paginator={false} rows={rows} tableStyle={{ minWidth: '50rem' }} className="p-datatable-gridlines" emptyMessage="آگهی یافت نشد">
                    <Column key="row" field="row" header="ردیف" style={{ width: '5%', textAlign: 'center' }} body={(data, options) => options.rowIndex + 1}></Column>
                    <Column field="title" header="عنوان"></Column>
                    <Column field="purpose" header="نوع معامله" body={(rowData) => getPurposeLabel(rowData.purpose)}></Column>
                    <Column field="location" header="جهت ملک" body={(rowData) => getLocationLabel(rowData.location)}></Column>
                    <Column field="type_label" header="نوع ملک" body={(rowData) => getTypeLabel(rowData.type)}></Column>
                    <Column field="area" header="متراژ"></Column>
                    <Column field="district" header="منطقه"></Column>
                    <Column header="" body={detailsBodyTemplate}></Column>
                </DataTable>
                <Paginator dir="ltr" first={page * rows} rows={rows} totalRecords={count} onPageChange={onPageChange} />
            </div>
            <ConfirmDialog
                visible={displayConfirmDialog}
                onHide={() => setDisplayConfirmDialog(false)}
                message="آیا مطمئن هستید که می‌خواهید این آگهی را حذف کنید؟"
                header="تایید حذف"
                icon="pi pi-exclamation-triangle ml-2 text-red-500"
                accept={confirmDelete}
                reject={cancelDelete}
                acceptLabel="تایید"
                rejectLabel="انصراف"
            />
        </>
    );
};

export default AdsTable;
