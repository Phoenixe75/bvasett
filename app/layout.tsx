'use client';
import {LayoutProvider} from '../layout/context/layoutcontext';
import {PrimeReactProvider} from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {enableMapSet} from 'immer';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({children}: RootLayoutProps) {

  enableMapSet();
  return (
    <html lang="fa" suppressHydrationWarning>
    <head>
      <title>بی‌واسط</title>
      <link id="theme-css" href={`/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link>
      <meta name="google-site-verification" content="YPyUO5YRxltBeQZI6i2T4fHlPdOsPZtLDzc4hyiVs4E"/>
    </head>
    <body dir="rtl">
    <PrimeReactProvider>
      <LayoutProvider>{children}</LayoutProvider>
      <ToastContainer/>
    </PrimeReactProvider>
    </body>
    </html>
  );
}
