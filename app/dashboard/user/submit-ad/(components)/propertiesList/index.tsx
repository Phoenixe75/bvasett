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
import LoadingPage from '@/app/components/LoadingPage';

const MyPropertiesList: React.FC<any> = ({ data, totalCount, currentPage, onPageChange, loading, refreshData }) => {
    const router = useRouter();
    const handlePageChange = (event: any) => {
        onPageChange(event.page + 1);
    };

    const handleShowDetail = (id: any) => {
      router.push(`/dashboard/user/submit-ad/view-ad?id=${id}`)
    };
    const submitFullAdData = (id: any) => {
        router.push(`/dashboard/user/submit-ad/submit-full-ad-data?id=${id}`)
      };

    const convertDateTime = (dateString: string) => {
        const jalaaliDate = moment(dateString);
        const date = jalaaliDate.format('jYYYY/jM/jD');
        const time = jalaaliDate.format('HH:mm');
        return { date, time };
    };

    return (
        <LoadingPage isLoading={loading}>
        <div className="grid">
            <div className="col-12">
                <div className="text-left m-2">
                    <Button raised label="ایجاد آگهی" className="bg-blue-700 text-white" onClick={() => {
                      router.push('/dashboard/user/submit-ad/create-ad')
                    }}></Button>
                </div>
                <div className="card p-fluid">
                    <h5> لیست آگهی های من</h5>
                    <hr />
                    <DataTable value={data.results} stripedRows paginator rows={10} totalRecords={totalCount} first={(currentPage - 1) * 10} onPage={handlePageChange} tableStyle={{ minWidth: '50rem' }} emptyMessage="آگهی موجود نیست">
                        <Column key="row" field="row" header="ردیف" style={{ width: '5%', textAlign: 'center' }} body={(data, options) => options.rowIndex + 1}></Column>
                        <Column field="registration_unit" header="عنوان"></Column>
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
                                <div className='flex gap-2 align-items-center'>
                                {rowData.status === 3 ? <Button style={{maxWidth:"110px"}}  onClick={() => {
                                            submitFullAdData(rowData?.id);
                                        }}  severity='success'>تکمیل آگهی</Button> : null}
                                    <i
                                        className="pi pi-eye text-yellow-500 cursor-pointer"
                                        onClick={() => {
                                            handleShowDetail(rowData?.id);
                                        }}
                                    />
                                </div>
                            )}
                        ></Column>
                    </DataTable>
                </div>
            </div>
        </div>
        </LoadingPage>
    );
};

export default MyPropertiesList;
