'use client';
import React, { useEffect, useRef, useState } from 'react';
import { IUsers } from '../(models)/users';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Menu } from 'primereact/menu';
import { useRouter } from 'next/navigation';
import { ProgressSpinner } from 'primereact/progressspinner';
import FilterUsers from '@/app/components/filterUsers';
import { filterUsers } from '@/app/components/filterUsers/(services)/filterUsers.service';
import { getUsers } from '../(services)/users.service';
import { toast } from 'react-toastify';
import { IFilterUsers } from '@/app/components/filterUsers/(models)/filterUsers';
import { MenuItem } from 'primereact/menuitem';
import { Paginator } from 'primereact/paginator';

const UsersList = () => {
    const [users, setUsers] = useState<IUsers[]>([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(25);
    const [loading, setLoading] = useState<boolean>(false);
    const [filters, setFilters] = useState<IFilterUsers>({
        mobile: '',
        national_id: '',
        first_name: '',
        last_name: ''
    });

    const menu = useRef<(Menu | null)[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetchData(filters, page + 1);
    }, [filters, page]);

    const fetchData = async (filters: IFilterUsers, page: number) => {
        try {
            setLoading(true);
            let data;
            if (filters.mobile || filters.national_id || filters.first_name || filters.last_name) {
                data = await filterUsers(filters, page);
            } else {
                data = await getUsers(page);
            }
            setUsers(data.results);
            setCount(data.count);
            setLoading(false);
        } catch (error) {
            toast.error('خطایی در بارگزاری داده‌ها رخ داد');
        } finally {
            setLoading(false);
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

    const getItems = (rowData: IUsers): MenuItem[] => [
        {
            label: 'مشاهده',
            icon: 'fa fa-eye text-info',
            command: () => router.push(`users/details/${rowData.id}`)
        },
        {
            label: 'ویرایش',
            icon: 'fa fa-edit text-primary',
            command: () => router.push(`users/edit/${rowData.id}`)
        }
    ];

    const detailsBodyTemplate = (rowData: IUsers, options: any) => {
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
        <div className="card p-fluid">
            <h5>لیست کاربران</h5>
            <hr />
            <FilterUsers onFilterSubmit={onFilterSubmit} />
            <div className="card">
                {loading && <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />}
                <DataTable key={loading? "true" : 'false'} value={users} paginator={false} rows={rows} tableStyle={{ minWidth: '50rem' }} className="p-datatable-gridlines" emptyMessage="کاربری یافت نشد">
                    <Column field="first_name" header="نام"></Column>
                    <Column field="last_name" header="نام خانوادگی"></Column>
                    <Column field="mobile" header="شماره موبایل"></Column>
                    <Column body={detailsBodyTemplate} header="" />
                </DataTable>
                <Paginator dir="ltr" first={page * rows} rows={rows} totalRecords={count} onPageChange={onPageChange} />
            </div>
        </div>
    );
};

export default UsersList;
