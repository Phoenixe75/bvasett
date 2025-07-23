'use client';
import React, { useEffect, useState } from 'react';

import PackagesList from './(shared-components)/packages-list';
import { PlansItem } from './(models)/planManager.models';
import { getSubscriptionsPlanList } from './(services)/packages.service';

const AdsPage = () => {
    const [data, setData] = useState<PlansItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getSubscriptionsPlanList();
            setData(response);
            setTotalCount(response.length);
        } catch (error) {
            console.error('Error retrieving package:', error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(()=> {
        fetchData()
    },[])
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const refreshData = async () => {
        await fetchData();
    };
    return <PackagesList data={data} loading={loading} totalCount={totalCount} currentPage={currentPage} onPageChange={handlePageChange} refreshData={refreshData} />;
};

export default AdsPage;
