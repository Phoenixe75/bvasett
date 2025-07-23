'use client';
import React, { useEffect, useState } from 'react';
import SettingList from './(shared-components)/settingList';
import { ISettings } from './(models)/setting';
import { getAllSettings } from './(services)/setting.service';

const SettingPage = () => {
    const [data, setData] = useState<ISettings[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const fetchData = async (page: number) => {
        try {
            setLoading(true);
            const response = await getAllSettings(page);
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
    return <SettingList data={data} loading={loading} totalCount={totalCount} currentPage={currentPage} onPageChange={handlePageChange} refreshData={refreshData} />;
};

export default SettingPage;
