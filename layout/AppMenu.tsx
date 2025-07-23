/* eslint-disable @next/next/no-img-element */

import React from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';
import User from '@/app/components/User';
import { useUserContext } from './context/usercontext';
import Cookies from 'js-cookie';
import { logoutUser } from '@/app/api/api';
import { toast } from 'react-toastify';

const AppMenu = () => {
    const { user } = useUserContext();

    const logoutFunc = async () => {
        const token = Cookies.get('authToken');
        if (token) {
            try {
                await logoutUser();
                Cookies.remove('authToken');
                toast.success("فرآیند خروج با موفقیت انجام شد");
            } catch (error) {
                console.error('Logout failed!', error);
                toast.error('خروج شما موفقیت آمیز نبود. لطفا مجددا تلاش کنید.');
            }
        } else {
            console.log('No auth token found for logout.');
        }
    };
    const adminItems =
        user?.is_staff && user?.is_admin
            ? [
                  { label: 'پنل کاربری', icon: 'pi pi-fw pi-microsoft ml-2', to: '/dashboard/admin/admin-panel' },
                  { label: 'کلمه عبور', icon: 'pi pi-fw pi-key ml-2', to: '/dashboard/user/my-password' },
                  { label: 'مدیریت کاربران', icon: 'pi pi-fw pi-users ml-2', to: '/dashboard/admin/users' },
                  { label: 'مدیریت آگهی‌ها', icon: 'pi pi-fw pi-box ml-2', to: '/dashboard/admin/ads' },
                  { label: 'تیکت‌های کاربران', icon: 'pi pi-fw pi-envelope ml-2', to: '/dashboard/admin/users-tickets' },
                  { label: 'سوالات کاربران', icon: 'pi pi-fw pi-question ml-2', to: '/dashboard/admin/users-questions' },
                  { label: 'لیست قیمت‌گذاری‌ها', icon: 'pi pi-fw pi-box ml-2', to: '/dashboard/admin/packages' },
                  { label: 'مدیریت اشتراک ها', icon: 'pi pi-box ml-2', to: '/dashboard/admin/subscription-plan-manager' },
                  { label: 'اشتراک ها', icon: 'pi pi-box ml-2', to: '/dashboard/admin/subscriptions' },
                  { label: 'لیست تخیفات', icon: 'pi pi-fw pi-gift ml-2', to: '/dashboard/admin/discounts' },
                  { label: 'لیست خریدها', icon: 'pi pi-shopping-bag ml-2', to: '/dashboard/admin/list-payments' },
                  { label: 'لیست مقالات', icon: 'pi pi-fw pi-book ml-2', to: '/dashboard/admin/articles' },
                  { label: 'اسلایدر', icon: 'pi pi-fw pi-images ml-2', to: '/dashboard/admin/sliders' },
                  { label: 'تنظیمات سایت', icon: 'pi pi-fw pi-cog ml-2', to: '/dashboard/admin/setting' },
                  { label: 'لیست درخواست آگهی‌ها', icon: 'pi pi-fw pi-home ml-2', to: '/dashboard/admin/properties' },
                  { label: 'علاقه‌مندی ها', icon: 'pi pi-fw pi-home ml-2', to: '/dashboard/admin/my-favorites' }
              ]
            : user?.is_staff
            ? [
                  { label: 'کلمه عبور', icon: 'pi pi-fw pi-key ml-2', to: '/dashboard/admin/password' },
                  { label: 'مدیریت کاربران', icon: 'pi pi-fw pi-users ml-2', to: '/dashboard/admin/users' },
                  { label: 'مدیریت آگهی‌ها', icon: 'pi pi-fw pi-box ml-2', to: '/dashboard/admin/ads' },
                  { label: 'تیکت‌های کاربران', icon: 'pi pi-fw pi-envelope ml-2', to: '/dashboard/admin/users-tickets' },
                  { label: 'سوالات کاربران', icon: 'pi pi-fw pi-question ml-2', to: '/dashboard/admin/users-questions' },
                  { label: 'لیست مقالات', icon: 'pi pi-fw pi-book ml-2', to: '/dashboard/admin/articles' },
                  { label: 'علاقه‌مندی ها', icon: 'pi pi-fw pi-home ml-2', to: '/dashboard/admin/my-favorites' }
              ]
            : [
                  { label: 'مشخصات فردی', icon: 'pi pi-fw pi-user ml-2', to: '/dashboard/user/user-details' },
                  { label: 'کلمه عبور', icon: 'pi pi-fw pi-key ml-2', to: '/dashboard/user/my-password' },
                  { label: 'تیکت‌های من', icon: 'pi pi-fw pi-envelope ml-2', to: '/dashboard/user/my-tickets' },
                  { label: 'سوالات', icon: 'pi pi-fw pi-question ml-2', to: '/dashboard/user/my-questions' },
                  { label: 'لیست خریدها', icon: 'pi pi-fw pi-shopping-cart ml-2', to: '/dashboard/user/my-payments' },
                  { label: 'لیست اشتراک‌ها', icon: 'pi pi-fw pi-shopping-cart ml-2', to: '/dashboard/user/my-subscriptions' },
                  { label: 'لیست درخواست آگهی‌ها', icon: 'pi pi-fw pi-home ml-2', to: '/dashboard/user/submit-ad' },
                  { label: 'علاقه‌مندی ها', icon: 'pi pi-fw pi-home ml-2', to: '/dashboard/user/my-favorites' }
              ];

    const model: AppMenuItem[] = [
        {
            label: ' ',
            items: adminItems
        },
        {
            label: '',
            items: [
                {
                    label: 'خروج',
                    icon: 'pi pi-fw pi-sign-out text-red-500',
                    to: '/',
                    command: () => {
                        logoutFunc();
                    }
                }
            ]
        }
    ];

    return (
        <MenuProvider>
            <User />
            <ul className="layout-menu">
                {model.map((item, i) => (
                    <React.Fragment key={item.label}>
                        <AppMenuitem item={item} root={true} index={i} />
                    </React.Fragment>
                ))}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
