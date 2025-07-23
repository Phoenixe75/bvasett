
export interface Discount {
    "id"? : number;
    "minimum_selected_ads": number;
    "percentage": number;
    "fixed_amount": number;
}

export interface DiscountListProps {
    data: Discount[];
    loading: boolean;
    totalCount: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    refreshData: () => Promise<void>;
}
