'use client';
import React, { useContext, useState } from 'react';
import { classNames } from 'primereact/utils';
import CheckUser from '@/app/components/checkUser';
import CheckOTP from '@/app/components/CheckOTP';
import CheckPassword from '@/app/components/CheckPassword';
import { LayoutContext } from '@/layout/context/layoutcontext';
import authLogo from '../../../../public/images/logo-new.png';
import Image from 'next/image';
const Login = ({onlyForm}:any) => {
    const [formState, setFormState] = useState(1);
    const [userData, setUserData] = useState(null);

    const { layoutConfig } = useContext(LayoutContext);

    const containerClassName = onlyForm ? '' : classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
              <Image src={authLogo} alt="Bvasett logo" className="mt-3 mb-5 w-6rem flex-shrink-0" />
                {/*<img src={authLogo} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />*/}
                <div
                    style={{
                        borderRadius: '14px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    {formState === 1 && <CheckUser setFormState={setFormState} setUserData={setUserData} userData={userData} />}
                    {formState === 2 && <CheckOTP onlyForm={onlyForm} setFormState={setFormState} userData={userData} />}
                    {formState === 3 && <CheckPassword onlyForm={onlyForm} setFormState={setFormState} userData={userData} />}
                </div>
            </div>
        </div>
    );
};

export default Login;
