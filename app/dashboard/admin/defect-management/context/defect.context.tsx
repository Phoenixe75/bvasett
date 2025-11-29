import {createContext, useContext, useState} from 'react';
import {DefectContextInterface} from '@/app/dashboard/admin/defect-management/types/layout';
import {ChildContainerProps} from '@/types';
import {useSearchParams} from 'next/navigation';

export const DefectContext = createContext<DefectContextInterface | undefined>(undefined);

export const DefectProvider = ({children}: ChildContainerProps) => {
  const searchParams = useSearchParams();
  const [page, setPage] = useState<number>(
    (searchParams?.has('currentPage') ? (Number(searchParams.get('currentPage')) - 1) : 0)
  );

  return <DefectContext.Provider value={{page, setPage}}>{children}</DefectContext.Provider>;
}

export const useDefectContext = () => {
  const context = useContext(DefectContext);
  if (context === undefined) {
    throw new Error('useDefectContext must be used within a UserProvider');
  }
  return context;
};
