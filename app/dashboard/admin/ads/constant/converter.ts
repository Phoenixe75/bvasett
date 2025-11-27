import {formatMoneyToPersianUnit} from '@/app/utils/moneyUtils';
import {DirectionEnum, LocationEnum, PurposeEnum} from '../(models)/ads';
import {OrderPaymentEnum, OrderStatusEnum} from '../../list-payments/(models)/payment';

export const getTypeLabel = (type: number | null | undefined): string => {
  switch (type) {
    case 1:
      return 'آپارتمان';
    case 2:
      return 'اداری';
    case 3:
      return 'تجاری';
    case 4:
      return 'زمین';
    case 5:
      return 'ویلا';
    default:
      return '';
  }
};

export const getLocationLabel = (location: LocationEnum | null): string => {
  switch (location) {
    case LocationEnum.North:
      return 'شمال';
    case LocationEnum.East:
      return 'شرق';
    case LocationEnum.Center:
      return 'مرکز';
    case LocationEnum.South:
      return 'جنوب';
    case LocationEnum.West:
      return 'غرب';
    default:
      return '';
  }
};

export const getDirection = (direction: DirectionEnum | null): string => {
  switch (direction) {
    case DirectionEnum.Northern:
      return 'northern';
    case DirectionEnum.Eastern:
      return 'eastern';
    case DirectionEnum.Southern:
      return 'southern';
    case DirectionEnum.Western:
      return 'western';
    default:
      return '';
  }
};

export const getPurposeLabel = (purpose: PurposeEnum | null): string => {
  switch (purpose) {
    case PurposeEnum.Buy:
      return 'فروش';
    case PurposeEnum.Rent:
      return 'رهن و اجاره';
    case PurposeEnum.Barter:
      return 'معاوضه';
    case PurposeEnum.MORTGAGE:
      return 'رهن کامل';
    case PurposeEnum.PARTNERSHIP:
      return 'مشارکت';
    default:
      return '';
  }
};

export const getOrderStatus = (status: OrderStatusEnum | null): string => {
  switch (status) {
    case OrderStatusEnum.pending:
      return 'در انتظار تایید';
    case OrderStatusEnum.processing:
      return 'درحال بررسی';
    case OrderStatusEnum.complete:
      return 'تایید شده';
    case OrderStatusEnum.cancelled:
      return 'لغو شده';
    case OrderStatusEnum.failed:
      return 'ناموفق';
    default:
      return '';
  }
};

export const getOrderPayment = (payment: OrderPaymentEnum | null): string => {
  switch (payment) {
    case OrderPaymentEnum.pending:
      return 'در انتظار تایید';
    case OrderPaymentEnum.paid:
      return 'پرداخت شده';
    case OrderPaymentEnum.voided:
      return 'باطل شد';
    case OrderPaymentEnum.cancelled:
      return 'لغو شده';
    default:
      return '';
  }
};

