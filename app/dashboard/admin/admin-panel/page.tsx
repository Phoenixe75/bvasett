'use client';
import React, { useEffect, useState } from 'react';
import { useUserContext } from '@/layout/context/usercontext';
import ItemPanel from './(shared-components)/item-panel';
import { IPanel } from './(models)/item-panel';
import { getOverview } from './(services)/item-panel.service';

const Dashboard = () => {
    const { user } = useUserContext();
    const [data, setData] = useState<IPanel>();
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getOverview();
            setData(response);
        } catch (error) {
            console.error('Error retrieving items:', error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (!user?.is_admin) {
        return <div>دسترسی غیر مجاز</div>;
    }

    return <ItemPanel data={data} loading={loading} />;
};

export default Dashboard;
