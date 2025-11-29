import {IAdCompleteStatusListProps} from '@/app/dashboard/admin/defect-management/(models)/types';
import React, {useRef, useState} from 'react';
import {Menu} from 'primereact/menu';
import {MenuItem} from 'primereact/menuitem';
import {Column, ColumnBodyOptions} from 'primereact/column';
import {ProgressSpinner} from 'primereact/progressspinner';
import {DataTable} from 'primereact/datatable';
import {IAds} from '@/app/dashboard/admin/ads/(models)/ads';
import {Paginator} from 'primereact/paginator';
import {getLocationLabel, getPurposeLabel, getTypeLabel} from '@/app/dashboard/admin/ads/constant/converter';
import {DeflectManagementTranslations} from '@/app/dashboard/admin/defect-management/Translations';
import {AdCompleteStatusEnum} from '@/app/dashboard/admin/defect-management/(models)/ad-complete-status.enum';
import {toast} from 'react-toastify';
import {Dialog} from 'primereact/dialog';
import {InputTextarea} from 'primereact/inputtextarea';

const DeflectListComponent: React.FC<IAdCompleteStatusListProps> = ({
                                                                      data,
                                                                      loading,
                                                                      totalCount,
                                                                      currentPage,
                                                                      deflectStatus,
                                                                      onPageChange
                                                                    }) => {
  const [selectedDeflect, setSelectedDeflect] = useState<IAds | null>(null);
  const [showAdminNoteDialog, setShowAdminNoteDialog] = useState<boolean>(false);
  const menu = useRef<Menu[]>([]);

  const getItems = (rowData: IAds): MenuItem[] => {
    const items = [
      {
        label: 'ویرایش آگهی',
        icon: 'pi pi-eye text-yellow-500 ml-2',
        command: () => {
          window.open(`/dashboard/admin/ads/edit/${rowData.id}`, '_blank');
        }
      },
    ];
    if (rowData.complete === AdCompleteStatusEnum.rejected) {
      items.push({
        label: 'مشاهده توضیحات ادمین',
        icon: 'pi pi-comment text-yellow-500 ml-2',
        command: () => {
          if (rowData.complete === AdCompleteStatusEnum.rejected) {
            if (rowData.notes) {
              setSelectedDeflect(rowData);
              setShowAdminNoteDialog(true);
            } else {
              toast.error("توضیحاتی برای رد نقص آگهی ذخیره نشده است")
            }
          } else {
            toast.error("این مورد برای آگهی رد شده قابل نمایش است")
          }
        }
      });
    }
    return items;
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

  return (<div className="grid detailsData">
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
                     first={currentPage * 25}
                     rows={25}
                     totalRecords={totalCount}
                     onPageChange={handlePageChange}/>
        </div>
      </div>
    </div>
    <Dialog header="توضیحات ادمین جهت رد آگهی" visible={showAdminNoteDialog}
            onHide={() => setShowAdminNoteDialog(false)}
            draggable={false}
            className="w-12 md:w-6"
            dismissableMask={true}>
      <hr/>
      <div className="grid p-fluid gap-3">
        <div className="col-12">
          <InputTextarea disabled rows={3} cols={10}
                         value={selectedDeflect?.notes ?? ''}></InputTextarea>
        </div>
      </div>
    </Dialog>
  </div>);
};

export default DeflectListComponent;
