import {INeighborhoods} from '@/app/dashboard/admin/ads/(models)/ads';
import {getNeighborhoods} from '@/app/dashboard/admin/ads/(services)/ads.service';
import {Dialog} from 'primereact/dialog';
import {MultiSelect, MultiSelectChangeEvent} from 'primereact/multiselect';
import React, {ReactNode, useCallback, useEffect, useRef, useState} from 'react';
import styles from './select-neighbourhood-modal.module.scss';
import {useRouter} from 'next/navigation';
import {toast} from 'react-toastify';
import {Chip} from 'primereact/chip';
import {produce} from 'immer';
import {Button} from 'primereact/button';
import {classNames} from 'primereact/utils';
import LoadingPage from '@/app/components/LoadingPage';
import {useMySubcriptionsContext} from '@/app/dashboard/user/my-subscriptions/(context)/MySubscriptionContext';

interface SelectNeighbourHoodModalProps {
  isVisible: boolean;
  header?: ReactNode;
  onOk?: ((data: INeighborhoods[]) => void) | ((data: INeighborhoods[]) => Promise<void>);
  onCancel: () => void;
  okText?: string;
  cancelText?: string;
  closable?: boolean;
  maxSelection?: number;
  oldNeighbourhoods?: Array<number> | null;
}

export default function SelectNeighbourHoodModal({
                                                   isVisible,
                                                   header,
                                                   maxSelection,
                                                   onOk,
                                                   onCancel,
                                                   okText,
                                                   cancelText,
                                                   closable = false,
                                                   oldNeighbourhoods
                                                 }: SelectNeighbourHoodModalProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [neighborhoodsState, setNeighborhoodsState] = useState<INeighborhoods[]>([]);
  const [selectedNeighbourhoods, setSelectedNeighbourhoods] = useState<INeighborhoods[]>([]);
  const router = useRouter();
  const beenSetted = useRef(false);
  const context = useMySubcriptionsContext();
  const doesHaveContext = context?.neighbourhoods?.length && context?.neighbourhoods?.length > 0;
  const convertToNewNeighbours = (data: INeighborhoods[]) => {
    if (beenSetted.current) {
      return
    }
    if (data && data.length === 0) {
      return
    }
    let res = data
    if (doesHaveContext) {
      const givenNeighboodToObj = context?.neighbourhoods.reduce((prev, acc) => {
        prev.set(acc, '')
        return prev
      }, new Map());
      res = data.filter(item => givenNeighboodToObj.has(item.id));
    }
    beenSetted.current = true;
    setNeighborhoodsState(res)
  }
  const fetchNeighborhoods = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedNeighborhoods = await getNeighborhoods();
      convertToNewNeighbours(fetchedNeighborhoods)
    } catch (error) {
      console.error('Failed to fetch Neighborhoods:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    convertToNewNeighbours(neighborhoodsState)
  }, [context?.neighbourhoods, neighborhoodsState])
  useEffect(() => {
    fetchNeighborhoods();
  }, [fetchNeighborhoods]);
  useEffect(() => {
    if (oldNeighbourhoods?.length && neighborhoodsState?.length) {
      setSelectedNeighbourhoods(neighborhoodsState.filter(neighborhoodsState => oldNeighbourhoods.includes(neighborhoodsState.id)))
    }
  }, [oldNeighbourhoods, neighborhoodsState]);
  const onMutliSelectChange = (e: MultiSelectChangeEvent): void => {
    if (maxSelection && e.value.length && e.value.length > maxSelection) {
      toast.error(`امکان انتخاب بیش از ${maxSelection} عدد وجود ندارد.`);
      return;
    }
    setSelectedNeighbourhoods(e.value);
  };
  const onRemoveItem = (index: number) => {
    const newSelected = produce(selectedNeighbourhoods, (draft) => {
      draft.splice(index, 1);
    });
    setSelectedNeighbourhoods(newSelected);
  };
  const onOkClick = async () => {
    setBtnLoading(true)
    await onOk?.(selectedNeighbourhoods);
    setBtnLoading(false)
  }
  return (
    <Dialog header={header ? header : <h2> انتخاب محله‌ها</h2>} onHide={onCancel} closable={closable}
            visible={isVisible}>
      <div className={styles.dialog_wrapper}>
        <LoadingPage isLoading={loading}>
          <div className={styles.chipContainer}>
            {selectedNeighbourhoods.map((item, index) => {
              return <Chip className={classNames(styles.chip, 'gap-2 align-items-center')} label={item.name} removable
                           key={item.id} onRemove={() => onRemoveItem(index)}/>;
            })}
          </div>
          <div className="field col-12 ">
            <label htmlFor="neighbourhood">محله</label>
            <MultiSelect
              value={selectedNeighbourhoods}
              onChange={onMutliSelectChange}
              options={neighborhoodsState}
              optionLabel="name"
              filter
              placeholder="انتخاب کنید"
              max={maxSelection}
              maxSelectedLabels={5}
              selectedItemsLabel="بیش از پنج مورد"
              className="w-full"
              emptyMessage="محله‌ای یافت نشد"
              emptyFilterMessage="محله‌ای یافت نشد"
            />
          </div>
          <div className="flex justify-content-end w-full mt-auto gap-2">
            <Button disabled={btnLoading} onClick={onCancel} severity="secondary">
              انصراف
            </Button>
            <Button
              loading={btnLoading}
              onClick={onOkClick}
            >
              تایید محله ها
            </Button>
          </div>
        </LoadingPage>
      </div>
    </Dialog>
  );
}
