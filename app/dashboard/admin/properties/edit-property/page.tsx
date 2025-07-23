'use client'
import { useSearchParams } from 'next/navigation';
import EditPropertyForm from "./(components)/addFormData";
const SubmitAd = () => {
  const params = useSearchParams()
  return  <EditPropertyForm id={params.get('id')||''} />
}
export default SubmitAd;