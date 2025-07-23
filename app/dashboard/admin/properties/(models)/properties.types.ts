
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
  notes:                         string;
  status:                        number;
  owner_mobile:                  number;
  owner_name:                    string;
  created:                       Date;
  images:                        Image[];
}

export interface Image {
  id:          number;
  file:        string;
  title:       string;
  description: string;
  is_primary:  boolean;
  ordering:    number;
}


export type PropertiesResponse = {
  count: number,
  results: Property[]
};
