
import React, { useEffect, useState } from 'react';
import moment from 'jalali-moment';
import styles from './timeBanner.module.scss';
import Marquee from "react-fast-marquee";
const TimeBanner = () => {
  const [jalaliTime, setJalaliTime] = useState('');
  const [intervalKey, setIntervalKey] = useState(0)
  useEffect(() => {
    const updateTime = () => {
      const now = moment().locale('fa').format('HH:mm | jD jMMMM jYYYY');
      setJalaliTime(now);
    };

    const resetKeys = () => {
      setIntervalKey(pre => pre + 1)
    }

    updateTime();
    const interval = setInterval(updateTime, 60000); // update every minute
    const intervalKeys = setInterval(updateTime, 1000); 
    return () => {
      clearInterval(interval);
      clearInterval(intervalKeys);
    }
  }, []);
  return (

      <Marquee speed={100} className={styles.wrapper}>
          <span>{jalaliTime} • </span>
      </Marquee>
  )
};

export default TimeBanner;