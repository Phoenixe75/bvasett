'use client';
import React, { useEffect, useState } from 'react';
import MyQuestionsList from './(shared-components)/question-list';
import { getAllQuestions } from '../../admin/users-questions/(services)/questions.service';
import { IQuestions } from '../../admin/users-questions/(models)/questions';

const MyQuestiontPage = () => {
    const [data, setData] = useState<IQuestions[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const fetchData = async (page: number) => {
        try {
            setLoading(true);
            const response = await getAllQuestions(page);
            setData(response.results);
            setTotalCount(response.results.length);
        } catch (error) {
            console.error('Error retrieving questions:', error);
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

    return <MyQuestionsList data={data} loading={loading} totalCount={totalCount} currentPage={currentPage} onPageChange={handlePageChange} refreshData={refreshData} />;
};

export default MyQuestiontPage;
