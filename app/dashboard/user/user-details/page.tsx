'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

// primereact
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

// context
import { useUserContext } from '@/layout/context/usercontext';

// services
import { getUserDetails, updateUserDetails } from './(services)/user-detail-service';

// models
import { IUsers } from '../../admin/users/(models)/users';
import { ICity, IState } from '../../admin/ads/(models)/ads';

import './style.scss';
import { getCitiesByState, getStates } from '../../admin/ads/(services)/ads.service';
import { toast } from 'react-toastify';

const UserDetails = () => {
    const { user } = useUserContext();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<IUsers>({
        id: 0,
        mobile: null,
        first_name: null,
        last_name: null,
        national_id: null,
        email: null,
        state: null,
        city: null,
        address: null,
        postal_code: null,
        is_staff: false
    });

    const [states, setStates] = useState<IState[]>([]);
    const [cities, setCities] = useState<ICity[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const fetchedStates = await getStates();
                setStates(fetchedStates);
                if (user?.id != null) {
                    const data = await getUserDetails(user.id);
                    setFormData(data);

                    if (data.state !== null) {
                        const fetchedCities = await getCitiesByState(data.state);
                        setCities(fetchedCities);
                    } else {
                        console.warn('State is null');
                        setCities([]);
                    }
                } else {
                    console.warn('User ID is undefined or null');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user?.id]);

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            await updateUserDetails(formData.id, formData);
            toast.success('اطلاعات کاربر با موفقیت به روز شد!');
        } catch (error) {
            console.error('Error updating user data:', error);
            toast.error('بروز رسانی اطلاعات کاربر با خطا مواجه شد!');
        }
    };

    const handleStateChange = async (e: any) => {
        const selectedStateId = e.value.id;
        setFormData((prev) => ({ ...prev, state: selectedStateId, city: null }));

        try {
            const fetchedCities = await getCitiesByState(selectedStateId);
            setCities(fetchedCities);
        } catch (error) {
            console.error('Failed to fetch cities:', error);
        }
    };

    const handleCityChange = (e: any) => {
        const selectedCityId = e.value ? e.value.id : null;
        if (selectedCityId !== null) {
            setFormData((prev) => ({ ...prev, city: selectedCityId }));
        }
    };

    const back = () => router.push('../');

    if (loading) return <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />;

    return (
        <div className="card">
            <h5>مشخصات فردی</h5>
            <hr />
            <div className="grid p-fluid mt-6">
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="first_name" value={formData.first_name || ''} onChange={handleChange} />
                        <label htmlFor="first_name">نام</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="last_name" value={formData.last_name || ''} onChange={handleChange} />
                        <label htmlFor="last_name">نام خانوادگی</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="national_id" value={formData.national_id || ''} onChange={handleChange} />
                        <label htmlFor="national_id">شماره ملی</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="email" value={formData.email || ''} onChange={handleChange} />
                        <label htmlFor="email">ایمیل</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="address" value={formData.address || ''} onChange={handleChange} />
                        <label htmlFor="address">آدرس</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="postal_code" value={formData.postal_code || ''} onChange={handleChange} />
                        <label htmlFor="postal_code">کد پستی</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown
                            type="text"
                            name="state"
                            id="state"
                            value={states.find((option) => option.id === formData.state) || null}
                            onChange={handleStateChange}
                            options={states}
                            optionLabel="name"
                            placeholder="انتخاب کنید"
                            className="w-full"
                        />
                        <label htmlFor="state">استان</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown type="text" name="city" id="city" value={cities.find((option) => option.id === formData.city) || null} onChange={handleCityChange} options={cities} optionLabel="name" placeholder="انتخاب کنید" className="w-full" />
                        <label htmlFor="city">شهر</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4"></div>
                <div className="field col-12 md:col-12">
                    <p style={{color: 'red'}}>
                        در وارد کردن کد ملی خود دقت نمایید،در صورت صحیح نبود کد ملی، امکان تایید نهایی آگهی وجود ندارد.
                    </p>
                </div>
                <div className="field flex col-12 md:col-2">
                    <Button raised label="بروزرسانی" className="bg-green-500 text-white border-0 mt-2 ml-2" onClick={handleUpdate} />
                    <Button raised label="بازگشت" className="bg-gray-300 text-color border-0 mt-2" onClick={back} />
                </div>
            </div>
        </div>
    );
};

export default UserDetails;
