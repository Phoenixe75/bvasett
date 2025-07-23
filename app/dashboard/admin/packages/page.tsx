'use client';
import React, { useEffect, useState } from 'react';
import { getAllPackages } from './(services)/packages.service';
import { IPackages } from './(models)/packages';
import PackagesList from './(shared-components)/packages-list';

const AdsPage = () => {
    const [data, setData] = useState<IPackages[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const fetchData = async (page: number) => {
        try {
            setLoading(true);
            const response = await getAllPackages(page);
            setData(response);
            setTotalCount(response.length);
        } catch (error) {
            console.error('Error retrieving package:', error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const refreshData = async () => {
        await fetchData(currentPage);
    };
    return <PackagesList data={data} loading={loading} totalCount={totalCount} currentPage={currentPage} onPageChange={handlePageChange} refreshData={refreshData} />;
};

export default AdsPage;
