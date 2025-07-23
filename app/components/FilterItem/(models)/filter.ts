export interface IFilter {
    purpose?: number | null;
    priceLte?: number | null;
    priceGte?: number | null;
    prePaidLte?: number | null;
    prePaidGte?: number | null;
    rentLte?: number | null;
    rentGte?: number | null;
    areaGte?: number | null;
    areaLte?: number | null;
    rooms?: number | null;
    roomLte?: number | null;
    roomGte?: number | null;
    neighbourhood?: number[] | null;
}

interface IFilterProps {
    id: number | null;
    area: string | null;
    unit_price: string | null;
    total_price: number | null;
    rooms: number | null;
    purpose_label: string | null;
    type: number | null;
    type_label: string | null;
    location: number | null;
    location_label: string | null;
    district: number | null;
    address: string | null;
}
