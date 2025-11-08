'use client';

import Link from 'next/link';
import AdsTable from './(shared-components)/ads-list';
import {Button} from 'primereact/button';

const AdsPage = () => {
  return (
    <div className="grid">
      <div className="col-12">
        <div className="flex  align-items-center  justify-content-between m-2">
          <div className="text-right">
            <h5>لیست آگهی ها</h5>
          </div>
          <div className="text-left">
            <Link href="/dashboard/admin/ads/create">
              <Button raised label="ثبت آگهی جدید" className="bg-blue-700 text-white"></Button>
            </Link>
          </div>
        </div>
        <div>
          <hr/>
          <AdsTable/>
        </div>
      </div>
    </div>
  );
};

export default AdsPage;
