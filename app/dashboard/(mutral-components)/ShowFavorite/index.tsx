'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import PackageItem from '@/app/components/CardPackage';
import { formatNumber, getLocationLabel, getPurposeLabel, truncateText } from '@/app/dashboard/admin/ads/constant/converter';
import { Paginator } from 'primereact/paginator';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { toast } from 'react-toastify';
import Joyride from 'react-joyride';
import SuggestItem from '@/app/components/SuggestItem';
import { getFavorite } from './(services)/showFavorite.service';
import AppHeader from '@/layout/AppHeader';
import AppFooter from '@/layout/AppFooter';
import AppCopyRight from '@/layout/AppCopyRight';
import ItemCards from '@/app/components/ItemCards';
import { useUserContext } from '@/layout/context/usercontext';
import PropertyDialog from '@/app/components/PropertyDialog';
import LoginModal from '@/app/components/LoginModal';

interface IPackage {
    id: number;
    name: string;
    count: number;
    extra: number;
    price: string;
}

const MyFavoritePage: React.FC = () => {
    const [formData, setFormData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(25);
    const [selectedRowData, setSelectedRowData] = useState<any | null>(null);
    const [displayDialog, setDisplayDialog] = useState<boolean>(false);
    const router = useRouter();
    const fetchData = async (page: number) => {
        try {
            const data = await getFavorite(page);
            setFormData(data.results);
            setCount(data.count);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(page + 1);
    }, [page]);

    const onPageChange = (event: any) => {
        setPage(event.page);
        setRows(event.rows);
    };

    const back = (): void => {
        router.back();
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

    if (loading) return <ProgressSpinner style={{ width: '50px', height: '50px' }} />;
    if (formData.length < 1 && !loading)
        return (
            <div style={{ height: '78dvh' }} className="card p-fluid w-full flex align-items-center justify-content-center">
                <h3 style={{width: '180px'}}>موردی پیدا نشد</h3>
            </div>
        );
    return (
        <>
            <div style={{ height: '78dvh' }} className="card p-fluid flex flex-column justify-content-between">
                <div className="filess">
                    <ItemCards maxCount={0} onSelectionChange={() => {}} showSelectable={false} data={formData} selectable={false} onShowDetails={showDetails} />
                </div>
                <Paginator dir="ltr" first={page * rows} rows={rows} totalRecords={count} onPageChange={onPageChange} />

                <PropertyDialog visible={displayDialog} onHide={hideDialog} selectedRowData={selectedRowData} />
            </div>
        </>
    );
};

export default MyFavoritePage;
