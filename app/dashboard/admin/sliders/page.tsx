'use client';
import React, { useEffect, useState } from 'react';
import { ISliders } from './(models)/sliders';
import { getAllSliders } from './(services)/sliders.service';
import SliderList from './(shared-components)/sliderList';

const SlidersPage = () => {
    const [data, setData] = useState<ISliders[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const fetchData = async (page: number) => {
        try {
            setLoading(true);
            const response = await getAllSliders(page);
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
    return <SliderList data={data} loading={loading} totalCount={totalCount} currentPage={currentPage} onPageChange={handlePageChange} refreshData={refreshData} />;
};

export default SlidersPage;
