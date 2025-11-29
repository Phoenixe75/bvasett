'use client';

import React, {FC, useEffect, useRef, useState} from 'react';
import {PageParams} from '@/types/layout';
import {AdCompleteStatusEnumType} from '@/app/dashboard/admin/defect-management/(models)/types';
import {IAds} from '@/app/dashboard/admin/ads/(models)/ads';
import {getAdsByCompleteStatus} from '@/app/dashboard/admin/defect-management/(services)/deflect-management.service';
import {AdCompleteStatusEnum} from '@/app/dashboard/admin/defect-management/(models)/ad-complete-status.enum';
import DeflectListComponent from '@/app/dashboard/admin/defect-management/(shared-components)/deflectListComponent';
import {ProgressSpinner} from 'primereact/progressspinner';
import {useDefectContext} from '@/app/dashboard/admin/defect-management/context/defect.context';
import {useRouter} from 'next/navigation';

const DeflectListPage: FC<PageParams> = ({params}: any) => {

  const [ads, setAds] = useState<IAds[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  // const [currentPage, setCurrentPage] = useState<number>(1);
  const currentStatus = useRef(AdCompleteStatusEnum.incomplete);
  const {page, setPage} = useDefectContext();
  const router = useRouter();

  useEffect(() => {
    if (params != null && params.status as AdCompleteStatusEnumType !== currentStatus.current) {
      currentStatus.current = params.status as AdCompleteStatusEnumType;
      fetchData(page + 1);
    }
  }, [params]);

  const fetchData = async (page: number) => {
    if (!loading) {
      try {
        setLoading(true);
        const adsResult = await getAdsByCompleteStatus(currentStatus.current, page);
        // setTotalCount(adsResult.count);
        setTotalCount(adsResult.active_count ?? 0);
        setAds(adsResult.results ?? []);
      } catch (error) {
        console.error('Error retrieving package:', error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  }

  const refreshData = async () => {
    await fetchData(page + 1);
  };

  const handlePageChange = (page: number) => {
    setPage(page - 1);
    router.push(`/dashboard/admin/defect-management/list/${currentStatus.current}?currentPage=${page}`);
  };

  useEffect(() => {
    fetchData(page + 1);
  }, [page]);

  return <>
    {loading ?
      (<ProgressSpinner style={{width: '50px', height: '50px'}}
                        strokeWidth="8"
                        fill="var(--surface-ground)"
                        animationDuration=".5s"/>) :
      (<DeflectListComponent deflectStatus={currentStatus}
                             data={ads}
                             loading={loading}
                             totalCount={totalCount}
                             currentPage={page}
                             onPageChange={handlePageChange} refreshData={refreshData}/>)
    }
  </>;
}

export default DeflectListPage;
