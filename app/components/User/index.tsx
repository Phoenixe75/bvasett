'use client';
import Image from 'next/image';
import React from 'react';
import Avatr from '../../../public/demo/images/login/default.png';
import { useUserContext } from '@/layout/context/usercontext';
const User = () => {
    const { user } = useUserContext();

    return (
        <div className="flex align-items-center lg:px-4 lg:pb-0 lg:pt-4">
            <div className="">
                <Image src={Avatr} width={70} height={70} alt="avatar" style={{ borderRadius: '50%' }} />
            </div>
            <div className="flex-column mr-4 ">
                <span className="bg-gray-200 border-round-lg p-2 pt-1">{user?.is_staff ? 'ادمین' : 'کاربر'}</span>
                <h5 className="mb-1">{user?.fullname ? user?.fullname : 'بی نام'}</h5>
                <span>{user?.mobile}</span>
            </div>
        </div>
    );
};

export default User;
