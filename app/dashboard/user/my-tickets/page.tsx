'use client';
import React, { useEffect, useState } from 'react';
import { ITickets } from '../../admin/users-tickets/(models)/tickets';
import MyTicketsList from './(shared-components)/ticket-list';
import { getAllTickets } from '../../admin/users-tickets/(services)/tickets.service';

const MyTicketPage = () => {
    const [data, setData] = useState<ITickets[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const fetchData = async (page: number) => {
        try {
            setLoading(true);
            const response = await getAllTickets(page);
            setData(response.results);
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

    return <MyTicketsList data={data} loading={loading} totalCount={totalCount} currentPage={currentPage} onPageChange={handlePageChange} refreshData={refreshData} />;
};

export default MyTicketPage;
