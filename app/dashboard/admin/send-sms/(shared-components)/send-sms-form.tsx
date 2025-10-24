'use client';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {IUsers} from '@/app/dashboard/admin/users/(models)/users';
import {getUsers} from '@/app/dashboard/admin/users/(services)/users.service';
import {toast} from 'react-toastify';
import {Button} from 'primereact/button';
import {ISendSms} from '@/app/dashboard/admin/send-sms/(models)/types';
import {sendSmsToUsersByIds} from '@/app/dashboard/admin/send-sms/(services)/send-sms.service';
import {MultiSelect} from 'primereact/multiselect';

const SendSmsForm = () => {
  const [users, setUsers] = useState<IUsers[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ISendSms>({
    users: [],
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      let data;
      data = await getUsers(1);
      setUsers(data.results);
      setLoading(false);
    } catch (error) {
      toast.error('خطایی در بارگزاری داده‌ها رخ داد');
    } finally {
      setLoading(false);
    }
  };


  const handleUsersSelect = (e: any) => {
    setFormData({
      users: e.value ?? []
    })
  };

  // const setValue = useCallback((fieldName: string, fieldValue: any) => {
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     [fieldName]: fieldValue
  //   }));
  // }, []);

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!formData.users.length) {
      toast.error('کاربران را انتخاب کنید');
      return;
    }
    try {
      if (!formLoading) {
        setFormLoading(true);

        // const filterNullValues = (data: ISendSms) => {
        //   return Object.fromEntries(Object.entries(data).filter(([_, value]) => value != null && value !== ''));
        // };

        // const filteredData: Partial<ISendSms> = filterNullValues(formData);
        const result = await sendSmsToUsersByIds(formData);
        toast.success('با موفقیت ارسال شد');
      }
    } catch (error) {
      toast.error('ارسال پیام با خطا روبرو شد');
      console.error('Failed to create ad:', error);
    } finally {
      setTimeout(() => {
        setFormLoading(false);
      }, 5000);
    }
  };

  return (
    <div className="card p-fluid">
      <h5>ارسال پیامک</h5>
      <hr/>

      <form onSubmit={submitForm} className="grid p-fluid mt-6">

        <div className="field col-12 md:col-6 lg:col-5 xl:col-4">
          <span className="p-float-label">
            <MultiSelect name="user_ids"
                         id="user_ids"
                         value={formData.users}
                         onChange={handleUsersSelect}
                         options={users}
                         placeholder="انتخاب کنید"
                         itemTemplate={(user) => (<span>{user.first_name} {user.last_name} ({user.mobile})</span>)}
                         selectedItemTemplate={(user) => (<span className="ml-3">{user?.mobile}</span>)}
                         required/>
              <label htmlFor="user_ids">
                  کاربران <span className="text-red-500">*</span>
              </label>
          </span>
        </div>

        {
          formData?.users?.length > 0 && (<div className="col-12">
            {
              formData?.users?.map((user, index) => (<span key={index}
                                                           className="p-badge p-badge-info d-inline-block px-2 py-1 mx-2 mb-2"
                                                           style={{
                                                             borderRadius: '16px',
                                                             verticalAlign: 'middle',
                                                             height: 'auto',
                                                             lineHeight: 'auto'
                                                           }}>
                <span className="d-inline-block">{user.first_name} {user.last_name}</span>
                <span className="d-inline-block mx-1">({user.mobile})</span>
              </span>))
            }
          </div>)
        }

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
