'use client';
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

const Password = () => {
    return (
        <div className="grid">
            <div className="col-12 md:col-12">
                <div className="card">
                    <h5>بازیابی رمز عبور</h5>
                    <hr />
                    <div className="flex flex-column gap-2 col-12">
                        <div className="flex flex-column gap-2 lg:col-6 col-12">
                            <label htmlFor="username">رمز عبور جدید</label>
                            <InputText id="username" aria-describedby="username-help" />
                        </div>
                        <div className="flex flex-column gap-2 lg:col-6 col-12">
                            <label htmlFor="username">تکرار رمز عبور جدید</label>
                            <InputText id="username" aria-describedby="username-help" />
                        </div>
                    </div>
                </div>

                <div className="">
                    <Button raised label="بروز رسانی" className="bg-blue-700 text-white"></Button>
                </div>
            </div>
        </div>
    );
};

export default Password;
