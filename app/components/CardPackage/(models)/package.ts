export interface IPackages {
    id: number;
    count: number;
    price: string;
}

export const FREE = "free_price";
export const WITHOUT_INQUIRY = "without_inquiry_price";
export const WITH_INQUIRY = "with_inquiry_price";

export type Inquiry = typeof WITHOUT_INQUIRY | typeof WITH_INQUIRY | typeof FREE;
export const InquiryLabel: {
  [key in Inquiry]: string;
} = {
  [FREE]: 'سه‌تایی رایگان',
  [WITHOUT_INQUIRY]: "بدون استعلام",
  [WITH_INQUIRY]: "با استعلام",
}

export type PackagesType  = {
    name: string;
    value: Inquiry;
    disabled?: boolean;
}[]
