import {AdCompleteStatusEnum} from '../ad-complete-status.enum';
import {IAds} from '@/app/dashboard/admin/ads/(models)/ads';

export type AdCompleteStatusEnumType = typeof AdCompleteStatusEnum[keyof typeof AdCompleteStatusEnum];

export interface IAdCompleteStatusListProps {
  deflectStatus: AdCompleteStatusEnumType,
  data: IAds[];
  loading: boolean;
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  refreshData: () => Promise<void>;
}
