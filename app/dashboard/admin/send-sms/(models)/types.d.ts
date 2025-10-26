import {IUsers} from '@/app/dashboard/admin/users/(models)/users';

export interface ISendSms {
  users: Array<IUsers>;
}

export interface SendSmsDTO {
  receiver: string;
  template: string | number;
  values: Partial<{
    [key: string]: string;
  }>;
}

export interface ISmsTemplateInterface {
  id: string | number;
  created: string;
  modified: string;
  ordering: number;
  name: string;
  description: string;
  /**
   * this template can use `keyof PlaceholderType` in its context
   */
  template: string;
  placeholders: Array<string>;
}
