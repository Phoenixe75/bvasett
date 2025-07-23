import moment from 'jalali-moment';

export function formatDate(inputDate: Date): string {
    const now = moment();
    const date = moment(inputDate);

    const diffInMinutes = now.diff(date, 'minutes');
    const diffInDays = now.diff(date, 'days');
    if(diffInDays < 2) {
      return "لحظاتی پیش"
    }
    if (diffInMinutes < 60) {
        return `${diffInMinutes} دقیقه پیش`; // 'X minutes ago' in Persian
    } else if (diffInDays < 30) {
        return `${diffInDays} روز پیش`; // 'X days ago' in Persian
    } else {
        return date.locale('fa').format('YYYY-MM-DD'); // Format as 'YYYY-MM-DD'
    }
}