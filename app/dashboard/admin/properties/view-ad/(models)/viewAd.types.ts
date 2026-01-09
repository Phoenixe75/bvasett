import {IAdsBase} from '@/app/dashboard/admin/ads/(models)/ads';

export interface Property {
  id:                            number;
  owner:                         number;
  state:                         number;
  registration_unit:             string;
  primary_plate_number:          string;
  secondary_plate_number:        string;
  title_deeds_type:              string;
  electronic_estate_note_number: string;
  note_book_number:              string;
  page_number:                   string;
  notes:                         null;
  status:                        number;
  created:                       Date;
  images:                        Image[];
  ad?: IAdsBase;
}

export interface Image {
  id:          number;
  file:        string;
  title:       string;
  description: string;
  is_primary:  boolean;
  ordering:    number;
}


export type PropertiesResponse = Property[];
