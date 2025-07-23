'use client';
import React, { useState, useEffect } from 'react';
import { Carousel, CarouselResponsiveOption } from 'primereact/carousel';
import { getAllAdsSuggestItems } from './(services)/suggestItem.services';
import { IItems } from './(models)/suggestItem';
import { ProgressSpinner } from 'primereact/progressspinner';
import { getPurposeLabelwithColor, getTypeLabel, truncateText } from '@/app/dashboard/admin/ads/constant/converter';
import ItemCard from '../ItemCards/components/ItemCard';
import PropertyDialog from '../PropertyDialog';
import { useSearchParams } from 'next/navigation';

function useResponsiveBreakpoint() {
    const [numVisible, setNumVisible] = useState(3);
    const [carouselKey, setCarouselKey] = useState(0);
   
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 575) {
                setNumVisible(1);
            } else if (window.innerWidth <= 767) {
                setNumVisible(1);
            } else if (window.innerWidth <= 1199) {
                setNumVisible(6);
            } else {
                setNumVisible(6);
            }
            setCarouselKey((prevKey) => prevKey + 1);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return { numVisible, carouselKey };
}

export default function SuggestItem() {
    const [items, setItems] = useState<IItems[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { numVisible, carouselKey } = useResponsiveBreakpoint();
    const [selectedRowData, setSelectedRowData] = useState<any | null>(null);
    const [displayDialog, setDisplayDialog] = useState<boolean>(false);
    const searchParams = useSearchParams();

    const responsiveOptions: CarouselResponsiveOption[] = [
        {
            breakpoint: '1400px',
            numVisible: 4,
            numScroll: 1
        },
        {
            breakpoint: '1199px',
            numVisible: 4,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 1,
            numScroll: 1
        },
        {
            breakpoint: '575px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const results = searchParams.get('results');
            if (results) {
                const decodedResults = JSON.parse(decodeURIComponent(results));
                const response = await getAllAdsSuggestItems(decodedResults);
                setItems(response);
            } else {
                setIsLoading(false);
            }
            
        } catch (error) {
            console.error('Error retrieving ads:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    const showDetails = (rowData: any, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setSelectedRowData(rowData);
        setDisplayDialog(true);
    };
    const hideDialog = () => {
        setDisplayDialog(false);
        setSelectedRowData(null);
    };
    if (isLoading || items.length === 0) {
        return <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />;
    }

    const itemsTemplate = (item: IItems) => {
        return <div dir='rtl'><ItemCard data={item}  showSelectable={false} onShowDetails={showDetails} isSelected={false} onClick={()=>{}} selectable={false} /></div>
        // const statusInfo = getPurposeLabelwithColor(item.purpose);

        // return (
        //     <div className="border-1 surface-border border-round m-2 text-center py-5 px-3">
        //         <div className="mb-3">
        //             <span className={`p-1 text-xs`} style={{ borderRadius: '4px',
        //                 backgroundColor: statusInfo.bgColor,
        //                 color: statusInfo.color 
        //                 }}>
        //                 {statusInfo.label}
        //             </span>
        //         </div>
        //         <div className="mb-3">
        //             <h5 className="mb-1">
        //                 {getTypeLabel(item.type)} {Math.round(+item.area!)} متری
        //             </h5>
        //         </div>
        //         <div>
        //             <span className="text-600">{item.title}</span>

        //             <div className="mt-5 flex flex-wrap gap-2 justify-content-center">
        //                 <span dir="rtl" className="text-600">
        //                     {truncateText(item?.address, 16)}
        //                 </span>
        //             </div>
        //         </div>
        //     </div>
        // );
    };

    return (
        <div className="card" dir="ltr">
            <PropertyDialog onHide={hideDialog} visible={displayDialog} selectedRowData={selectedRowData}/>

            <Carousel key={carouselKey} value={items} numScroll={1} numVisible={4} responsiveOptions={responsiveOptions} itemTemplate={itemsTemplate} />
        </div>
    );
}
