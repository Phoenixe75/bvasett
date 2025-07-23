'use client';
import React from 'react';

// primereact
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';


// packages
import moment from 'jalali-moment';

// constant
import { truncateText } from '@/app/dashboard/admin/ads/constant/converter';

import './propertiesList.scss';
import { useRouter } from 'next/navigation';
import { statusConverter } from '@/app/utils/(properties)/statusConverter';

const MyPropertiesList: React.FC<any> = ({ data, totalCount, currentPage, onPageChange, refreshData }) => {
    const router = useRouter();
    const handlePageChange = (event: any) => {
        onPageChange(event.page + 1);
    };

    const handleShowDetail = (id: any) => {
      router.push(`/dashboard/admin/properties/edit-property?id=${id}`)
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
                <div className="card p-fluid">
                    <h5> لیست آکهی‌ها</h5>
                    <hr />
                    <DataTable value={data.results} stripedRows paginator rows={10} totalRecords={totalCount} first={(currentPage - 1) * 10} onPage={handlePageChange} tableStyle={{ minWidth: '50rem' }} emptyMessage="تیکت موجود نیست">
                        <Column key="row" field="row" header="ردیف" style={{ width: '5%', textAlign: 'center' }} body={(data, options) => options.rowIndex + 1}></Column>
                        <Column field="registration_unit" header="عنوان"></Column>
                        <Column field="owner_name" header="ثبت‌کننده آگهی"></Column>
                        <Column field="owner_mobile" header="تلفن ثبت‌کننده آگهی"></Column>
                        <Column field="status" header="وضعیت" body={(rowData) => statusConverter(rowData.status)}></Column>
                        <Column field="notes" header="پاسخ" body={(rowData) => truncateText(rowData.answer, 12)}></Column>
                        <Column
                            field="created"
                            header="تاریخ ایجاد آگهی"
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
            </div>
        </div>
    );
};

export default MyPropertiesList;
