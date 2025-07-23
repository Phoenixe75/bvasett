import React, { useState } from 'react';
import { SubscribePlanPayload, SubscriptionPlanItem } from '../../(models)/subscription.model';
import styles from './subscription-card.module.scss';
import { formatCurrency, formatMoneyToPersianUnit } from '@/app/utils/moneyUtils';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Dialog } from 'primereact/dialog';
import { MultiSelect } from 'primereact/multiselect';
import SelectNeighbourHoodModal from '../../../../../components/SelectNeighbourhoodModal/SelectNeighbourHoodModal';
import { INeighborhoods } from '@/app/dashboard/admin/ads/(models)/ads';
import { subscribePlan } from '../../(services)/subscriptions.service';
import moment from 'jalali-moment';
import LoginModal from '@/app/components/LoginModal';
import { useUserContext } from '@/layout/context/usercontext';
import { toast } from 'react-toastify';
import { TRANSLATIONS } from '../../../filterResult/translation';
import { IPaymentStatus } from '../../../filterResult/(models)/orderBuy';
import { paymentRequestService, paymentService } from '../../../filterResult/(services)/orderBuy.service';
import { classNames } from 'primereact/utils';

const itemDescription = ['قابلیت انتخاب 20 محله', 'بدون محدودیت مشاهده فایل در مناطق منتخب', 'فعال بر روی تمام معاملات خرید و فروش / رهن / اجاره', 'بارگذاری فایل ها به صورت روزانه از زمان تهیه اشتراک', 'قابلیت استعلام برای دریافت فایل های فعال'];

interface SubscriptionCard {
    data: SubscriptionPlanItem;
}
export default function SubscrptionCard({ data }: SubscriptionCard) {
    const [openDialog, setOpenDialog] = useState(false);
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const { user } = useUserContext();
    const toggleDialog = () => {
      setOpenDialog(pre => !pre)
    }
    const toggleLoginDialog = () => {
      setShowLoginDialog(pre => !pre)
    }
    let description = Array.isArray(data.description) ? data.description : [data.description,...itemDescription].filter(id=>!!id);
    let isFreePlan = data.price === 'رایگان';
    const router = useRouter();
    const onButtonClick = () => {
        if (isFreePlan) {
            router.back();
            return;
        }
        if (!user || !user.id) {
          toast.error(TRANSLATIONS.notLoginError);
          toggleLoginDialog();
          return;
      }
        toggleDialog()
    };
    const onOk = async (selectedNeighbours:INeighborhoods[]) =>  {
      const payload:SubscribePlanPayload = {
          plan: data.id,
          start_date: moment().add(1,'hour').toISOString(),
          neighborhoods: selectedNeighbours.map(item=>item.id)
      }
      try {
        const result = await subscribePlan(payload);
          const guid = result?.order_guid;
          if(!guid) {
              toast.error('خرید با خطا روبرو شد.');
          }
          const resData: IPaymentStatus = await paymentRequestService({guid:guid, type:'subscription'});
          if (resData?.status === 307) {
              if (resData.redirect_url) {
                  toast.success('در حال انتقال به درگاه بانکی');
                  router.push(resData.redirect_url);
                  toggleDialog()
              } else {
                  toast.error('آدرس انتقال معتبر نیست.');
              }
          } else if (resData?.status === 503) {
              toast.error('خرید با خطا روبرو شد.');
          } else {
              toast.error('خرید با خطا روبرو شد.');
          }
      } catch (error) {
        console.error('Error during purchase:', error);
        toast.error('خرید با خطا روبرو شد.');
      }
    }
    return (
        <>
            <div className={styles.wrapper}>
                <h1>{`اشتراک ${data.name}`}</h1>
                <span className={styles.blue_line} />
                <div className={styles.description}>
                    {description.map((item, index) => (
                        <div key={index} className={classNames("flex justify-content-start align-items-center w-full gap-2", styles.items)}>
                            <i className="pi pi-check" style={{ color: 'blue' }}></i>
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-auto">
                    <div className="w-full flex justify-content-between align-items-end">
                        <div>
                            <div className="relative">
                                {!isFreePlan? <><div className={styles.red_line} />
                                <h5>{`${formatCurrency(550000)} تومان`}</h5> </>: null}
                            </div>
                            <h2>{isFreePlan ? data.price : `${formatCurrency(data.price)} تومان`}</h2>
                        </div>
                        <div>
                         <p className={isFreePlan ? styles.plan_info_normal : styles.plan_info }>{isFreePlan ? 'فعال برای کاربران جدید' : 'تخفیف فعال تا 18 مردادماه'}</p>
                        </div>
                    </div>

                    <span className={styles.blue_line} />
                    <Button className="w-full align-items-center justify-content-center" onClick={onButtonClick}>
                        {isFreePlan ? 'انتخاب 10 فایل رایگان من' : 'خرید اشتراک'}
                    </Button>
                </div>
            </div>
            <LoginModal onHide={()=>{setShowLoginDialog(false)}} visible={showLoginDialog} />
            <SelectNeighbourHoodModal maxSelection={20} isVisible={openDialog} onCancel={toggleDialog} onOk={onOk}/>
        </>
    );
}
