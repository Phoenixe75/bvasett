export interface IOrders {
    id: number;
    payment_status_label: string | null;
    order_status_label: string | null;
    items: IOrdersItemProps[] | null;
    order_status: number | null;
    total: string | null;
    payment_status: number | null;
    order_guid: string | null;
    customer_ip: string | null;
    transaction_id: string | null;
    transaction_refid: string | null;
    transaction_result: string | null;
    payment_date: string | null;
    customer: number | null;
    package: number | null;
}

export interface IOrdersItemProps {
    id?: number;
    status: number | null;
    status_label?: string | null;
    ad?: any;
    primary_choice?: boolean
}

export interface EditOrderFormData {
    id: number;
    status: number | null;
    status_label: string | null;
}

export interface IOrdersProps {
    data: IOrders[];
    loading: boolean;
    totalCount: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    refreshData: () => Promise<void>;
}

export interface IOrdersResponse {
    results: any[];
    count: number;
    next: string | null;
    previous: string | null;
}

export enum OrderStatusEnum {
    pending = 0,
    processing = 1,
    complete = 2,
    cancelled = 3,
    failed = 4
}

export enum OrderPaymentEnum {
    pending = 0,
    paid = 1,
    voided = 2,
    cancelled = 3
}
