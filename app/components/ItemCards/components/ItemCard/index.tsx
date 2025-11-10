'use-client';
import styles from './ItemCard.module.scss';
import Image from 'next/image';
import {getPrice, getPurposeLabelwithColor, getRooms, getTypeLabel} from '@/app/dashboard/admin/ads/constant/converter';
import {randomPic} from '@/app/(main)/(pages)/filterResult/(contants)/images';
import {Button} from 'primereact/button';
import {useMemo, useState} from 'react';
import {Inquiry} from '@/app/components/CardPackage/(models)/package';
import {formatDate} from '@/app/utils/dateUtils';
import Favorite from './favorite/favorite';
import { classNames } from 'primereact/utils';

interface ItemCard {
  isSelected: boolean;
  onClick?: (data: any) => void;
  data: any;
  idx?: number;
  selectable: boolean;
  disableMsg?: string;
  onShowDetails: (data: any, e: any) => void;
  showSelectable?: boolean;
  selectedPackage?: Inquiry;
}

const defaultDisableMessage = 'ابتدا پکیج مورد نظر خود را انتخاب نمایید';
const ItemCard = ({
                    selectedPackage,
                    data,
                    idx,
                    isSelected,
                    onClick,
                    selectable,
                    onShowDetails,
                    disableMsg = defaultDisableMessage,
                    showSelectable = true
                  }: ItemCard) => {
  const statusCond = getPurposeLabelwithColor(data.purpose);
  const getItemPrice = getPrice(data);

  const imgSource = useMemo(() => {
    if (data.neighborhood_image) {
      return data.neighborhood_image
    }
    return randomPic()
  }, [data])


  return (
    <article className={styles.wrapper + ' result-' + idx}>
      <div className={styles.heart_container}>
        <Favorite data={data}/>
      </div>
      <div className={styles.card_info}>
        <div className={styles.description}>
                    <span className={'px-2 py-1 chips rounded-1'}
                          style={{backgroundColor: statusCond.bgColor, color: statusCond.color}}>
                        {statusCond.label}
                    </span>
        </div>
        <h2 className={classNames(styles.title, {})}>
          {getTypeLabel(data.type)} {getRooms(data.rooms)}
        </h2>
        {/*<div className={styles.description}>*/}
        {/*  <b>{formatDate(data.created)}</b>*/}
        {/*</div>*/}
        <div className={styles.description}>
          {Math.round(+data.area!)} متر {data?.neighborhood_name}
        </div>
        <div className={styles.description}>
          {getItemPrice.rent ? 'رهن: ' : null}
          {getItemPrice.total}
        </div>
        {getItemPrice.rent ? <div className={styles.description}>اجاره: {getItemPrice.rent}</div> : null}

        <div className={styles.action_wrapper}>
          {showSelectable && (
            <div className="pointer">
              {/* <InputSwitch tooltipOptions={{ position: 'bottom', showOnDisabled: true }} tooltip={!selectable ? disableMsg : ''} disabled={!selectable} checked={isSelected} onChange={(e) => onClick(data)} /> */}
              <Button
                tooltipOptions={{position: 'bottom', showOnDisabled: true}}
                tooltip={!selectable ? disableMsg : ''}
                size="small"
                severity={isSelected ? 'danger' : 'success'}
                onClick={(e) => {
                  onClick?.(data);
                }}
              >
                {isSelected ? 'عدم‌انتخاب' : 'انتخاب'}
              </Button>
            </div>
          )}
          {/* <i className="pi pi-eye text-yellow-500 pointer" style={{ fontSize: '1.5rem' }} onClick={(e) => onShowDetails(data, e)}></i> */}
          <div className="w-full">
            <Button raised size="small" severity="success"
                    className="pointer w-full justify-content-center info-color"
                    onClick={(e) => onShowDetails(data, e)}>
              جزئیات
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.card_thumbnail}><Image src={imgSource} alt="img" width={130} height={130}/></div>
    </article>
  );
};
export default ItemCard;
