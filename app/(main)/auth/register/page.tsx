/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

const Register = () => {
    const [password, setPassword] = useState('');
    const [confrimPassword, setConfrimPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '14px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '12px', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}>
                        <div className="text-center mb-5">
                            <img src="/demo/images/login/default.png" alt="Image" height="50" className="mb-3" />
                            <div className="text-900 text-3xl font-medium mb-3">ایجاد حساب کاربری</div>
                            {/* <span className="text-600 font-medium">خوش آمدید</span> */}
                        </div>

                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                شماره موبایل
                            </label>
                            <InputText id="email1" type="text" placeholder="09" className="w-full md:w-30rem mb-5 text-left" style={{ padding: '1rem' }} />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                رمز عبور
                            </label>
                            <Password dir="ltr" inputId="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="***" toggleMask className="w-full mb-5 text-right" inputClassName="w-full p-3 md:w-30rem"></Password>
                            <label htmlFor="password2" className="block text-900 font-medium text-xl mb-2">
                                تکرار رمز عبور
                            </label>
                            <Password
                                dir="ltr"
                                inputId="password2"
                                value={confrimPassword}
                                onChange={(e) => setConfrimPassword(e.target.value)}
                                placeholder="***"
                                toggleMask
                                className="w-full mb-5 text-right"
                                inputClassName="w-full p-3 md:w-30rem"
                            ></Password>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox inputId="rememberme1" checked={checked} onClick={() => setChecked(!checked)} className="ml-2"></Checkbox>
                                    <label htmlFor="rememberme1">تایید قوانین سایت</label>
                                </div>
                                <a className="font-medium no-underline ml-2 text-left cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    رمز خود را فراموش کردید؟
                                </a>
                            </div>
                            <Button raised label="ورود" className="w-full p-3 text-xl" onClick={() => router.push('/')} disabled={checked === false}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
