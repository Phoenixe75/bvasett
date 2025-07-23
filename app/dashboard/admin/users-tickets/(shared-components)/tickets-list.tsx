'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Column, ColumnBodyOptions } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'react-toastify';
import moment from 'jalali-moment';
import { Paginator } from 'primereact/paginator';
import { ITickets } from '../(models)/tickets';
import { getAllTickets, onDeleteTicket } from '../(services)/tickets.service';
import { getUser } from '../../users/(services)/users.service';
import { truncateText } from '../../ads/constant/converter';

const TicketsListPage = () => {
    const [data, setData] = useState<ITickets[]>([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(25);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
    const [displayConfirmDialog, setDisplayConfirmDialog] = useState<boolean>(false);
    const [userNames, setUserNames] = useState<string[]>([]);
    const menu = useRef<Menu[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetchData(page + 1);
    }, [page]);

    const fetchData = async (page: number) => {
        try {
            setLoading(true);
            const response = await getAllTickets(page);
            setData(response.results);
            setCount(response.count);
            setLoading(false);
        } catch (error) {
            console.error('Error retrieving tickets:', error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchUserNames = async () => {
            if (data.length > 0) {
                const userIds = data.map((ticket) => ticket.user).filter((id) => id !== null) as number[];
                try {
                    const users = await Promise.all(userIds.map((id) => getUser(id)));
                    const names = users.map((user) => user.mobile);
                    setUserNames(names);
                } catch (error) {
                    console.error('Error retrieving users:', error);
                }
            }
        };

        fetchUserNames();
    }, [data]);

    const onPageChange = (event: any) => {
        setPage(event.page);
        setRows(event.rows);
    };

    const getItems = (rowData: ITickets): MenuItem[] => {
        return [
            {
                label: 'مشاهده',
                icon: 'pi pi-eye text-yellow-500 ml-2',
                command: () => router.push(`users-tickets/details/${rowData.id}`)
            },
            {
                label: 'پاسخ دادن',
                icon: 'pi pi-replay text-primary ml-2',
                command: () => router.push(`users-tickets/replay/${rowData.id}`)
            },
            {
                label: 'ویرایش',
                icon: 'pi pi-pencil text-primary ml-2',
                command: () => router.push(`users-tickets/edit/${rowData.id}`)
            },
            {
                label: 'حذف',
                icon: 'pi pi-trash text-red-500 ml-2',
                command: () => {
                    setSelectedTicketId(rowData.id!);
                    setDisplayConfirmDialog(true);
                }
            }
        ];
    };

    const refreshData = async () => {
        try {
            setLoading(true);
            const data = await getAllTickets(page + 1);
            setData(data.results);
            setCount(data.count);
            setLoading(false);
        } catch (error) {
            console.error('Error refreshing ads:', error);
        }
    };

    const confirmDelete = async () => {
        if (selectedTicketId !== null) {
            try {
                await onDeleteTicket(selectedTicketId);
                toast.success('تیکت حذف شد');
                refreshData();
            } catch (error) {
                console.error('Error deleting Ticket:', error);
                toast.error('حذف آگهی با خطا مواجه شد');
            } finally {
                setDisplayConfirmDialog(false);
                setSelectedTicketId(null);
            }
        } else {
            toast.error('شناسایی آگهی امکان‌پذیر نیست. لطفاً دوباره امتحان کنید.');
        }
    };

    const cancelDelete = () => {
        setDisplayConfirmDialog(false);
    };

    const detailsBodyTemplate = (rowData: ITickets, options: ColumnBodyOptions) => {
        return (
            <React.Fragment>
                <Menu model={getItems(rowData)} popup ref={(el: Menu) => (menu.current[options.rowIndex] = el)} />
                <i className="pi pi-bars text-primary cursor-pointer" onClick={(event) => menu.current[options.rowIndex].toggle(event)} aria-label="Menu" />
            </React.Fragment>
        );
    };

    const convertDateTime = (dateString: string) => {
        const jalaaliDate = moment(dateString);
        const date = jalaaliDate.format('jYYYY/jM/jD');
        const time = jalaaliDate.format('HH:mm');
        return { date, time };
    };

    return (
        <>
            <div>
                {loading && <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />}
                <DataTable value={data} paginator={false} rows={rows} tableStyle={{ minWidth: '50rem' }} className="p-datatable-gridlines">
                    <Column key="row" field="row" header="ردیف" style={{ width: '5%', textAlign: 'center' }} body={(data, options) => options.rowIndex + 1}></Column>
                    <Column field="subject" header="موضوع" body={(rowData) => truncateText(rowData.subject, 12)}></Column>
                    <Column field="answer" header="پاسخ" body={(rowData) => truncateText(rowData.answer, 12)}></Column>
                    {/* <Column
                            field="answered_at"
                            header="تاریخ پاسخ تیکت"
                            // body={(rowData) => {
                            //     const { date, time } = convertDateTime(rowData.answered_at);
                            //     return (
                            //         <div>
                            //             <div>
                            //                 {date} - {time}
                            //             </div>
                            //         </div>
                            //     );
                            // }}
                        ></Column>
                        <Column field="answered_by" header="پاسخ  دهنده "></Column> */}
                    <Column
                        field="created"
                        header="تاریخ ارسال تیکت"
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
                        header="تاریخ تایید تیکت"
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
                    <Column field="body" header="متن تیکت" body={(rowData) => truncateText(rowData.body, 12)}></Column>
                    <Column field="user" header=" کاربر" body={(rowData) => userNames[data.findIndex((ticket) => ticket.id === rowData.id)] || 'نامشخص'}></Column>
                    <Column header="" body={detailsBodyTemplate}></Column>
                </DataTable>
                <Paginator dir="ltr" first={page * rows} rows={rows} totalRecords={count} onPageChange={onPageChange} />
            </div>
            <ConfirmDialog
                visible={displayConfirmDialog}
                onHide={() => setDisplayConfirmDialog(false)}
                message="آیا مطمئن هستید که می‌خواهید این تیکت را حذف کنید؟"
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

export default TicketsListPage;
