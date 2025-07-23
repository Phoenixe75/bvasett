'use client'
import { useUserContext } from "@/layout/context/usercontext";
import classNames from "classnames";
import { ProgressSpinner } from "primereact/progressspinner";
import styles from "./SubmitAd.module.scss";
import { Button } from "primereact/button";
import { useRouter } from 'next/navigation';
import SubmitAdForm from "./(components)/addFormData";
const SubmitAd = () => {
  const {user, loading: userLoading} = useUserContext()
  const router = useRouter();
  return <div className={ classNames("flex w-full", styles.wrapper ,{
    "align-items-start justify-content-center": user?.national_id,
    "align-items-center justify-content-center": !user?.national_id
  })}>
    {userLoading ? <ProgressSpinner style={{ width: '50px', height: '50px' }} /> : null}
    {!user?.national_id ? <div className="flex flex-column align-items-center">
      <h3>برای ثبت آگهی ابتدا نیازمند ثبت کد ملی میباشد.</h3>
      <Button raised label="ثبت کدملی" onClick={() => router.push('/dashboard/user/user-details')} />
    </div> : <div className={styles.formWrapper}>
      <SubmitAdForm params={{id:0}} />
    </div> }
    
  </div>
}
export default SubmitAd;