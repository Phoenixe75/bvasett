import { Tag } from "primereact/tag"

const PaymentStatusConverter = (num: number) => {
  switch(num) {
    case 0: 
      return <Tag value="در انتظار"></Tag>
    case 1:
      return <Tag severity="success" value="پرداخت شده"></Tag>
    case 2:
        return <Tag severity="danger" value="پرداخت نشده"></Tag>
    case 3: 
        return<Tag severity="danger" value='کنسل شده'></Tag>
  }
}

const OrderStatusConverter = (num: number) => {
    switch(num) {
      case 0: 
        return <Tag value="در انتظار"></Tag>
      case 1:
        return <Tag severity="success" value="در حال پردازش"></Tag>
      case 2:
        return <Tag severity="success" value="تکمیل شده"></Tag>
      case 3: 
        return<Tag severity="danger" value='کنسل شده'></Tag>
      case 4:
          return <Tag severity="danger" value="ناموفق"></Tag>
    }
  }