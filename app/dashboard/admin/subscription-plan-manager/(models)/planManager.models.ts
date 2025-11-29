export interface PostSubscriptionPlan {
    active: boolean;
    ordering?: number;
    name: string;
    description: string;
    duration_days: number;
    price: string;
    id?:number
  }
  
  export interface PlansItem extends PostSubscriptionPlan {
    id: number
    created: string
    active: boolean
    ordering: number
    name: string
    description: string
    duration_days: number
    price: string
  }
  export interface OrderResponse {
    count:    number;
    next:     string;
    previous: string;
    results:  OrderItem[];
  }
  
  export interface OrderItem {
    id:number
    plan: number
    neighborhoods: number[]
    start_date: string
    end_date: string
    total: string
    order_guid: string
    payment_status: string
  }
  
  export interface OrderAdItem {
    id:           number;
    ad:           Ad;
    status:       number;
    status_label: string;
  }
  
  export interface Ad {
    id:                   number;
    total_price:          number;
    purpose_label:        string;
    location_label:       string;
    type_label:           string;
    directions:           string[];
    neighborhood_name:    string;
    neighborhood_image:   string;
    is_favorite:          boolean;
    created:              Date;
    active:               boolean;
    ordering:             number;
    title:                string;
    slug:                 string;
    type:                 number;
    location:             number;
    area:                 string;
    floors:               number;
    units_per_floor:      number;
    floor:                number | null;
    age:                  string;
    rooms:                number;
    warehouses:           number;
    parking:              number;
    elevators:            number;
    squat_toilets:        number;
    sitting_toilets:      number;
    address:              string;
    plate_number:         string;
    postal_code:          null;
    purpose:              number;
    rent_pre_paid_amount: null;
    rent_price:           null;
    unit_price:           string;
    owner_name:           string;
    owner_phone:          string;
    owner_phone2:         null;
    description:          null;
    complete:             string;
    state:                number;
    city:                 number;
    district:             number;
    neighborhood:         number;
    related_property:     null;
  }
  export interface IPackageListProps {
    data: PlansItem[];
    loading: boolean;
    totalCount: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    refreshData: () => Promise<void>;
}
