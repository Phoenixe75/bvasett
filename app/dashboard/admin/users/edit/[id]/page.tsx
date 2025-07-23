'use client';
import { PageParams } from '@/types/layout';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { IUsers } from '../../(models)/users';
import { getUserDetails, updateUserDetails } from '@/app/dashboard/user/user-details/(services)/user-detail-service';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { toast } from 'react-toastify';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useUserContext } from '@/layout/context/usercontext';

const UserEditPage: FC<PageParams> = ({ params }: any) => {
    const { user } = useUserContext();
    const [loading, setLoading] = useState<boolean>(true);
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
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (params.id != null) {
                    const data = await getUserDetails(+params.id);
                    setFormData(data);
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
    }, [params.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        setFormData((prevData: any) => ({ ...prevData, is_staff: e.checked }));
    };

    const handleSelect = (name: string, value: any) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            await updateUserDetails(formData.id, formData);
            toast.success('اطلاعات کاربر با موفقیت به روز شد');
            back();
        } catch (error) {
            console.error('Error updating user data:', error);
            toast.error('بروز رسانی اطلاعات کاربر با خطا مواجه شد');
        }
    };

    const back = () => {
        router.push('../');
    };

    if (loading) {
        return <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />;
    }

    return (
        <div className="card detailsData">
            <h5>ویرایش کاربر</h5>
            <hr />
            <div className="grid p-fluid mt-6">
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="first_name" value={formData?.first_name || ''} onChange={handleChange} />
                        <label htmlFor="first_name">نام</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="last_name" value={formData?.last_name || ''} onChange={handleChange} />
                        <label htmlFor="last_name">نام خانوادگی</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="national_id" value={formData?.national_id || ''} onChange={handleChange} />
                        <label htmlFor="national_id">شماره ملی</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="email" value={formData?.email || ''} onChange={handleChange} />
                        <label htmlFor="email">ایمیل</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="mobile" value={formData?.mobile || ''} onChange={handleChange} disabled />
                        <label htmlFor="mobile">شماره موبایل</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="address" value={formData?.address || ''} onChange={handleChange} />
                        <label htmlFor="address">آدرس</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <InputText type="text" name="postal_code" value={formData?.postal_code || ''} onChange={handleChange} />
                        <label htmlFor="postal_code">کد پستی</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown name="state" value={formData.state} onChange={(e) => handleSelect('state', e.value)} options={[]} optionLabel="name" placeholder="انتخاب استان" />
                        <label htmlFor="state">استان</label>
                    </span>
                </div>
                <div className="field col-12 md:col-4">
                    <span className="p-float-label">
                        <Dropdown name="city" value={formData.city} onChange={(e) => handleSelect('city', e.value)} options={[]} optionLabel="name" placeholder="انتخاب شهر" />
                        <label htmlFor="city">شهر</label>
                    </span>
                </div>
                {user?.is_admin && (
                    <div className="flex align-items-center">
                        <Checkbox inputId="is_staff" name="is_staff" checked={formData.is_staff} onChange={handleCheckboxChange} />
                        <label htmlFor="is_staff" className="mr-2">
                            دسترسی ادمین
                        </label>
                    </div>
                )}
            </div>
            <div>
                <Button raised label="بروز‌رسانی" className="bg-primary text-white border-0 mt-2 ml-2" onClick={handleUpdate} />
                <Button raised label="بازگشت" className="bg-gray-300 text-color border-0 mt-2" onClick={back} />
            </div>
        </div>
    );
};

export default UserEditPage;
