import { Tag } from "primereact/tag"

export const statusConverter = (num: number) => {
  switch(num) {
    case 0: 
      return <Tag value="در انتظار بررسی"></Tag>
    case 1:
      return <Tag severity="success" value="تایید شده"></Tag>
    case 2:
        return <Tag severity="danger" value="رد شده"></Tag>
    case 3: 
        return<Tag severity="success" value="تایید اولیه (در انتظار تکمیل)"></Tag>
  }
}