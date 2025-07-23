'use client';
import React, { useState } from 'react';

// primereact
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

// models
import { ITickets } from '@/app/dashboard/admin/users-tickets/(models)/tickets';

// packages
import moment from 'jalali-moment';

// constant
import { truncateText } from '@/app/dashboard/admin/ads/constant/converter';

// comp
import DetailTicket from './detail-ticket';
import CreateTicket from './create-ticket';

import './style.scss';

const MyTicketsList: React.FC<any> = ({ data, loading, totalCount, currentPage, onPageChange, refreshData }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [detailVisible, setDetailVisible] = useState<boolean>(false);
    const [ticketData, setTicketData] = useState<ITickets | null>(null);

    const handlePageChange = (event: any) => {
        onPageChange(event.page + 1);
    };

    const handleShowDetail = (id: any) => {
        const dataItem: any = data.find((item: any) => item.id === id);
        setTicketData(dataItem);
        setDetailVisible(true);
    };

    const convertDateTime = (dateString: string) => {
        const jalaaliDate = moment(dateString);
        const date = jalaaliDate.format('jYYYY/jM/jD');
        const time = jalaaliDate.format('HH:mm');
        return { date, time };
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="text-left m-2">
                    <Button raised label="ارسال تیکت جدید" className="bg-blue-700 text-white" onClick={() => setVisible(true)}></Button>
                </div>
                <div className="card p-fluid">
                    <h5> لیست تیکت‌های من</h5>
                    <hr />
                    {loading && <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />}
                    <DataTable value={data} stripedRows paginator rows={10} totalRecords={totalCount} first={(currentPage - 1) * 10} onPage={handlePageChange} tableStyle={{ minWidth: '50rem' }} emptyMessage="تیکت موجود نیست">
                        <Column key="row" field="row" header="ردیف" style={{ width: '5%', textAlign: 'center' }} body={(data, options) => options.rowIndex + 1}></Column>
                        <Column field="subject" header="عنوان"></Column>
                        <Column field="body" header="متن تیکت"></Column>
                        <Column field="answer" header="پاسخ" body={(rowData) => truncateText(rowData.answer, 12)}></Column>
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
                            body={(rowData) => (
                                <i
                                    className="pi pi-eye text-yellow-500 cursor-pointer"
                                    onClick={() => {
                                        handleShowDetail(rowData?.id);
                                    }}
                                />
                            )}
                        ></Column>
                    </DataTable>
                </div>
                <CreateTicket visible={visible} onHide={() => setVisible(false)} refreshData={refreshData} />
                <DetailTicket visible={detailVisible} onHide={() => setDetailVisible(false)} dataDetail={ticketData} />
            </div>
        </div>
    );
};

export default MyTicketsList;
