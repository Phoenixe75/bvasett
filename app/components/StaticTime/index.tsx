import React, {useEffect, useState} from 'react';
import moment from 'jalali-moment';

export const StaticTime = () => {
  const [jalaliTime, setJalaliTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = moment().locale('fa').format('HH:mm | jD jMMMM jYYYY');
      setJalaliTime(now);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // update every minute
    const intervalKeys = setInterval(updateTime, 1000);
    return () => {
      clearInterval(interval);
      clearInterval(intervalKeys);
    }
  }, []);
  return (
    <span className="text-white">{jalaliTime}</span>
  )
}
