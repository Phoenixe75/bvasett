export const orderStatus = {
  pending: 0,
  processing: 1,
  completed: 2,
  cancelled: 3,
  failed: 4
} as const;

export const orderStatusOptions = [
  { name: 'در انتظار بررسی', code: 0 },
  { name: 'در حال پردازش', code: 1 },
];