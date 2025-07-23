'use client';
import React, { useEffect, useState } from 'react';
import { ITickets } from '../../admin/users-tickets/(models)/tickets';
import { getAllTickets } from '../../admin/users-tickets/(services)/tickets.service';
import MyPropertiesList from './(components)/propertiesList';
import LoadingPage from '@/app/components/LoadingPage';
import { getProperties } from './(services)/submitAd.service';
import { PropertiesResponse } from './(models)/submitAd.types';

const MyPropertiesPage = () => {
    const [data, setData] = useState<PropertiesResponse>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const fetchData = async (page: number) => {
        try {
            setLoading(true);
            const response = await getProperties(page);
            setData(response);
        } catch (error) {
            console.error('Error retrieving tickets:', error);
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
    if( loading) {
      return <LoadingPage />
    }
    return <MyPropertiesList data={data} loading={loading} totalCount={totalCount} currentPage={currentPage} onPageChange={handlePageChange} refreshData={refreshData} />;
};

export default MyPropertiesPage;
