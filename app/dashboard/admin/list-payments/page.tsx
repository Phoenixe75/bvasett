'use client';
import React, { useEffect, useState } from 'react';
import { getAllOrders } from './(services)/payment.service';
import { IOrders } from './(models)/payment';
import OrderList from './(shared-components)/payments-list';

const ListPayments = () => {
    const [data, setData] = useState<IOrders[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const fetchData = async (page: number) => {
        try {
            setLoading(true);
            const response = await getAllOrders(page);
            setData(response.results);
            setTotalCount(response.count);
        } catch (error) {
            console.error('Error retrieving Orders:', error);
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
    return <OrderList data={data} loading={loading} totalCount={totalCount} currentPage={currentPage} onPageChange={handlePageChange} refreshData={refreshData} />;
};

export default ListPayments;
