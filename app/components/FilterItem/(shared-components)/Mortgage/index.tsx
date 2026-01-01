'use client';
import React, {useCallback, useEffect, useState} from 'react';
import {MultiSelect} from 'primereact/multiselect';
import {Button} from 'primereact/button';
import {InputNumber} from 'primereact/inputnumber';
import {toast} from 'react-toastify';
import {IFilter} from '../../(models)/filter';
import {useRouter} from 'next/navigation';
import {INeighborhoods} from '@/app/dashboard/admin/ads/(models)/ads';
import {getNeighborhoods} from '@/app/dashboard/admin/ads/(services)/ads.service';
import SelectNeighbourHoodModal from '@/app/components/SelectNeighbourhoodModal/SelectNeighbourHoodModal';

const Mortgage = ({oldForm}: { oldForm: IFilter }) => {
  const [openNeighbourhood, setOpenNeighbourhood] = useState(false);
  const [formData, setFormData] = useState<IFilter>({
    purpose: 4,
    prePaidLte: oldForm?.prePaidLte,
    prePaidGte: oldForm?.prePaidGte,
    areaLte: oldForm?.areaLte,
    areaGte: oldForm?.areaGte,
    roomLte: oldForm?.roomLte,
    roomGte: oldForm?.roomGte,
    neighbourhood: oldForm?.neighbourhood ?? [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [neighborhoodsState, setNeighborhoodsState] = useState<INeighborhoods[]>([]);
  const [selectedNeighbourhoods, setSelectedNeighbourhoods] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (neighborhoodsState.length && oldForm?.neighbourhood?.length) {
      setSelectedNeighbourhoods(neighborhoodsState.filter(neighbourhood => oldForm.neighbourhood?.includes(neighbourhood.id)))
    }
  }, [neighborhoodsState, setSelectedNeighbourhoods, oldForm]);

  const fetchNeighborhoods = useCallback(async () => {
    try {
      const fetchedNeighborhoods = await getNeighborhoods();
      setNeighborhoodsState(fetchedNeighborhoods);
    } catch (error) {
      console.error('Failed to fetch Neighborhoods:', error);
    }
  }, []);

  useEffect(() => {
    fetchNeighborhoods();
  }, [fetchNeighborhoods]);

  const setValue = useCallback((fieldName: keyof IFilter, fieldValue: number | null | string[]) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (
        formData?.prePaidLte !== null ||
        formData?.prePaidGte !== null ||
        formData?.areaLte !== null ||
        formData?.areaGte !== null ||
        formData?.roomLte !== null ||
        formData?.roomGte !== null ||
        (formData?.neighbourhood && formData.neighbourhood.length > 0)
      ) {
        localStorage.setItem('filterForm', JSON.stringify(formData));
        const encodedResults = encodeURIComponent(JSON.stringify(formData));
        router.push(`/filterResult?results=${encodedResults}`);
      } else {
        toast.error('لطفا فیلدها را پر کنید و محله‌ها را انتخاب کنید');
      }
    } catch (error) {
      toast.error('خطا رخ داد');
    } finally {
      setLoading(false);
    }
  };
  const onSelectNeighbourhoodClick = () => {
    setOpenNeighbourhood(true);
  }
  const onModalOk = (items: INeighborhoods[]) => {
    setSelectedNeighbourhoods(items);
    const selectedIds = items.map((neighborhood: any) => neighborhood.id);
    setValue('neighbourhood', selectedIds);
    setOpenNeighbourhood(false);
  }
  return (
    <div className="grid">
      <form onSubmit={handleSubmit} className="col-12 md:col-12">
        <div className="p-fluid">
          <div className="formgrid grid">
            <div className="field col-12">
              <label htmlFor="prePaidGte">حداقل قیمت رهن (تومان)</label>
              <InputNumber id="prePaidGte" value={formData?.prePaidGte ?? null}
                           onChange={(e) => setValue('prePaidGte', e.value)}/>
            </div>
            <div className="field col-12">
              <label htmlFor="prePaidLte">حداکثر قیمت رهن (تومان)</label>
              <InputNumber id="prePaidLte" value={formData?.prePaidLte ?? null}
                           onChange={(e) => setValue('prePaidLte', e.value)}/>
            </div>
            <div className="field formgrid grid col-12 ">
              <p className="field col-12">متراژ</p>
              <div className="field col-6">
                <label htmlFor="areaGte"> از</label>
                <InputNumber id="areaGte" value={formData?.areaGte ?? null}
                             onChange={(e) => setValue('areaGte', e.value)}/>
              </div>
              <div className="field col-6">
                <label htmlFor="areaLte">تا</label>
                <InputNumber id="areaLte" value={formData?.areaLte ?? null}
                             onChange={(e) => setValue('areaLte', e.value)}/>
              </div>
            </div>
            <div className="field formgrid grid col-12 ">
              <p className="field col-12">تعداد اتاق</p>
              <div className="field col-6">
                <label htmlFor="roomGte"> از</label>
                <InputNumber id="roomGte" value={formData?.roomGte ?? null}
                             onChange={(e) => setValue('roomGte', e.value)}/>
              </div>
              <div className="field col-6">
                <label htmlFor="roomLte">تا</label>
                <InputNumber id="roomLte" value={formData?.roomLte ?? null}
                             onChange={(e) => setValue('roomLte', e.value)}/>
              </div>
            </div>
            <div className="field col-12 relative">
              <label htmlFor="neighbourhood">محله</label>
              <div className='absolute w-full' style={{height: "100%", top: 0, left: 0, zIndex: 100}}
                   onClick={onSelectNeighbourhoodClick}></div>
              <MultiSelect
                value={selectedNeighbourhoods}
                onChange={(e) => {
                  setSelectedNeighbourhoods(e.value);
                  const selectedIds = e.value.map((neighborhood: any) => neighborhood.id);
                  setValue('neighbourhood', selectedIds);
                }}
                options={neighborhoodsState}
                optionLabel="name"
                filter
                placeholder="انتخاب کنید"
                maxSelectedLabels={5}
                selectedItemsLabel='بیش از پنج مورد'
                className="w-full"
                emptyMessage='محله‌ای یافت نشد'
                emptyFilterMessage='محله‌ای یافت نشد'
              />
            </div>
          </div>
        </div>
        <SelectNeighbourHoodModal isVisible={openNeighbourhood}
                                  onCancel={() => setOpenNeighbourhood(false)}
                                  onOk={onModalOk}
                                  oldNeighbourhoods={formData?.neighbourhood}/>
        <div className="text-left mt-4">
          {/* className="customBtn border-0" /> */}
          <Button raised label="جستجو" disabled={loading} className="w-full search-button"/>
        </div>
      </form>
    </div>
  );
};

export default Mortgage;
