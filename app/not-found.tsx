'use client';
import React from 'react';
import Image from 'next/image';
import NotFound from '../public/images/404.jpg';

function NotFoundPage() {
    return (
        <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            <div className="flex flex-column align-items-center justify-content-center">
                <div className="flex justify-content-center align-content-center">
                    <Image src={NotFound} alt="Sakai logo" className="mb-5 flex-shrink-0" />
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;
