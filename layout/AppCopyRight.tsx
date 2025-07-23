'use client';
import React, { useContext, useEffect, useState } from 'react';
import { LayoutContext } from './context/layoutcontext';
import Image from 'next/image';
import { getActiveSettings } from '@/app/dashboard/admin/setting/(services)/setting.service';
import { ISetting } from '@/app/dashboard/admin/setting/(models)/setting';
import { ProgressSpinner } from 'primereact/progressspinner';
import defaultImage from '../public/images/def.png';

const AppCopyRight = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const [data, setData] = useState<ISetting>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await getActiveSettings();
            setData(res);
            setIsLoading(false);
        } catch (error) {
            setError('خطا در دریافت تنظیمات');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) return <ProgressSpinner style={{ width: '50px', height: '50px' }} />;
    if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

    return (
        <div className="layout-footer">
            {/* <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Logo" height="20" className="ml-2" /> */}
            <Image src={data?.logo && typeof data?.logo === 'string' ? data?.logo : defaultImage} alt="Preview" width={20} height={20} style={{ objectFit: 'cover' }} />
            <span className="font-medium ml-2 text-900">تمامی حقوق این وب سایت محفوظ میباشد</span>
        </div>
    );
};

export default AppCopyRight;
