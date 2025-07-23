'use client';
import React, { useEffect, useRef, useState } from 'react';
import { IArticles } from '../(models)/article';
import { useRouter } from 'next/navigation';
import { MenuItem } from 'primereact/menuitem';
import { Column, ColumnBodyOptions } from 'primereact/column';
import { Menu } from 'primereact/menu';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { getArticles, onDeleteArticle } from '../(services)/article.service';
import { toast } from 'react-toastify';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { truncateText } from '../../ads/constant/converter';
import AppHeader from '@/layout/AppHeader';

interface IProps {
    data: IArticles[];
    loading: boolean;
    setLoading: any;
}

const ArticlesListPage = ({ data, loading, setLoading }: IProps) => {
    const [articles, setArticles] = useState<IArticles[]>([]);
    const [selectedAdId, setSelectedAdId] = useState<number | null>(null);
    const [displayConfirmDialog, setDisplayConfirmDialog] = useState<boolean>(false);
    const menu = useRef<any>([]);
    const router = useRouter();

    useEffect(() => {
        setArticles(data);
    }, [data]);

    const getItems = (rowData: IArticles): MenuItem[] => {
        return [
            {
                label: 'مشاهده',
                icon: 'pi pi-eye text-yellow-600 ml-2',
                command: () => router.push(`articles/details/${rowData.id}`)
            },
            {
                label: 'ویرایش',
                icon: 'pi pi-pencil text-blue-500 ml-2',
                command: () => router.push(`articles/edit/${rowData.id}`)
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
    };

    const cancelDelete = () => {
        setDisplayConfirmDialog(false);
    };

    const confirmDelete = async () => {
        if (selectedAdId != null) {
            try {
                await onDeleteArticle(selectedAdId);
                toast.success('مقاله حذف شد');
                refreshData();
            } catch (error) {
                console.error('Error deleting ad:', error);
                toast.error('حذف مقاله با خطا مواجه شد');
            } finally {
                setDisplayConfirmDialog(false);
                setSelectedAdId(null);
            }
        } else {
            toast.error('شناسایی مقاله امکان‌پذیر نیست. لطفاً دوباره امتحان کنید.');
        }
    };

    const refreshData = async () => {
        try {
            setLoading(true);
            const data = await getArticles();
            setArticles(data);
            setLoading(false);
        } catch (error) {
            console.error('Error refreshing articles:', error);
        }
    };

    const detailsBodyTemplate = (rowData: IArticles, options: ColumnBodyOptions) => {
        return (
            <React.Fragment>
                <Menu model={getItems(rowData)} popup ref={(el: any) => (menu.current[options.rowIndex] = el)} />
                <i className="pi pi-bars text-primary cursor-pointer" onClick={(event) => menu.current[options.rowIndex].toggle(event)} />
            </React.Fragment>
        );
    };

    return (
        <div className="grid detailsData ">
            <div className="col-12">
                <div className="text-left m-2">
                    <Link href="/dashboard/admin/articles/create">
                        <Button raised label="ثبت مقاله جدید" className="bg-blue-700 text-white" />
                    </Link>
                </div>
                <div className="card p-fluid">
                    <h5>لیست مقالات</h5>
                    <hr />
                    {loading && <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />}
                    <DataTable value={articles} paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }} emptyMessage="اطلاعاتی یافت نشد">
                        <Column key="row" field="row" header="ردیف" style={{ textAlign: 'right' }} body={(data, options) => options.rowIndex + 1}></Column>
                        <Column field="title" header="عنوان"></Column>
                        <Column field="active" header="وضعیت" body={(rowData) => (rowData.active ? 'فعال' : 'غیرفعال')}></Column>
                        {/* <Column field="author" header="نویسنده"></Column> */}
                        <Column field="" header="" body={detailsBodyTemplate}></Column>
                    </DataTable>
                </div>
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
        </div>
    );
};

export default ArticlesListPage;
