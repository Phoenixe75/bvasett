export const formatCurrency = (amount:number | string) => {
  // Check if the amount is null or undefined
  if (amount === null || amount === undefined) {
      return 'مقدار نامعتبر';
  }

  // Convert the amount to a number
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (numAmount === 0) {
    return " "
  }
  // Check if the conversion resulted in a valid number
  if (isNaN(numAmount)) {
      return 'مقدار نامعتبر';
  }

  // Format the number as TOMAN
  return numAmount.toLocaleString('fa-IR');
};
export function formatMoneyToPersianUnit(amount:number , options?: {returnZero:boolean}) {
  const enToFaDigits = {
    '0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴',
    '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹'
  };
  function formatDecimal(input: string): string {
        const num = parseFloat(input);
        if (isNaN(num)) return input; // return original if not a valid number

        return num % 1 === 0 ? num.toFixed(0) : num.toString();
  }

  const toPersianNumber = (num:number | string) =>
    // @ts-ignore
    num ? num?.toString().replace(/[0-9]/g, (d) => enToFaDigits[d]) : 0;
  if (!amount && !options?.returnZero) {
    return ""
  }
  if (amount >= 1_000_000_000) {
    const billion = formatDecimal((amount / 1_000_000_000).toFixed(2)); // one decimal
    return toPersianNumber(billion) + ' میلیارد';
  } else if (amount >= 1_000_000) {
    const million = formatDecimal((amount / 1_000_000).toFixed(2)); // one decimal
    return toPersianNumber(million) + ' میلیون';
  } else {
    return toPersianNumber(formatDecimal(amount.toString())); // just show the number
  }
}
