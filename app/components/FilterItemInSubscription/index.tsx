import { TabPanel, TabView } from 'primereact/tabview';
import React, { useState } from 'react';
import Sale from './(shared-components)/Sale';
import Rent from './(shared-components)/Rent';
import Mortgage from './(shared-components)/Mortgage';
import './style.scss';
import { Accordion, AccordionTab } from 'primereact/accordion';
import NavMenu from '@/app/components/NavMenu';
import { match } from 'ts-pattern';
import { Button } from 'primereact/button';
export type NavItems = "sale" | "rent" | "mortgage" ;
const navItems: {key:NavItems,label:string}[] = [
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

const FilterItemInSubscription = () => {
    const [activeItem, setActiveItem] = useState<NavItems>('sale');
    return (
        <div className="grid my-0 pt-0 md:pt-3">
            <NavMenu<NavItems> menuItems={navItems} onClick={(activeValue) => setActiveItem(activeValue)} defaultActive={activeItem}/>
            <div className="flex justify-content-center flex-order-1 sm:flex-order-2 col-12 lg:col-12 p-0" style={{ borderRadius: '8px' }}>
                <div className="w-full">
                    {match(activeItem).with('sale', () => <Sale />).with(
                        'rent',()=><Rent />
                    ).with('mortgage', ()=><Mortgage />).exhaustive()}
                </div>
            </div>
        </div>
    );
};

export default FilterItemInSubscription;
