'use client';
import React, { useContext, useEffect, useState } from 'react';
import { LayoutContext } from './context/layoutcontext';
import Link from 'next/link';
import Image from 'next/image';
import { ISetting } from '@/app/dashboard/admin/setting/(models)/setting';
import { ProgressSpinner } from 'primereact/progressspinner';
import { getActiveSettings } from '@/app/dashboard/admin/setting/(services)/setting.service';
import defaultImage from '../public/images/def.png';

const enamadString = `<a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=589924&Code=CpfU0Fsbo7qJopcDX61r4j16fXaHchU0'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=589924&Code=CpfU0Fsbo7qJopcDX61r4j16fXaHchU0' alt='' style='cursor:pointer' code='CpfU0Fsbo7qJopcDX61r4j16fXaHchU0'></a>`;

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const [data, setData] = useState<ISetting>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await getActiveSettings();
            setData(res);
            setIsLoading(false);
        } catch (error) {
            setError('خطا در دریافت تنظیمات');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handler for opening external links
    const handleExternalLinkClick = (url: any) => {
        window.open(url, 'Popup', 'toolbar=no, scrollbars=no, location=no, statusbar=no, menubar=no, resizable=0, width=450, height=630, top=30');
    };

    if (isLoading) return <ProgressSpinner style={{ width: '50px', height: '50px' }} />;
    if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

    return (
        <div className="grid justify-content-between">
            <div className="col-12 md:col-10 lg:col-10">
                <div className="grid text-center md:text-right">
                    {/* Contact Section */}
                    <div className="col-12 md:col-3 mt-4 md:mt-0">
                        <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">تماس با ما</h4>
                        <a className="line-height-3 text-md block cursor-pointer mb-2 text-900">جستجوی ملک</a>
                        <a className="line-height-3 text-md block cursor-pointer mb-2 text-900">ارسال تیکت</a>
                        <a href={'/faq'} className="line-height-3 text-md block cursor-pointer mb-2 text-900">سوالات متداول</a>
                        <a className="line-height-3 text-md block cursor-pointer text-900">املاک سپرده شده</a>
                    </div>

                    {/* About Us Section */}
                    <div className="col-12 md:col-2 mt-4 md:mt-0">
                        <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">درباره ما</h4>
                        <a className="line-height-3 text-md block cursor-pointer mb-2 text-900">فروش</a>
                        <a className="line-height-3 text-md block cursor-pointer mb-2 text-900">اجاره</a>
                        <a className="line-height-3 text-md block cursor-pointer text-900">رهن</a>
                        <Link href={'/rules_and_regulations'} className="line-height-3 text-md block cursor-pointer text-900">
                            قوانین و مقررات
                        </Link>
                    </div>
                    <div className="col-12 md:col-7 mt-4 md:mt-0 grid">
                        {/* Trust Seal Section */}
                        <div className="col-12 md:col-3 mt-4 md:mt-0" 
                        // dangerouslySetInnerHTML={{ __html: enamadString }}
                        >
                            {/* <Link target='_blank' rel="noopener noreferrer" href="https://trustseal.enamad.ir/?id=589924&code=CpfU0Fsbo7qJopcDX61r4j16fXaHchU0">
                                    <Image src="https://trustseal.enamad.ir/logo.aspx?id=589924&Code=CpfU0Fsbo7qJopcDX61r4j16fXaHchU0" alt="Enamad" style={{ cursor: 'pointer' }} width={130} height={130} />
                            </Link> */}
                            <Link href="https://trustseal.enamad.ir/?id=589924&code=CpfU0Fsbo7qJopcDX61r4j16fXaHchU0" target="_blank" referrerPolicy="origin">
                                <Image src="https://trustseal.enamad.ir/logo.aspx?id=589924&Code=CpfU0Fsbo7qJopcDX61r4j16fXaHchU0" alt="Enamad" style={{ cursor: 'pointer' }} width={130} height={130} loading="lazy" />
                            </Link>
                            {/* <div dangerouslySetInnerHTML={{__html:enamadString}}></div> */}
                            {/* <a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=589924&Code=CpfU0Fsbo7qJopcDX61r4j16fXaHchU0'><img referrerPolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=589924&Code=CpfU0Fsbo7qJopcDX61r4j16fXaHchU0' alt='' style={{cursor:'pointer'}} code='CpfU0Fsbo7qJopcDX61r4j16fXaHchU0'/></a> */}
                        </div>

                        {/* Media Section */}
                        <div className="col-12 md:col-3 mt-4 md:mt-0">
                            <Image
                                id="rgvjjzpeoeuknbqesizpapfu"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleExternalLinkClick('https://logo.samandehi.ir/Verify.aspx?id=378295&p=xlaojyoemcsiuiwkpfvldshw')}
                                alt="logo-samandehi"
                                src="https://logo.samandehi.ir/logo.aspx?id=378295&p=qftiyndtaqgwodrfbsiyujyn"
                                width={130}
                                height={130}
                            />
                        </div>
                        {/* Eanjoman Section */}
                        {/* <div className="col-12 md:col-3 mt-4 md:mt-0">
                            <Image
                                id="rgvjjzpeoeuknbqesizpapfui"
                                style={{ cursor: 'pointer' }}
                                // onClick={() => handleExternalLinkClick('https://eanjoman.ir/member/3173')}
                                alt="انجمن صنفی کارفرمایی فروشگاه های اینترنتی شهر تهران(کسب و کار های اینترنتی)"
                                src="https://eanjoman.ir/api/script?code=0geYuhHYZr4xJ1HlVwhxdKA4s"
                                width={130}
                                height={130}
                            />
                        </div> */}
                        <div id="zarinpal" className="col-12 md:col-3 mt-4 md:mt-0">
                            <Image width={60} height={85} src="https://cdn.zarinpal.com/badges/trustLogo/1.png" alt="دروازه پرداخت معتبر" onClick={() => handleExternalLinkClick('https://www.zarinpal.com/trustPage/' + window.location.hostname)} />
                        </div>
                        <div className="col-12 md:col-3 mt-4 md:mt-0">
                            <img
                                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjM2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCTxwYXRoIGQ9Im0xMjAgMjQzbDk0LTU0IDAtMTA5IC05NCA1NCAwIDEwOSAwIDB6IiBmaWxsPSIjODA4Mjg1Ii8+Cgk8cGF0aCBkPSJtMTIwIDI1NGwtMTAzLTYwIDAtMTE5IDEwMy02MCAxMDMgNjAgMCAxMTkgLTEwMyA2MHoiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDo1O3N0cm9rZTojMDBhZWVmIi8+Cgk8cGF0aCBkPSJtMjE0IDgwbC05NC01NCAtOTQgNTQgOTQgNTQgOTQtNTR6IiBmaWxsPSIjMDBhZWVmIi8+Cgk8cGF0aCBkPSJtMjYgODBsMCAxMDkgOTQgNTQgMC0xMDkgLTk0LTU0IDAgMHoiIGZpbGw9IiM1ODU5NWIiLz4KCTxwYXRoIGQ9Im0xMjAgMTU3bDQ3LTI3IDAtMjMgLTQ3LTI3IC00NyAyNyAwIDU0IDQ3IDI3IDQ3LTI3IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MTU7c3Ryb2tlOiNmZmYiLz4KCTx0ZXh0IHg9IjE1IiB5PSIzMDAiIGZvbnQtc2l6ZT0iMjVweCIgZm9udC1mYW1pbHk9IidCIFlla2FuJyIgc3R5bGU9ImZpbGw6IzI5Mjk1Mjtmb250LXdlaWdodDpib2xkIj7Yudi22Ygg2KfYqtit2KfYr9uM2Ycg2qnYtNmI2LHbjDwvdGV4dD4KCTx0ZXh0IHg9IjgiIHk9IjM0MyIgZm9udC1zaXplPSIyNXB4IiBmb250LWZhbWlseT0iJ0IgWWVrYW4nIiBzdHlsZT0iZmlsbDojMjkyOTUyO2ZvbnQtd2VpZ2h0OmJvbGQiPtqp2LPYqCDZiCDaqdin2LHZh9in24wg2YXYrNin2LLbjDwvdGV4dD4KPC9zdmc+ "
                                alt="Etehadie"
                                onClick={() => {
                                    window.open('https://ecunion.ir/verify/bvasett.ir?token=7143777680788776288d', 'Popup', 'toolbar=no, location=no, statusbar=no, menubar=no, scrollbars=1, resizable=0, width=580, height=600, top=30');
                                }}
                                style={{ cursor: 'pointer', width: '96px', height: '144px' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Logo Section */}
            <div className="col-12 md:col-2">
                <Link href="/" className="flex flex-wrap align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer">
                    {/* <Image src={`/layout/images/${layoutConfig.colorScheme === 'light' ? 'logo-dark' : 'logo-white'}.svg`} alt="footer logo" width={50} height={50} className="mr-2" /> */}
                    <Image src={data?.logo && typeof data?.logo === 'string' ? data?.logo : defaultImage} alt="Preview" width={50} height={50} style={{ objectFit: 'cover' }} />
                    <span className="font-medium text-3xl text-900">{data?.site_name}</span>
                </Link>
            </div>
        </div>
    );
};

export default AppFooter;
