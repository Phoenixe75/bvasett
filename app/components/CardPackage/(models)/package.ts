export interface IPackages {
    id: number;
    count: number;
    price: string;
}

export const WITHOUT_INQUIRY = "without_inquiry_price";
export const WITH_INQUIRY = "with_inquiry_price";

export type Inquiry = typeof WITHOUT_INQUIRY | typeof WITH_INQUIRY;

export type PackagesType  = {
    name: string;
    value: Inquiry;
    disabled?: boolean;
}[]
