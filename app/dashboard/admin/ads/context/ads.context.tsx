import {createContext, useContext, useState} from 'react';
import {AdsContextInterface} from '@/app/dashboard/admin/ads/types/layout';
import {ChildContainerProps} from '@/types';
import {useSearchParams} from 'next/navigation';

export const AdsContext = createContext<AdsContextInterface | undefined>(undefined);

export const AdsProvider = ({children}: ChildContainerProps) => {
  const searchParams = useSearchParams();
  const [page, setPage] = useState<number>(
    (searchParams?.has('currentPage') ? (Number(searchParams.get('currentPage')) - 1) : 0)
  );

  return <AdsContext.Provider value={{page, setPage}}>{children}</AdsContext.Provider>;
}

export const useAdsContext = () => {
  const context = useContext(AdsContext);
  if (context === undefined) {
    throw new Error('useAdsContext must be used within a UserProvider');
  }
  return context;
};
