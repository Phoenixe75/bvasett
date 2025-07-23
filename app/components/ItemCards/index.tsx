import { useState } from "react";
import ItemCard from "./components/ItemCard";
import styles from "./itemCards.module.scss";
import { produce } from "immer";
import { toast } from "react-toastify";
import { Inquiry } from "../CardPackage/(models)/package";
interface ItemCards {
  data: any[];
  onSelectionChange: (data:any) => void;
  selectable: boolean;
  maxCount: number;
  onShowDetails: (data:any, e:any) => void
  showSelectable?: boolean;
  selectedPackage?: Inquiry;
}
const ItemCards = ({selectedPackage, data,onSelectionChange,selectable, maxCount, onShowDetails,showSelectable}:ItemCards) => {
  const [selectedItem, setSelectedItem] = useState(new Map());
  const onCardClick = (item:any) => {
    if(!selectable) {
      return;
    }
    const newState = produce(selectedItem, (draft) => {
      const getItem = draft.has(item.id);
      if (getItem) {
        draft.delete(item.id)
        return;
      }
      const arrLength =  Array.from(draft.values()).length;
      if(arrLength + 1 > maxCount) {
        toast.error(`شما فقط می‌توانید ${maxCount} آیتم را انتخاب کنید.`);
        return;
      }
      draft.set(item.id, item)
    })
    setSelectedItem(newState);
    onSelectionChange(Array.from(newState.values()));
  }
  return <div className={styles.wrapper}>
    {data.map(item =><ItemCard selectedPackage={selectedPackage} showSelectable={showSelectable} onShowDetails={onShowDetails} data={item} key={item.id} isSelected={selectedItem.has(item.id)} onClick={onCardClick} selectable={selectable}/>)}
  </div>
}
export default ItemCards