export interface IQuestions {
    id?: number;
    created?: string;
    modified?: string;
    active?: boolean;
    ordering?: number;
    body?: string;
    answer?: string | null;
    approved?: boolean;
    approved_at?: string | null;
    user?: number;
    approved_by?: number;
    answered_by?: number;
}

export interface IQuestionsListProps {
    data: IQuestions[];
    loading: boolean;
    totalCount: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    refreshData: () => Promise<void>;
}

export interface IReplayPageQuestion {
    id?: number;
    active: boolean;
    body: string;
    answer: string;
    approved: boolean;
    user: number;
}
