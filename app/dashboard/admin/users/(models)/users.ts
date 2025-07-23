export interface IUsers {
    id: number;
    mobile: string | null;
    first_name: string | null;
    last_name: string | null;
    national_id: string | null;
    email: string | null;
    state: number | null;
    city: number | null;
    address: string | null;
    postal_code: string | null;
    is_staff: boolean;
    state_label?: string | null;
    city_label?: string | null;
}

export interface IUsersResponse {
    results: any[];
    count: number;
    next: string | null;
    previous: string | null;
}
