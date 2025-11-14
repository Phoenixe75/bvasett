export interface IAdsBase {
  id?: number | null;
  registered_date?: string;
  checked_at?: string;
  purpose_label?: string;
  location_label?: string | null;
  type_label?: string | null;
  active: boolean | null;
  complete: string | null;
  ordering: number | null;
  title: string;
  slug: string;
  location: LocationEnum | null;
  directions: string[] | null;
  area: string;
  floors: number | null;
  units_per_floor: number | null;
  age: string | null;
  rooms: number | null;
  warehouses: number | null;
  parking: number | null;
  elevators: number | null;
  squat_toilets: number | null;
  sitting_toilets: number | null;
  district: number | null;
  neighborhood: number | null;
  address: string;
  plate_number: number | null;
  owner_name: string;
  owner_phone: string;
  owner_phone2: string | null;
  description: string | null;
  purpose: PurposeEnum | null;
  rent_pre_paid_amount: string;
  rent_price: string;
  unit_price: string;
  total_price: string;
  type: number | null;
  sold: boolean;
  state: number | null;
  city: number | null;
}

export interface IAds {
  id?: number | null;
  purpose_label?: string;
  location_label?: string | null;
  type_label?: string | null;
  active?: boolean | null;
  ordering?: number | null;
  title?: string;
  slug?: string;
  location?: LocationEnum | null;
  area?: string; // optional
  floors?: number | null; // optional
  units_per_floor?: number | null; // optional
  age?: string | null; // optional
  rooms?: number | null; // optional
  warehouses?: number | null; // optional
  parking?: number | null; // optional
  elevators?: number | null; // optional
  squat_toilets?: number | null; // optional
  sitting_toilets?: number | null; // optional
  district?: number | null; // optional
  neighborhood?: number | null; // optional
  address?: string; // optional
  plate_number?: number | null; // optional
  purpose?: PurposeEnum | null; // optional
  type?: number | null;
  sold?: boolean;
  state?: number | null;
  city?: number | null;
}

export interface IBuyAds extends IAds {
  unit_price: string; // required
}

export interface IApartmentAds extends IBuyAds {
  elevators: number; // required
  area: string; // required
  units_per_floor: number; // required
  sitting_toilets: number; // required
  squat_toilets: number; // required
  warehouses: number; // required
  floors: number; // required
  plate_number: number; // required
  age: string; // required
  rooms: number; // required
  parking: number; // required
}

export interface IRentAds extends IAds {
  rent_pre_paid_amount: string; // required
  rent_price: string; // required
}

export interface IRentBarterAds extends IRentAds {
}

export interface IMortgageAds extends IRentAds {
}

export interface ILandAds extends IAds {
  area: string; // required
}

export interface IVillaAds extends IApartmentAds {
}

export interface IPartAds extends IBuyAds {
}

export interface IAdsResponse {
  results: any[];
  count: number;
  next: string | null;
  previous: string | null;
}

export enum LocationEnum {
  North = 1,
  East = 2,
  Center = 3,
  South = 4,
  West = 5
}

export enum DirectionEnum {
  Northern = 'northern',
  Eastern = 'eastern',
  Southern = 'southern',
  Western = 'western'
}

export interface IDirection {
  name: string;
  code: string;
}

export enum PurposeEnum {
  Buy = 1,
  Rent = 2,
  Barter = 3,
  MORTGAGE = 4,
  PARTNERSHIP = 5
}

export interface IAdsListProps {
  data: IAds[];
  loading: boolean;
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  refreshData: () => Promise<void>;
}

export interface IState {
  id: number;
  name: string;
  slug: string;
  ordering: number;
}

export interface ICity {
  id: number;
  state: string;
  name: string;
  slug: string;
  ordering: number;
}

export interface IDistricts {
  id: number;
  city: string;
  name: string;
  slug: string;
  ordering: number;
}

export interface INeighborhoods {
  id: number;
  district: string;
  name: string;
  slug: string;
  ordering: number;
}

export interface INeighborhoodWithBlocks extends INeighborhoods{
  blocks: Array<string>;
}
