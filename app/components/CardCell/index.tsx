'use client';
import React, {useEffect, useMemo, useState} from 'react';
import {getAllAdsMain} from '@/app/dashboard/admin/ads/(services)/ads.service';
import {ProgressSpinner} from 'primereact/progressspinner';
import {IAdsBase} from '@/app/dashboard/admin/ads/(models)/ads';
import ItemCard from '../ItemCards/components/ItemCard';
import {Button} from 'primereact/button';
import PropertyDialog from '../PropertyDialog';

export default function CardCell({count, setCount}: {
  count: number,
  setCount: React.Dispatch<React.SetStateAction<number>>
}) {
  const [ads, setAds] = useState<IAdsBase[]>([]);
  const [loadedAddIndexes, setLoadedAddIndexes] = useState<Array<number>>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1)
  const [next, setNext] = useState(false);
  // const [count, setCount] = useState<null | number>(null)
  const [selectedRowData, setSelectedRowData] = useState<any | null>(null);
  const [displayDialog, setDisplayDialog] = useState<boolean>(false);
  const [goTopTopIndex, setGoToTopIndex] = useState<number>(-1);
  const scrollIntoViewFirstLoadedAdd = useMemo(() => (() => {
    if (goTopTopIndex > -1) {
      if (loadedAddIndexes.length) {
        document.querySelector(`.result-${loadedAddIndexes[goTopTopIndex] - 1}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        return setGoToTopIndex(pre => --pre);
      }
    } else if (goTopTopIndex === -1) {
      return window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }), [goTopTopIndex, loadedAddIndexes, setGoToTopIndex]);
  const fetchData = async () => {
    try {
      setButtonLoading(true);
      const response = await getAllAdsMain(page);
      if (response.results?.length) {
        setAds(pre => {
          const newAds = pre?.length ? [...pre] : [];
          response.results?.forEach((item: any, index: number) => {
            if (!newAds.length) {
              newAds.push(item);
            } else if (!newAds.some(newAd => newAd.id === item.id)) {
              newAds.push(item);
            }
          });
          return newAds;
        });
      }
      setCount(response.count)
      setNext(!!response.next);
      setPage(pre => pre + 1);
    } catch (error) {
      console.error('Error retrieving ads:', error);
    } finally {
      setLoading(false);
      setButtonLoading(false);
    }
  };

  useEffect(() => {
    if (!!ads && ads.length) {
      setLoadedAddIndexes(newArray => {
        if (!newArray) {
          newArray = [];
        }
        if (!newArray.includes(ads.length)) {
          newArray.push(ads.length);
        }
        if (newArray) {
          setGoToTopIndex((newArray.length ?? 0) - 1);
        }
        return newArray;
      });
    }
  }, [ads?.length, loadedAddIndexes, setLoadedAddIndexes, setGoToTopIndex]);

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

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading || ads.length === 0) {
    return <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)"
                            animationDuration=".5s"/>;
  }

  // if (loadedAddIndexes.length) {

  // setLoadedAddIndexes(pre => {
  //   pre.pop();
  //   return pre;
  // });

  // } else {
  //   window.scrollTo({top: 0, behavior: 'smooth'});
  // }

  // const getPurposeLabel = (purpose: PurposeEnum | null): { label: string; className: string; iconClass: string } => {
  //     switch (purpose) {
  //         case PurposeEnum.Buy:
  //             return { label: 'فروش', className: 'bg-yellow-200', iconClass: 'text-yellow-700' };
  //         case PurposeEnum.Rent:
  //             return { label: 'اجاره', className: 'bg-cyan-200', iconClass: 'text-cyan-700' };
  //         case PurposeEnum.Barter:
  //             return { label: 'معاوضه', className: 'bg-green-200', iconClass: 'text-green-700' };
  //         case PurposeEnum.MORTGAGE:
  //             return { label: 'رهن کامل', className: 'bg-green-200', iconClass: 'text-green-700' };
  //         case PurposeEnum.PARTNERSHIP:
  //             return { label: 'مشارکت', className: 'bg-green-200', iconClass: 'text-green-700' };
  //         default:
  //             return { label: 'نامشخص', className: '', iconClass: '' };
  //     }
  // };

  return (
    <>
      {/*<div className='flex flex-row-reverse w-full'>*/}
      {/*    <h5>{`تعداد: ${count}`}</h5>*/}
      {/*</div>*/}
      <div className="col-12 p-0 lg:pb-5 mt-4 lg:mt-0 surface-card grid">
        {ads?.map((item, idx) => {
          return <div key={idx} className={"field col-12 xl:col-3 lg:col-4 sm:col-6" + ' result-' + idx}><ItemCard
            showSelectable={false}
            onShowDetails={showDetails} data={item}
            key={item.id} isSelected={false}
            onClick={() => {
            }} selectable={false}/></div>
        })}
        {next ? (
          <div className="w-full flex justify-content-center align-items-center">
            <div>
              <Button loading={buttonLoading} onClick={() => fetchData()}>
                نمایش بیشتر
              </Button>
            </div>
          </div>
        ) : null}
        {/*<Button className='go-top-btn' raised onClick={scrollIntoViewFirstLoadedAdd}>*/}
        {/*  بازگشت*/}
        {/*</Button>*/}
        <Button className='go-top-btn'
                raised
                onClick={scrollIntoViewFirstLoadedAdd} iconPos="top"
                icon="pi pi-fw pi-arrow-up"/>
      </div>
      <PropertyDialog onHide={hideDialog} visible={displayDialog} selectedRowData={selectedRowData}/>
    </>
  );
}
// const statusInfo = getPurposeLabel(item.purpose);
// return (
//     <div key={item.id} className="col-12 md:col-4 lg:col-4 p-3">
//         {/* style={{ backgroundColor: '#fed978' }} */}
//         <div className=" property-card-wrapper">
//             <div className={'card_info'}>
//                 <h2 className={item.title}>
//                     {getTypeLabel(item.type)} {Math.round(+item.area)} متری
//                 </h2>
//                 <span className="description">{item.title}</span>
//                 <span
//                     className={`text-600 ${statusInfo.className} p-1 text-xs`}
//                     style={{
//                         borderRadius: '4px',
//                         width:'fit-content',
//                         marginTop:'32px'
//                     }}
//                 >
//                     {statusInfo.label}
//                 </span>
//             </div>
//             <div className="card_thumbnail">
//                 <i className="pi pi-home" style={{ fontSize: '2.5rem' }}></i>
//             </div>
//         </div>
//     </div>
// );
