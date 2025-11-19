'use client';

import React, {FC, useEffect, useRef, useState} from 'react';
import {PageParams} from '@/types/layout';
import {AdCompleteStatusEnumType} from '@/app/dashboard/admin/defect-management/(models)/types';
import {IAds} from '@/app/dashboard/admin/ads/(models)/ads';
import {getAdsByCompleteStatus} from '@/app/dashboard/admin/defect-management/(services)/deflect-management.service';
import {AdCompleteStatusEnum} from '@/app/dashboard/admin/defect-management/(models)/ad-complete-status.enum';
import DeflectList from '@/app/dashboard/admin/defect-management/(shared-components)/deflectList';
import {ProgressSpinner} from 'primereact/progressspinner';

const DeflectListPage: FC<PageParams> = ({params}: any) => {

  const [ads, setAds] = useState<IAds[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const currentStatus = useRef(AdCompleteStatusEnum.incomplete);

  useEffect(() => {
    if (params != null && params.status as AdCompleteStatusEnumType !== currentStatus.current) {
      currentStatus.current = params.status as AdCompleteStatusEnumType;
      fetchData(currentPage);
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
    await fetchData(currentPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  return <>
    {loading ?
      (<ProgressSpinner style={{ width: '50px', height: '50px' }}
                        strokeWidth="8"
                        fill="var(--surface-ground)"
                        animationDuration=".5s" />) :
      (<DeflectList deflectStatus={currentStatus}
                    data={ads}
                    loading={loading}
                    totalCount={totalCount}
                    currentPage={currentPage}
                    onPageChange={handlePageChange} refreshData={refreshData}/>)
    }
  </>;
}

export default DeflectListPage;
