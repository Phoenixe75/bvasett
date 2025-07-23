export interface IOrderBuyRequest {
    ads: number[];
    package: number;
}
export interface ItemBasedOrderBuyRequest {
    ads: number[];
    extra_ads?: number[];
    with_inquiry: boolean;
}


export interface Ad {
    id:                   number;
    title:                string;
    area:                 string;
    unit_price:           string;
    total_price:          number;
    rooms:                number;
    rent_pre_paid_amount: null;
    rent_price:           null;
    purpose:              number;
    purpose_label:        string;
    type:                 number;
    type_label:           string;
    directions:           string[];
    location:             number;
    location_label:       string;
    district:             number;
    neighborhood:         number;
    neighborhood_name:    string;
    address:              string;
    is_favorite:          boolean;
}
interface Item {
    id:           number;
    ad:           Ad;
    status:       number;
    status_label: string;
}
export interface IOrderBuyResponse {
    id: number;
    payment_status_label: string | null;
    order_status_label: string | null;
    order_status: number | null;
    total: string | null;
    payment_status: number | null;
    order_guid: string | null;
    customer_ip: string | null;
    transaction_id: string | null;
    transaction_refid: any | null;
    transaction_result: any | null;
    payment_date: any | null;
    customer: number | null;
    package: number | null;
    items:                Item[] | null;
    customer_mobile:      string | null;
    selected_ads:         number | null;
    extra_ads:            number | null;
    discount:             string | null;
}

export interface IVerifyResponse {
    guid: string
    type: "ad" | "subscription";
    status: 0 | 1;
    transaction_refid: string
    transaction_result: string
}
export interface IPaymentStatus {
    status: number | null;
    redirect_url: string | null;
}


export interface RequestPaymentPayload {
    guid: string;
    type: "ad" | "subscription";
}