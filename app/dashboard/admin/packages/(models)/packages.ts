export const purposes = {
    1: 'خرید',
    2 : 'اجاره',
    3 : 'معاوضه',
    4 : 'رهن',
    5 : 'شراکت'
} as const
export interface IPackages {
    "id"? : number;
    "ad_purpose": keyof typeof purposes,
    "with_inquiry_price": string,
    "without_inquiry_price": string
}

export interface IPackageListProps {
    data: IPackages[];
    loading: boolean;
    totalCount: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    refreshData: () => Promise<void>;
}
