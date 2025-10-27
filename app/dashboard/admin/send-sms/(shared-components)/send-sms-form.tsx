'use client';
import React, {useEffect, useState} from 'react';
import {IUsers} from '@/app/dashboard/admin/users/(models)/users';
import {toast} from 'react-toastify';
import {Button} from 'primereact/button';
import {ISmsTemplateInterface, SendSmsDTO} from '@/app/dashboard/admin/send-sms/(models)/types';
import {getSmsTemplates, sendPreformattedSmsToUser} from '@/app/dashboard/admin/send-sms/(services)/send-sms.service';
import {Dropdown} from 'primereact/dropdown';
import {validateTemplateWithPlaceholders} from '@/app/dashboard/admin/send-sms/(models)/sms-template-util';
import {filterUsers, filterUsersByKeyword} from '@/app/components/filterUsers/(services)/filterUsers.service';
import {InputText} from 'primereact/inputtext';
import {convertToEnglishNumbers} from '@/utils/commonFormUtils';

const SendSmsForm = () => {
  const [users, setUsers] = useState<IUsers[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [formData, setFormData] = useState<SendSmsDTO>({
    receiver: '',
    template: '',
    values: {}
  });
  const [formLoading, setFormLoading] = useState(false);
  const [templates, setTemplates] = useState<Array<ISmsTemplateInterface>>([]);
  const [selectedSmsTemplate, setSelectedSmsTemplate] = useState<ISmsTemplateInterface | null>(null);
  const [selectedUser, setSelectedUser] = useState<IUsers | null>(null);
  const [keyword, setKeyword] = useState<string>('');
  const [templateContent, setTemplateContent] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');

  useEffect(() => {
    fetchUsers();
    fetchTemplates();
  }, []);

  const fetchUsers = async (keyword: string = '') => {
    try {
      setLoadingUsers(true);
      let data;
      data = await filterUsersByKeyword(keyword, 1);
      setUsers(data.results);
      setLoadingUsers(false);
    } catch (error) {
      toast.error('خطایی در بارگزاری داده‌ها رخ داد');
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      setLoadingTemplates(true);
      let data;
      // data = await getUsers(1);
      data = await getSmsTemplates();
      setTemplates(data ?? []);
      const latestTemplate = data?.length ? data[data.length - 1] : null;
      if (latestTemplate != null) {
        if (!validateTemplateWithPlaceholders(latestTemplate)) {
          toast.error("خطا در مقادیر تمپلیت پیام");
          return;
        }
        const placeholders: Array<string> = latestTemplate.placeholders;
        const values: any = {};
        placeholders?.forEach(placeholder => {
          values[placeholder] = '';
        })
        setFormData({
          ...formData,
          template: latestTemplate.template,
          values
        })
      }
      setLoadingTemplates(false);
    } catch (error) {
      toast.error('خطایی در بارگزاری داده‌ها رخ داد');
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleTemplateSelect = (e: any) => {
    const selectedTemplateId = e.value?.id;
    if (selectedTemplateId != null) {
      setSelectedSmsTemplate(templates.find(template => `${template.id}` == `${selectedTemplateId}`) ?? null);
    }
  };

  useEffect(() => {
    if (selectedSmsTemplate != null) {
      const values: any = {};
      selectedSmsTemplate?.placeholders?.forEach(placeholder => {
        values[placeholder] = '';
      });
      setFormData({
        ...(formData ?? {}),
        template: selectedSmsTemplate?.id,
        values
      });
    }
  }, [selectedSmsTemplate]);

  const mobileChangeHandler = (e: any) => {
    const enNumber: string = convertToEnglishNumbers(e?.target?.value ?? '');
    setMobileNumber(enNumber);
    setFormData({
      ...formData,
      receiver: enNumber
    })
  }

  const handleUsersSelect = (e: any) => {
    setSelectedUser(e.value ?? null);
    setFormData({
      ...(formData ?? {}),
      receiver: e.value?.mobile,
    });
    setMobileNumber(e.value?.mobile);
  };

  const filterUsersHandler = (event: any) => {
    const filter = event?.filter ?? '';
    setKeyword(filter);
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => fetchUsers(keyword), 700);
    return () => clearTimeout(timeOutId);
  }, [keyword]);

  // const setValue = useCallback((fieldName: string, fieldValue: any) => {
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     [fieldName]: fieldValue
  //   }));
  // }, []);

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!formData.receiver) {
      toast.error('کاربر مورد نظر را انتخاب کنید');
      return;
    }
    try {
      if (!formLoading) {
        setFormLoading(true);

        // const filterNullValues = (data: ISendSms) => {
        //   return Object.fromEntries(Object.entries(data).filter(([_, value]) => value != null && value !== ''));
        // };

        // const filteredData: Partial<ISendSms> = filterNullValues(formData);
        const result = await sendPreformattedSmsToUser(formData);
        setFormData({
          template: '',
          receiver: '',
          values: {}
        });
        setSelectedUser(null);
        setSelectedSmsTemplate(null);
        setTemplateContent('');
        setMobileNumber('');
        toast.success('با موفقیت ارسال شد');
      }
    } catch (error) {
      toast.error('ارسال پیام با خطا روبرو شد');
      console.error('Failed to create ad:', error);
    } finally {
      setTimeout(() => {
        setFormLoading(false);
      }, 3000);
    }
  };

  const selectedUserTemplate = (user: IUsers | null, props: any) => {
    if (user != null) {
      return (
        <div className="flex align-items-center">
          <span>{user?.first_name} {user?.last_name} ({user?.mobile})</span>
        </div>
      );
    }

    return <span>{props?.placeholder}</span>;
  };

  const userOptionTemplate = (user: IUsers) =>
    (<span>{user?.first_name} {user?.last_name} ({user?.mobile})</span>)

  useEffect(() => {
    if (selectedUser?.id && selectedSmsTemplate?.id) {
      const values: any = formData.values ?? {};
      selectedSmsTemplate.placeholders.forEach((placeholder: string) => {
        values[placeholder] = ((selectedUser as any)[placeholder] ?? '')
      });
      setFormData({
        ...formData,
        values
      })
      setTemplateContent((content: string) => {
        selectedSmsTemplate.placeholders.forEach((placeholder: string) => {
          content = selectedSmsTemplate.template.replaceAll(`\${${placeholder}}`, ((selectedUser as any)[placeholder] ?? ''))
        });
        return content;
      })
    }
  }, [selectedUser, selectedSmsTemplate, setFormData, setTemplateContent]);


  return (
    <div className="card p-fluid">
      <h5>ارسال پیامک</h5>
      <hr/>

      {
        templateContent && (
          <div className="p-card">
            <div className="p-card-body">
              {templateContent}
            </div>
          </div>
        )
      }

      <form onSubmit={submitForm} className="grid p-fluid mt-6">

        <div className="field col-12 md:col-6 lg:col-5 xl:col-4">
          <label htmlFor="template">
            تمپلیت پیامک <span className="text-red-500">*</span>
          </label>
          <span className="p-float-label">
            <Dropdown id="template"
                      name="template"
                      type="text"
                      required
                      value={templates?.find(template => `${template?.id}` == `${formData.template}`) || null}
                      options={templates}
                      optionLabel="name"
                      placeholder="انتخاب کنید"
                      onChange={handleTemplateSelect}
            />
          </span>
        </div>

        <div className="field col-12 md:col-6 lg:col-5 xl:col-4">
          <label htmlFor="receiver">
            کاربر
          </label>
          <span className="p-float-label">
            <Dropdown id="receiver"
                      name="receiver"
                      filter
                      onFilter={filterUsersHandler}
                      value={users?.find(user => user?.mobile === formData.receiver) || null}
                      options={users}
                      optionDisabled={() => loadingUsers}
                      optionLabel="mobile"
                      placeholder="انتخاب کنید"
                      onChange={e => handleUsersSelect(e)}
                      itemTemplate={userOptionTemplate}
                      valueTemplate={selectedUserTemplate}
            />
          </span>
        </div>

        <div className="field col-12 md:col-6 lg:col-5 xl:col-4">
          <label htmlFor="receiver">
            شماره موبایل <span className="text-red-500">*</span>
          </label>
          <InputText id="receiver"
                     type="text"
                     dir="ltr"
                     value={mobileNumber}
                     onChange={mobileChangeHandler}/>
        </div>

        <div className="col-12">
          <div className="field flex col-12 md:col-2 ">
            <Button raised type="submit"
                    label="ارسال پیام"
                    className="bg-green-500 text-white border-0 mt-2 ml-2"
                    disabled={formLoading}
                    loading={formLoading}/>
            {/*<Button raised label="بازگشت" type="button" className="bg-gray-300 text-color border-0 mt-2" onClick={back} />*/}
          </div>
        </div>
      </form>
    </div>
  )
};

export default SendSmsForm;
