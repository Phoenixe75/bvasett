'use client'
import { useEffect, useState } from "react";
import ViewFormData from "../(components)/viewFormData";
import LoadingPage from "@/app/components/LoadingPage";
import { getProperty } from "./(services)/viewAd.service";
import { useSearchParams } from "next/navigation";

const ViewAd = () => {
  const [loading,setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({
    state: 0, 
    electronic_estate_note_number: "",
    images: [],
    note_book_number: "",
    page_number: "",
    primary_plate_number: "",
    registration_unit: "",
    secondary_plate_number:"",
});
const params = useSearchParams()
useEffect(() => {
  const fetchUserData = async () => {
      try {
          setLoading(true);
          const infoData:any = await getProperty(params.get("id") || '');
          setFormData(infoData);
      } catch (error) {
          console.error('Error fetching user data:', error);
      } finally {
          setLoading(false);
      }
  };

  fetchUserData();
}, []);

return <LoadingPage isLoading={loading}> 
  <ViewFormData formData={formData}  />
</LoadingPage>
}
export default ViewAd;