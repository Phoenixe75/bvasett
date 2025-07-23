'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { LayoutContext } from '../layout/context/layoutcontext';
import { usePathname, useRouter } from 'next/navigation';
import { StyleClass } from 'primereact/styleclass';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { NodeRef } from '@/types';
import { classNames } from 'primereact/utils';
import { useUserContext } from './context/usercontext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { getActiveSettings } from '@/app/dashboard/admin/setting/(services)/setting.service';
import { ISetting } from '@/app/dashboard/admin/setting/(models)/setting';
import defaultImage from '../public/images/def.png';
import Image  from 'next/image';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import Cookies from 'js-cookie';
import { logoutUser } from '@/app/api/api';
import { toast } from 'react-toastify';

const AppHeader = ({ toggleMenuItemClick, isHidden, loadingIsFinished , setIsHidden }: any) => {
    const { layoutConfig } = useContext(LayoutContext);
    const { user, loading } = useUserContext();

    const [data, setData] = useState<ISetting>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const menuRef = useRef<HTMLElement | null>(null);
    const userMenuRef:any = useRef(null);
    const router = useRouter();
    const pathname = usePathname();


    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await getActiveSettings();
            setData(res);
        } catch (error) {
            setError('خطا در دریافت تنظیمات');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    useEffect(()=> {
        if(!loading && !isLoading && loadingIsFinished){
            loadingIsFinished();
            window.scroll({top:0})
        }
    },[loading, isLoading])
    useEffect(() => {
        window.scroll({top:0})
    },[pathname])
    const logoutFunc = async () => {
        const token = Cookies.get('authToken');
        if (token) {
            try {
                await logoutUser();
                Cookies.remove('authToken');
                toast.success("فرآیند خروج با موفقیت انجام شد");
                setTimeout(() => {
                    window.location.reload()
                }, 1500);
            } catch (error) {
                console.error('Logout failed!', error);
                toast.error('خروج شما موفقیت آمیز نبود. لطفا مجددا تلاش کنید.');
            }
        } else {
            console.log('No auth token found for logout.');
        }
    };
    const navigateToPanel = () => {
        let routerPath= '';
        if (!user?.is_admin && user?.is_staff ) {
            routerPath ='/dashboard/admin/ads'
        }
        if(user?.is_staff && user?.is_admin){
            routerPath = "/dashboard/admin/admin-panel"
        }
        if(!user?.is_staff && !user?.is_admin && user?.mobile){
            routerPath = '/dashboard/user/user-details'
        }
        router.push(routerPath)
    }
    if (loading || isLoading) return <ProgressSpinner style={{ width: '50px', height: '50px' }} />;
    if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;
    const userMenuItems: MenuItem[] = [
        {
            label: 'پنل کاربری',
            icon: 'pi pi-user ml-2',
            command: navigateToPanel,
        },
        {
            label: 'خروج',
            icon: 'pi pi-sign-out text-red ml-2',
            command: logoutFunc
        },
    ];
    const userMenu = () => {
        if(!user){
            return;
        }
        return (
            <>
                <Menu model={userMenuItems} popup ref={userMenuRef} />
                 <div className='flex gap-1'>
                    {!loading && !user?.is_staff && !user?.is_admin && user?.mobile ? <Button raised label="ثبت آگهی" text rounded className="border-1 border-red-500 font-light line-height-2 text-gray-100 customBtn" onClick={() => router.push('/dashboard/user/submit-ad')} />: null}
                    <Button  onClick={(event) => {
                        if (userMenuRef) {
                            userMenuRef?.current?.toggle(event);
                        }
                    }}>
                    <i
                        className="pi pi-user text-primary cursor-pointer"
                        aria-label="Menu"
                    />
                    حساب کاربری
                    </Button>
                   
                </div>
            </>
        );
    };
    return (
        // style={{ backgroundColor: '#083b19' }}
        <div className="py-4 px-4 mx-0 lg:px-8 flex align-items-center justify-content-between relative headerColor fixed-top header">
            <h1 className="header-text">اینجا محل آگهی واسطه‌ها <span>نیست</span></h1>
            <Link href="/" className="flex align-items-center">
                <Image src={data?.logo && typeof data?.logo === 'string' ? data?.logo : defaultImage} alt="Preview" width={50} height={50} style={{ objectFit: 'cover' }} />
                <Image src={"/images/logo-fa.png"} alt="logo" width={70} height={70} style={{ objectFit: 'cover' }} />
                {/* <img src={`/layout/images/${layoutConfig.colorScheme === 'light' ? 'logo-dark' : 'logo-white'}.svg`} alt="bvasett Logo" height="50" className="mr-0 lg:mr-2" /> */}
            </Link>
            <StyleClass nodeRef={menuRef as NodeRef} selector="@next" enterClassName="hidden" leaveToClassName="hidden" hideOnOutsideClick>
                <i ref={menuRef} className="pi pi-bars text-4xl cursor-pointer block lg:hidden text-700 miniMenu"></i>
            </StyleClass>
            {/* , backgroundColor: '#083b19' */}
            <div className={classNames('align-items-center flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 px-6 lg:px-0 z-2 mr-3 navcolor', { hidden: isHidden })} style={{ top: '100%', backgroundColor: 'transparent' }}>
                <ul className="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row cursor-pointer">
                    <li>
                        <Link href="/" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 hover:text-cyan-700 font-medium line-height-3 align-items-center gap-2">
                            <i className="pi pi-home"></i>
                            <span>صفحه اصلی</span>
                            <Ripple />
                        </Link>
                    </li>
                    {/* <li>
                        <Link href="/filter" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 hover:text-cyan-700 font-medium line-height-3 align-items-center gap-2">
                            <span>جستجوی ملک</span>
                            <Ripple />
                        </Link>
                    </li> */}
                    <li>
                        <Link href="/articles" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 hover:text-cyan-700 font-medium line-height-3 align-items-center gap-2">
                            <i className="pi pi-book"></i>
                            <span>مقالات</span>
                            <Ripple />
                        </Link>
                    </li>
                    <li>
                        <Link href="/about" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 hover:text-cyan-700 font-medium line-height-3 align-items-center gap-2">
                            <i className="pi pi-info-circle"></i>
                            <span>درباره ما</span>
                            <Ripple />
                        </Link>
                    </li>
                    <li>
                        <Link href="/contact" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 hover:text-cyan-700 font-medium line-height-3 align-items-center gap-2">
                            <i className="pi pi-comments"></i>
                            <span>پشتیبانی</span>
                            <Ripple />
                        </Link>
                    </li>
                </ul>
                <div className="flex justify-content-between border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
                    {loading && <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />}
                    {!loading && !user && (
                        <Button raised label="ورود / ثبت نام" icon="pi-sign-in pl-2 pt-1 text-lg" text rounded className="border-1 border-red-500 font-light line-height-2 text-gray-100 customBtn  login-btn" onClick={() => router.push('/auth/login')} />
                    )}
                  {userMenu()}
                </div>
            </div>
        </div>
    );
};

export default AppHeader;
