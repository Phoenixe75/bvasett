export interface ITickets {
    id?: number;
    created?: string | null;
    modified?: string | null;
    active?: boolean | null;
    ordering?: number;
    subject: string;
    body: string;
    answer: string | null;
    answered_at?: string | null;
    user: number | null;
    answered_by?: number | null;
}

export interface ITicketsResponse {
    results: any[];
    count: number;
    next: string | null;
    previous: string | null;
}

export interface ITicketsListProps {
    data: ITickets[];
    loading: boolean;
    totalCount: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    refreshData: () => Promise<void>;
}

export interface ITicketsResponse {
    results: any[];
    count: number;
}

export interface IReplayPageTicket {
    id?: number;
    answer: string | null;
    user: number;
}
