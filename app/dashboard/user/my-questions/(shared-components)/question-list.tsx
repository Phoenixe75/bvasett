'use client';
import React, { useState } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';
import CreateQuestion from './new-question';
import { IQuestionsListProps } from '@/app/dashboard/admin/users-questions/(models)/questions';
import moment from 'jalali-moment';
import { Button } from 'primereact/button';

const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const MyQuestionsList: React.FC<IQuestionsListProps> = ({ data, loading, totalCount, currentPage, onPageChange, refreshData }) => {
    const [visible, setVisible] = useState<boolean>(false);

    const convertDateTime = (dateString: string) => {
        const jalaaliDate = moment(dateString);
        const date = jalaaliDate.format('jYYYY/jM/jD');
        const time = jalaaliDate.format('HH:mm');
        return { date, time };
    };

    if (loading) {
        return <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />;
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="text-left m-2">
                    <Button raised label="ثبت سوال جدید" className="bg-blue-700 text-white" onClick={() => setVisible(true)}></Button>
                </div>
                <div className="card p-fluid">
                    <h5>لیست سوالات‌</h5>
                    <hr />
                    {loading && <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />}
                    <DataTable value={data || []} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} emptyMessage="سوالی موجود نیست">
                        <Column field="body" header="متن سوال" />
                        <Column field="answer" header="پاسخ" />
                        <Column
                            field="created"
                            header="تاریخ ثبت سوال"
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
                            header="تاریخ تایید سوال"
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
                        <Column field="modified" header="تاریخ ویرایش" />
                        <Column field="body" header="متن سوال" body={(rowData) => truncateText(rowData.body, 12)}></Column>
                        <Column field="approved" header="تأیید شده" body={(rowData) => (rowData.approved ? 'بله' : 'خیر')} />
                    </DataTable>
                </div>
            </div>
            <CreateQuestion visible={visible} onHide={() => setVisible(false)} refreshData={refreshData} />;
        </div>
    );
};

export default MyQuestionsList;
