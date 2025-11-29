export interface OrderResponse {
  count:    number;
  next:     string;
  previous: string;
  results:  OrderItem[];
}

export interface OrderItem {
  id:                   number;
  payment_status_label: string;
  order_status_label:   string;
  items:                OrderAdItem[];
  customer_mobile:      string;
  selected_ads:         number;
  extra_ads:            number;
  order_status:         number;
  total:                string;
  discount:             string;
  payment_status:       number;
  order_guid:           string;
  customer_ip:          string;
  transaction_id:       string;
  transaction_refid:    string;
  transaction_result:   string;
  payment_date:         Date;
  customer:             number;
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
