import {IAdCompleteStatusListProps} from '@/app/dashboard/admin/defect-management/(models)/types';
import React, {useCallback, useRef, useState} from 'react';
import {Menu} from 'primereact/menu';
import {useRouter} from 'next/navigation';
import {MenuItem} from 'primereact/menuitem';
import {Column, ColumnBodyOptions} from 'primereact/column';
import {ProgressSpinner} from 'primereact/progressspinner';
import {DataTable} from 'primereact/datatable';
import {IAds} from '@/app/dashboard/admin/ads/(models)/ads';
import {Paginator} from 'primereact/paginator';
import {getLocationLabel, getPurposeLabel, getTypeLabel} from '@/app/dashboard/admin/ads/constant/converter';
import {DeflectManagementTranslations} from '@/app/dashboard/admin/defect-management/Translations';
import {AdCompleteStatusEnum} from '@/app/dashboard/admin/defect-management/(models)/ad-complete-status.enum';
import {ConfirmDialog} from 'primereact/confirmdialog';
import {acceptDeflectFile} from '@/app/dashboard/admin/defect-management/(services)/deflect-management.service';
import {toast} from 'react-toastify';

const DeflectList: React.FC<IAdCompleteStatusListProps> = ({
                                                             data,
                                                             loading,
                                                             totalCount,
                                                             currentPage,
                                                             deflectStatus,
                                                             onPageChange,
                                                             refreshData
                                                           }) => {
  const [selectedDeflect, setSelectedDeflect] = useState<IAds | null>(null);
  const [showRejectConfirmDialog, setShowRejectConfirmDialog] = useState<boolean>(false);
  const [showAcceptConfirmDialog, setShowAcceptConfirmDialog] = useState<boolean>(false);
  const [showAdminNoteDialog, setShowAdminNoteDialog] = useState<boolean>(false);
  const menu = useRef<Menu[]>([]);
  const router = useRouter();

  const getItems = (rowData: IAds): MenuItem[] => {
    return [
      {
        label: 'مشاهده آگهی',
        icon: 'pi pi-eye text-yellow-500 ml-2',
        command: () => {
          window.open(`/dashboard/admin/ads/details/${rowData.id}`, '_blank');
        }
      },
      {
        label: 'مشاهده توضیحات ادمین',
        icon: 'pi pi-comment text-yellow-500 ml-2',
        command: () => setShowAdminNoteDialog(true)
      },
      {
        label: 'تایید',
        icon: 'pi pi-check-circle text-success ml-2',
        command: () => {
          setSelectedDeflect(rowData);
          setShowAcceptConfirmDialog(true);
        }
      },
      {
        label: 'رد',
        icon: 'pi pi-times text-red-500 ml-2',
        command: () => {
          setSelectedDeflect(rowData);
          setShowRejectConfirmDialog(true);
        }
      }
    ];
  };

  // const confirmDelete = async () => {
  //   if (selectedDeflectId != null) {
  //     try {
  //       await onDeleteDeflect(selectedDeflectId);
  //       toast.success('فایل ناقص حذف شد');
  //       refreshData();
  //     } catch (error) {
  //       console.error('Error deleting slider:', error);
  //       toast.error('حذف فایل ناقص با خطا مواجه شد');
  //     } finally {
  //       setDisplayConfirmDialog(false);
  //       setSelectedDeflectId(null);
  //     }
  //   } else {
  //     toast.error('شناسایی فایل ناقص امکان‌پذیر نیست. لطفاً دوباره امتحان کنید.');
  //   }
  // };

  // const cancelDelete = () => {
  //   setDisplayConfirmDialog(false);
  // };

  const acceptFile = useCallback(async () => {
    if (selectedDeflect != null && selectedDeflect.id) {
      const result = await acceptDeflectFile(selectedDeflect.id, selectedDeflect!);
      setSelectedDeflect(null);
      setShowAcceptConfirmDialog(false);
      await refreshData();
    } else {
      toast.error('خطا رخ داد');
    }
  }, [selectedDeflect, setSelectedDeflect])

  const detailsBodyTemplate = (rowData: IAds, options: ColumnBodyOptions) => {
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
        {/*<div className="text-left">*/}
        {/*  <Link href="/dashboard/admin/sliders/create">*/}
        {/*    <Button raised label="ثبت فایل ناقص جدید" className="bg-blue-700 text-white"/>*/}
        {/*  </Link>*/}
        {/*</div>*/}
        <div className="card p-fluid mt-2">
          <h5>لیست فایل‌های ناقص</h5>
          <hr/>
          <div className="card">
            {loading &&
              <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)"
                               animationDuration=".5s"/>}
            <DataTable key={loading ? 'true' : 'false'}
                       value={data}
                       paginator={false}
                       rows={25}
                       totalRecords={totalCount}
                       tableStyle={{minWidth: '50rem'}}
                       className="p-datatable-gridlines"
                       emptyMessage={`فایل ناقص(${DeflectManagementTranslations[deflectStatus as keyof typeof AdCompleteStatusEnum]}) یافت نشد`}>
              <Column key="row" field="row" header="ردیف" style={{width: '5%', textAlign: 'center'}}
                      body={(data, options) => options.rowIndex + 1}></Column>
              <Column field="title" header="عنوان"></Column>
              <Column field="purpose" header="نوع معامله" body={(rowData) => getPurposeLabel(rowData.purpose)}></Column>
              <Column field="location" header="جهت ملک" body={(rowData) => getLocationLabel(rowData.location)}></Column>
              <Column field="type_label" header="نوع ملک" body={(rowData) => getTypeLabel(rowData.type)}></Column>
              <Column field="area" header="متراژ"></Column>
              <Column field="district" header="منطقه"></Column>
              <Column header="" body={detailsBodyTemplate}></Column>
            </DataTable>
            <Paginator dir="ltr"
                       first={(currentPage - 1) * 25}
                       rows={25}
                       totalRecords={totalCount}
                       onPageChange={handlePageChange}/>
          </div>
        </div>
      </div>
      <ConfirmDialog
        visible={showAcceptConfirmDialog}
        onHide={() => setShowAcceptConfirmDialog(false)}
        message="این فایل ناقص را مورد تایید است؟"
        header="تایید فایل ناقص"
        icon="pi pi-exclamation-triangle ml-2 text-red-500"
        accept={acceptFile}
        reject={() => setShowAcceptConfirmDialog(true)}
        acceptLabel="تایید"
        rejectLabel="انصراف"
      />
      // TODO: must add Reject Dialog here
    </div>
  );
};

export default DeflectList;
