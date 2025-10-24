import React from 'react';
import {ProgressSpinner} from 'primereact/progressspinner';
import {Message} from 'primereact/message';

const DefectManagementPage = () => {
  return (<div className="card p-fluid">
    <h5>مدیریت نواقص</h5>
    <hr/>
    <div className="flex-1">
      <h1 className="text-primary"
          style={{fontSize: '16px'}}>در این قسمت فایل آگهی‌های ناقص توسط ادمین بررسی و تایید یا رد میشوند(با یک متن توضیحات مربوط
        به تایید یا رد)</h1>
      <Message severity="warn"
               dir="rtl"
               text="این قسمت درحال توسعه است" />
      <div className="text-center">
        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />;
      </div>
    </div>
  </div>)
};

export default DefectManagementPage;
