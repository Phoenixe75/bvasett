import React, {useState} from 'react';
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
  const [activeItem, setActiveItem] = useState<NavItems>('sale');

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
