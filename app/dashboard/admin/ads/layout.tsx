'use client';
import React from 'react';
import {AdsProvider} from '@/app/dashboard/admin/ads/context/ads.context';

interface AdsLayoutProps {
  children: React.ReactNode;
}

export default function AdsLayout({children}: AdsLayoutProps) {
  return (<AdsProvider>
    {children}
  </AdsProvider>);
}
