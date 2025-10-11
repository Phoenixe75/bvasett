'use client';
import React, {useEffect, useState} from 'react';
import {SelectButton, SelectButtonChangeEvent} from 'primereact/selectbutton';
import {getPackages} from '../FilterItem/(services)/filter.service';
import {IPackages, PackagesType, WITH_INQUIRY, WITHOUT_INQUIRY} from './(models)/package';
import {ProgressSpinner} from 'primereact/progressspinner';
import {formatMoneyToPersianUnit} from '@/app/utils/moneyUtils';
import {useUserContext} from '@/layout/context/usercontext';

const PackageItem = ({selectedPackage, setSelectedPackage, tourTarget, firstBuyer, prices}: any) => {
  const [packages, setPackages] = useState<IPackages[]>([]);
  const price = prices ? Array.from(prices.values())[0] as any : null;
  const {user} = useUserContext();

  const items: PackagesType = [
    {
      name: `با استعلام ${formatMoneyToPersianUnit(price?.[WITH_INQUIRY])}`,
      value: WITH_INQUIRY,
      disabled: firstBuyer
    },
    {
      name: firstBuyer ? "هفت تایی رایگان" : `بدون استعلام ${formatMoneyToPersianUnit(price?.[WITHOUT_INQUIRY])}`,
      value: WITHOUT_INQUIRY,
      // disabled: !firstBuyer
      disabled: !!user
    },
  ]
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await getPackages();
        setPackages(response);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    fetchPackages();
  }, []);

  useEffect(() => {
    if (tourTarget) {
      const element = document.querySelector(tourTarget);
      if (element) {
        element.setAttribute('data-joyride', 'true');
      }
    }
  }, [tourTarget]);


  if (!packages.length) return <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8"
                                                fill="var(--surface-ground)" animationDuration=".5s"/>;
  return (
    <div className="surface-0">
      <div className="card flex justify-content-center package-card-selector " dir="ltr">
        <SelectButton style={{minWidth: '50%'}} value={selectedPackage}
                      onChange={(e: SelectButtonChangeEvent) => setSelectedPackage(e.value)} optionLabel="name"
                      options={items} multiple={false}/>
      </div>
    </div>
  );
};

export default PackageItem;
