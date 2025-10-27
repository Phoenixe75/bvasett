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
    const [perPage, setPerPage] = useState<number>(25);

    const fetchData = async (page: number, perPage: number = 15) => {
        try {
            setLoading(true);
            const response = await getAllOrders(page, perPage);
            setData(response.results ?? []);
            setTotalCount(response.count ?? 0);
        } catch (error) {
            console.error('Error retrieving Orders:', error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(currentPage, perPage);
    }, [currentPage, perPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePerPageChange = (perPage: number) => {
        setPerPage(perPage);
    };

    const refreshData = async () => {
        await fetchData(currentPage);
    };
    return <OrderList data={data}
                      loading={loading}
                      totalCount={totalCount}
                      currentPage={currentPage}
                      perPage={perPage}
                      onPageChange={handlePageChange}
                      refreshData={refreshData} />;
};

export default ListPayments;
