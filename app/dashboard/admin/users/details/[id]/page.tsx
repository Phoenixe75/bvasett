'use client';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { IUsers } from '../../(models)/users';
import { PageParams } from '@/types/layout';
import { getUserDetails } from '@/app/dashboard/user/user-details/(services)/user-detail-service';
import { useRouter } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const UserDetailsPage: FC<PageParams> = ({ params }: any) => {
    const [user, setUser] = useState<IUsers | null>(null);
    const loading = useRef(false);
    const router = useRouter();

    const loadUser = useCallback(async () => {
        loading.current = true;
        const getData: IUsers = await getUserDetails(+params.id);
        setUser(getData);
        loading.current = false;
    }, [params.id]);

    useEffect(() => {
        if (!loading.current) loadUser();
    }, [loadUser]);

    const back = (): void => {
        router.push('../');
    };

    return (
        <div className="card detailsData">
            <h5>مشاهده کاربر</h5>
            <hr />
            <div className="grid p-fluid mt-6">
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="first_name" value={user?.first_name || ''} readOnly />
                        <label htmlFor="first_name">نام</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="last_name" value={user?.last_name || ''} readOnly />
                        <label htmlFor="last_name">نام خانوادگی</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="national_id" value={user?.national_id || ''} readOnly />
                        <label htmlFor="national_id">شماره ملی</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="email" value={user?.email || ''} readOnly />
                        <label htmlFor="email">ایمیل</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="mobile" value={user?.mobile || ''} readOnly />
                        <label htmlFor="mobile">شماره موبایل</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="address" value={user?.address || ''} readOnly />
                        <label htmlFor="address">آدرس</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="postal_code" value={user?.postal_code || ''} readOnly />
                        <label htmlFor="postal_code">کد پستی</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="state_label" value={user?.state_label || ''} readOnly />
                        <label htmlFor="state_label">استان</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="city_label" value={user?.city_label || ''} readOnly />
                        <label htmlFor="city_label">شهر</label>
                    </span>
                </div>
            </div>
            <div>
                <Button raised label="بازگشت" className="bg-gray-300 text-color border-0 mt-2" onClick={back} />
            </div>
        </div>
    );
};

export default UserDetailsPage;
