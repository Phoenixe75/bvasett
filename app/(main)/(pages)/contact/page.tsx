'use client';
import Ticket from '@/app/components/Ticket';
import AppHeader from '@/layout/AppHeader';
import Head from 'next/head';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useState } from 'react';

const Contact = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <>
            <AppHeader />
            <div className="flex flex-column">
            <div className="flex flex-column pt-4 px-4 lg:px-8 overflow-hidden lg:block carousel-custom">
                <div
                    className="flex flex-column pt-4 overflow-hidden "
                >
                    <div className="p-d-flex p-dir-column p-ai-center p-jc-center p-mt-5">
                        <Head>
                            <title>تماس با ما</title>
                            <meta name="description" content="صفحه تماس با ما در شرکت املاک" />
                        </Head>

                        <main className="p-p-3 w-full p-shadow-2 p-border-round">
                            <h1 className="p-text-2xl p-mb-4">تماس با ما</h1>
                            {submitted ? (
                                <div className="p-text-lg p-mb-3">متشکریم! پیام شما با موفقیت ارسال شد.</div>
                            ) : (
                                <form onSubmit={handleSubmit} >
                                    <div className="field grid">
                                        <label htmlFor="name" className="col-12 text-sm font-medium mb-2 text-800">
                                            نام:
                                        </label>
                                        <div className="col-12">
                                        <InputText id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="p-inputtext w-full" required />
                                        </div></div>

                                    <div className="field grid">
                                        <label htmlFor="email" className="col-12 text-sm font-medium mb-2 text-800">
                                            ایمیل:
                                        </label>
                                        <div className="col-12">
                                        <InputText id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="p-inputtext w-full" required />
                                        </div></div>

                                    <div className="field grid">
                                        <label htmlFor="message" className="col-12 text-sm font-medium mb-2 text-800">
                                            پیام:
                                        </label>
                                        <div className="col-12">
                    <InputTextarea id="message" name="message" value={message} onChange={(e) => setMessage( e.target.value)} required className="w-full p-inputtextarea" rows={6} />
                </div>
                                        </div>

                                    <button type="submit" className="p-button p-component p-button-primary">
                                        ارسال
                                    </button>
                                </form>
                            )}

                            <div className="p-mt-4 p-text-lg">یا می‌توانید با ما از طریق شماره تماس یا آدرس زیر در ارتباط باشید:</div>
                            <div className="p-mt-2 p-text-lg">شماره تماس: <a href="tel:+982122644855"><b style={{fontSize: '18px'}}>02122644855</b></a></div>
                            {/*<div className="p-text-lg">آدرس: خیابان شریعتی، نبش مترو شریعتی، ساختمان 100، طبقه ۲، واحد 4</div>*/}
                        </main>
                    </div>
                </div>
            </div>
                <div className="flex">
                <div className="col-12 md:p-8">
                            <div className="flex flex-column justify-content-center align-items-center text-center px-3 py-3 md:py-0">
                                <h3 className="text-gray-900 mb-2">ارسال تیکت</h3>
                                <Ticket />
                            </div>
                        </div>
                </div>
            </div>
            
        </>
    );
};

export default Contact;
