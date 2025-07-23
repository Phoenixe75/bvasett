export interface IItems {
    id: number | null;
    title: string | null;
    area: string | null;
    unit_price: string | null;
    total_price: number | null;
    rooms: number | null;
    purpose: number | null;
    purpose_label: string | null;
    type: number | null;
    type_label: string | null;
    directions: [] | null;
    location: number | null;
    location_label: string | null;
    district: number | null;
    neighborhood: number | null;
    address: string;
}
