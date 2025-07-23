import { Metadata } from 'next';
import Layout from '../../layout/layout';
import { UserProvider } from '@/layout/context/usercontext';
import AuthenticatedContent from './AuthenticatedContent';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'بی‌واسط',
    description: '',
    robots: { index: false, follow: false },
    viewport: { initialScale: 1, width: 'device-width' },
    openGraph: {
        type: 'website',
        title: 'Bvasett',
        url: '',
        description: '',
        images: ['https://www.primefaces.org/static/social/sakai-react.png'],
        ttl: 604800
    },
    icons: {
        icon: '/logo-dark.ico'
    }
};

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <UserProvider>
            <Layout>
                <AuthenticatedContent>{children}</AuthenticatedContent>
            </Layout>
        </UserProvider>
    );
}
