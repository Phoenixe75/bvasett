'use client';
import React, {useEffect, useRef, useState} from 'react';
import {IOrders, IOrdersProps} from '../(models)/payment';
import {ConfirmDialog} from 'primereact/confirmdialog';
import {DataTable} from 'primereact/datatable';
import {Column, ColumnBodyOptions} from 'primereact/column';
import {ProgressSpinner} from 'primereact/progressspinner';
import {toast} from 'react-toastify';
import {Menu} from 'primereact/menu';
import {MenuItem} from 'primereact/menuitem';
import {useRouter} from 'next/navigation';
import {onDeleteOrder} from '../(services)/payment.service';
import {OrderStatusConverter, PaymentStatusConverter} from "../(constants)"

const OrderList: React.FC<IOrdersProps> = ({data, loading, totalCount, currentPage, onPageChange, perPage, refreshData}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [displayConfirmDialog, setDisplayConfirmDialog] = useState<boolean>(false);
  const [userNames, setUserNames] = useState<string[]>([]);
  const menu = useRef<Menu[]>([]);
  const router = useRouter();

  const getItems = (rowData: IOrders): MenuItem[] => {
    return [
      {
        label: 'ویرایش',
        icon: 'pi pi-pencil text-primary ml-2',
        command: () => router.push(`list-payments/edit/${rowData.id}`)
      },
      {
        label: 'حذف',
        icon: 'pi pi-trash text-red-500 ml-2',
        command: () => {
          setSelectedOrderId(rowData.id!);
          setDisplayConfirmDialog(true);
        }
      }
    ];
  };

  const confirmDelete = async () => {
    if (selectedOrderId != null) {
      try {
        await onDeleteOrder(selectedOrderId);
        toast.success('سفارش حذف شد');
        refreshData();
      } catch (error) {
        console.error('Error deleting Order:', error);
        toast.error('حذف سفارش با خطا مواجه شد');
      } finally {
        setDisplayConfirmDialog(false);
        setSelectedOrderId(null);
      }
    } else {
      toast.error('شناسایی سفارش امکان‌پذیر نیست. لطفاً دوباره امتحان کنید.');
    }
  };

  const cancelDelete = () => {
    setDisplayConfirmDialog(false);
  };

  // useEffect(() => {
  //     const fetchUserNames = async () => {
  //         if (data.length > 0) {
  //             const userIds = data.map((item) => item?.customer);
  //             try {
  //                 const users = await Promise.all(userIds.map((id) => getUser(+id!)));
  //                 const names = users.map((user) => user.mobile);
  //                 setUserNames(names);
  //             } catch (error) {
  //                 console.error('Error retrieving questions:', error);
  //             }
  //         }
  //     };

  //     fetchUserNames();
  // }, [data]);

  const detailsBodyTemplate = (rowData: IOrders, options: ColumnBodyOptions) => {
    return (
      <React.Fragment>
        <Menu model={getItems(rowData)} popup ref={(el: Menu) => (menu.current[options.rowIndex] = el)}/>
        <i className="pi pi-bars text-primary cursor-pointer"
           onClick={(event) => menu.current[options.rowIndex].toggle(event)} aria-label="Menu"/>
      </React.Fragment>
    );
  };

  const handlePageChange = (event: any) => {
    onPageChange(event.page + 1);
  };

  return (
    <div className="grid detailsData ">
      <div className="col-12">
        <div className="card p-fluid">
          <h5>لیست سفارش‌ها</h5>{totalCount}
          <hr/>
          {loading &&
            <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)"
                             animationDuration=".5s"/>}
          <DataTable value={data}
                     stripedRows
                     paginator
                     lazy
                     rows={perPage}
                     totalRecords={totalCount}
                     first={(currentPage - 1) * perPage}
                     onPage={handlePageChange}
                     tableStyle={{minWidth: '50rem'}}
                     emptyMessage="سفارشی موجود نیست">
            <Column key="row" field="row" header="ردیف" style={{width: '5%', textAlign: 'center'}}
                    body={(data, options) => options.rowIndex + 1}></Column>
            <Column field="package" header="پکیج"></Column>
            <Column field="order_status" header="وضعیت سفارش"
                    body={(rowData) => OrderStatusConverter(rowData.order_status)}></Column>
            <Column field="payment_status" header="وضعیت پرداخت"
                    body={(rowData) => PaymentStatusConverter(rowData.payment_status)}></Column>
            <Column field="customer" header="کاربر" body={(rowData) => rowData.customer_mobile || 'نامشخص'}></Column>
            <Column header="" body={detailsBodyTemplate}></Column>
          </DataTable>
        </div>
      </div>
      <ConfirmDialog
        visible={displayConfirmDialog}
        onHide={() => setDisplayConfirmDialog(false)}
        message="آیا مطمئن هستید که می‌خواهید این سفارش را حذف کنید؟"
        header="تایید حذف"
        icon="pi pi-exclamation-triangle ml-2 text-red-500"
        accept={confirmDelete}
        reject={cancelDelete}
        acceptLabel="تایید"
        rejectLabel="انصراف"
      />
    </div>
  );
};

export default OrderList;
