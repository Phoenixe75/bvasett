import {ISmsTemplateInterface} from '@/app/dashboard/admin/send-sms/(models)/types';


export const validateTemplateWithPlaceholders = (smsTemplate?: ISmsTemplateInterface) => {
  if (!smsTemplate) {
    return false;
  }
  let valid = true;
  smsTemplate.placeholders?.forEach(placeholder => {
    if (!smsTemplate.template.includes(`\${${placeholder}`)) {
      valid = false;
    }
  });
  return valid;
}
