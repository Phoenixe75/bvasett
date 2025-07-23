import { INeighborhoods } from "@/app/dashboard/admin/ads/(models)/ads"

export interface SubscriptionPlanItem {
  id: number
  created: string
  active: boolean
  ordering: number
  name: string
  description: string | string[]
  duration_days: number
  price: string
}

export interface SubscribePlanPayload {
    plan: SubscriptionPlanItem["id"];
    neighborhoods: INeighborhoods['id'][];
    start_date: string;
}
export interface SubscribePlanResponse {
  plan: SubscriptionPlanItem["id"];
  neighborhoods: INeighborhoods['id'][];
  start_date: string
  end_date: string
  total: string
  order_guid: string
  payment_status: string
}