export const getPurposeLabelwithColor = (purpose: PurposeEnum | null): {
  label: string;
  className: string;
  iconClass: string,
  bgColor: string,
  color: string
} => {
  switch (purpose) {
    case PurposeEnum.Buy:
      return {
        label: 'فروش',
        className: 'bg-yellow-200',
        bgColor: '#FF0000',
        color: 'white',
        iconClass: 'text-yellow-700'
      };
    case PurposeEnum.Rent:
      return {label: 'اجاره', className: 'bg-cyan-200', bgColor: '#1d16e1', color: 'white', iconClass: 'text-cyan-700'};
    case PurposeEnum.Barter:
      return {
        label: 'معاوضه',
        className: 'bg-green-200',
        bgColor: '#9800ff',
        color: 'white',
        iconClass: 'text-green-700'
      };
    case PurposeEnum.MORTGAGE:
      return {
        label: 'رهن کامل',
        className: 'bg-green-200',
        bgColor: '#8e0697',
        color: 'white',
        iconClass: 'text-green-700'
      };
    case PurposeEnum.PARTNERSHIP:
      return {
        label: 'مشارکت',
        className: 'bg-green-200',
        bgColor: '#9800ff',
        color: 'white',
        iconClass: 'text-green-700'
      };
    default:
      return {label: 'نامشخص', className: '', bgColor: '', color: '', iconClass: ''};
  }
};
export const getPrice = (data: any) => {
  switch (data.purpose) {
    case PurposeEnum.Buy:
      // return {total: formatMoneyToPersianUnit(data.total_price)};
      return {total: formatMoneyToPersianUnit(data.total_price_rounded)};
    case PurposeEnum.Rent:
      return {
        // total: formatMoneyToPersianUnit(data.rent_pre_paid_amount),
        // rent: formatMoneyToPersianUnit(data.rent_price)
        total: formatMoneyToPersianUnit(data.rent_pre_paid_amount_rounded),
        rent: formatMoneyToPersianUnit(data.rent_price_rounded)
      };
    case PurposeEnum.Barter:
      // return {total: formatMoneyToPersianUnit(data.rent_pre_paid_amount)};
      return {total: formatMoneyToPersianUnit(data.rent_pre_paid_amount_rounded)};
    case PurposeEnum.MORTGAGE:
      // return {total: formatMoneyToPersianUnit(data.rent_pre_paid_amount)};
      return {total: formatMoneyToPersianUnit(data.rent_pre_paid_amount_rounded)};
    case PurposeEnum.PARTNERSHIP:
      // return {total: formatMoneyToPersianUnit(data.rent_pre_paid_amount)};
      return {total: formatMoneyToPersianUnit(data.rent_pre_paid_amount_rounded)};
    default:
      return {total: '', rent: ''};
  }
}
export const locationOption = [
  {name: 'شمالی', code: 1},
  {name: 'جنوبی', code: 4},
  {name: 'مرکزی', code: 3},
  {name: 'شرقی', code: 2},
  {name: 'غربی', code: 5}
];

export const directionsOption = [
  {name: 'شمالی', code: 'northern'},
  {name: 'جنوبی', code: 'eastern'},
  {name: 'شرقی', code: 'southern'},
  {name: 'غربی', code: 'western'}
];

export const ageOption = [
  {name: 'جدید', code: 'new'},
  {name: 'قدیمی', code: 'old'},
  {name: 'کلنگی', code: 'dilapidated'},
  {name: '1', code: '1'},
  {name: '2', code: '2'},
  {name: '3', code: '3'},
  {name: '4', code: '4'},
  {name: '5', code: '5'},
  {name: '6', code: '6'},
  {name: '7', code: '7'},
  {name: '8', code: '8'},
  {name: '9', code: '9'},
  {name: '10', code: '10'},
  {name: '11', code: '11'},
  {name: '12', code: '12'},
  {name: '13', code: '13'},
  {name: '14', code: '14'},
  {name: '15', code: '15'}
];

export const purposeOption = [
  {name: 'فروش', code: 1},
  {name: 'رهن و اجاره', code: 2},
  {name: 'معاوضه', code: 3},
  {name: 'رهن کامل', code: 4},
  {name: 'مشارکت', code: 5}
];

export const TypeOption = [
  {name: 'آپارتمان', code: 1},
  {name: 'اداری', code: 2},
  {name: 'تجاری', code: 3},
  {name: 'زمین', code: 4},
  {name: 'ویلا', code: 5}
];

export const activeOption = [
  {name: 'فعال', code: true},
  {name: 'غیر فعال', code: false}
];

export const completeOption = [
  {name: 'کامل', code: 'complete'},
  {name: 'ناقص', code: 'incomplete'}
];

export const approvedOption = [
  {name: 'فعال', code: true},
  {name: 'غیر فعال', code: false}
];

export const formatNumber = (value: any) => {
  if (typeof value !== 'string') {
    if (typeof value === 'number') {
      value = value.toString();
    } else {
      return null;
    }
  }

  const num = Number(value.replace(/,/g, ''));
  return num.toLocaleString();
};

export const truncateText = (text: string, maxLength: number) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
type NumberKeyType = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

function toPersianNumber(str: string): string {
  const enToFaDigits: {
    [key in NumberKeyType]: string;
  } = {
    '0': '۰',
    '1': '۱',
    '2': '۲',
    '3': '۳',
    '4': '۴',
    '5': '۵',
    '6': '۶',
    '7': '۷',
    '8': '۸',
    '9': '۹',
  };
  return str?.toString()?.replace(/[0-9]/g, (digit) => enToFaDigits[digit as NumberKeyType]) ?? '';
}

export const getRooms = (rooms: any) => {
  if (rooms === 0) {
    return ''
  }
  return `${toPersianNumber(rooms)} خوابه`
}
