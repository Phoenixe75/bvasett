export interface ISettings {
    id: number;
    created?: string | null;
    modified?: string | null;
    active?: boolean | null;
    ordering: number | null;
    site_name: string | null;
    logo: string | null;
    favicon: string | null;
    contact_email: string | null;
    phone_number: string | null;
    address: string | null;
}

export interface ISetting {
    id?: number;
    active?: boolean | null;
    ordering: number | null;
    site_name: string | null;
    logo: File | string | null;
    favicon: File | string | null;
    contact_email: string | null;
    phone_number: string | null;
    address: string | null;
}

export interface ISettingsListProps {
    data: ISettings[];
    loading: boolean;
    totalCount: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    refreshData: () => Promise<void>;
}
