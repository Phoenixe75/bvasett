import React, {useEffect, useState} from 'react';
import Sale from './(shared-components)/Sale';
import Rent from './(shared-components)/Rent';
import Mortgage from './(shared-components)/Mortgage';
import './style.scss';
import NavMenu from '@/app/components/NavMenu';
import {match} from 'ts-pattern';
import {IFilter} from '@/app/components/FilterItem/(models)/filter';

export type NavItems = "sale" | "rent" | "mortgage";
const navItems: { key: NavItems, label: string }[] = [
  {
    key: 'sale',
    label: 'فروش'
  },
  {
    key: 'rent',
    label: "رهن / اجاره"
  },
  {
    key: 'mortgage',
    label: "رهن کامل"
  },
]
const FilterItem = ({oldForm}: { oldForm: IFilter | null }) => {

  const bindActiveItemByPurpose = (purpose?: string | number | null) => {
    switch (purpose) {
      case 1:
        return 'sale';
      case 2:
        return 'rent';
      case 4:
        return 'mortgage';
      default:
        return 'sale';
    }
  }

  const [activeItem, setActiveItem] = useState<NavItems>(() => {
    return bindActiveItemByPurpose(oldForm?.purpose);
  });

  useEffect(() => {
    if (oldForm) {
      switch (activeItem) {
        case "sale":
          oldForm.purpose = 1;
          oldForm.prePaidLte = null;
          oldForm.prePaidGte = null;
          oldForm.rentLte = null;
          oldForm.rentGte = null;
          break;
        case "rent":
          oldForm.purpose = 2;
          // TODO: remove old filter fields
          oldForm.priceLte = null;
          oldForm.priceGte = null;
          oldForm.prePaidLte = null;
          oldForm.prePaidGte = null;
          break;
        case "mortgage":
          oldForm.purpose = 4;
          // TODO: remove old filter fields
          oldForm.priceLte = null;
          oldForm.priceGte = null;
          oldForm.rentLte = null;
          oldForm.rentGte = null;
          break;
        default:
          break;
      }
      localStorage.setItem('filterForm', JSON.stringify(oldForm));
    }
  }, [activeItem, oldForm]);

  return (
    <div className="grid sm:w-full my-0 pt-0 md:pt-3 pr-3">
      <NavMenu<NavItems> menuItems={navItems} onClick={(activeValue) => setActiveItem(activeValue)}
                         defaultActive={activeItem}/>
      <div className="flex justify-content-center flex-order-1 sm:flex-order-2 col-12 lg:col-12 p-0"
           style={{borderRadius: '8px'}}>
        <div className="w-full">
          {match(activeItem).with('sale', () => <Sale oldForm={oldForm ?? null}/>).with(
            'rent', () => <Rent oldForm={oldForm ?? null}/>
          ).with('mortgage', () => <Mortgage oldForm={oldForm ?? null}/>).exhaustive()}
        </div>
      </div>
    </div>
  );
};

export default FilterItem;
