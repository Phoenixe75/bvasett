export interface SubmitAdFormData {
    state: number,
    registration_unit: string,
    primary_plate_number: number,
    secondary_plate_number: number,
    title_deeds_type: "old" | "new" | null,
    electronic_estate_note_number: number,
    note_book_number: string,
    page_number: string,
    image_ids:number[]
}