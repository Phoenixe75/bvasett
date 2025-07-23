/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import { ISetting } from '@/app/dashboard/admin/setting/(models)/setting';
import { getActiveSettings } from '@/app/dashboard/admin/setting/(services)/setting.service';
import { ProgressSpinner } from 'primereact/progressspinner';
import Image from 'next/image';
import defaultImage from '../public/images/def.png';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const [showBox, setShowBox] = useState<boolean>(false);
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

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

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const handleShow = () => {
        setShowBox(!showBox);
    };

    const handleHide = () => {
        setShowBox(false);
    };

    if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                {isLoading ? (
                    <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                ) : (
                    <>
                        <Image src={data?.logo && typeof data?.logo === 'string' ? data?.logo : defaultImage} alt="Preview" width={47} height={35} style={{ objectFit: 'cover' }} />
                        <span>{data?.site_name}</span>
                    </>
                )}
                {/* <img src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height={'35px'} alt="logo" /> */}
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <button type="button" className="p-link layout-topbar-button" onClick={handleShow} onBlur={handleHide}>
                    <i className="pi-circle-on text-red-500 circleNotif"></i>
                    <i className="pi-bell ml-2" style={{ fontStyle: 'normal' }}></i>
                    <span>پیام ها</span>
                </button>
                {showBox && <div className="ShowBox">کاربر عزیز لطفا جهت حفظ امنیت حساب کاربری خود به قسمت رمز عبور در بخش داشبورد رفته و برای خود رمز عبور تعریف کنید</div>}
                {/* <Link href="/cart">
                    <button type="button" className="p-link layout-topbar-button">
                        <i className="pi-shopping-cart ml-2" style={{ fontStyle: 'normal' }}></i>
                        <span>سبد خرید</span>
                    </button>
                </Link> */}
                {/* <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-user"></i>
                    <span>Profile</span>
                </button> */}
                <Link href="/">
                    <button type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-home ml-2"></i>
                        <span>صفحه اصلی</span>
                    </button>
                </Link>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
