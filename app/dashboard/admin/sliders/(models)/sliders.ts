export interface ISliders {
    id: number;
    created: string | null;
    modified: string | null;
    active: boolean | null;
    ordering: number | null;
    title: string | null;
    description: string | null;
    image: string | null;
    link: string | null;
}

export interface ISlider {
    id?: number;
    active: boolean | null;
    ordering: number | null;
    title: string | null;
    description: string | null;
    image: File | string | null;
    link: string | null;
    mobile: boolean;
}

export interface ISliderListProps {
    data: ISliders[];
    loading: boolean;
    totalCount: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    refreshData: () => Promise<void>;
}
